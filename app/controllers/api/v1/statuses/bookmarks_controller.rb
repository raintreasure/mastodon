# frozen_string_literal: true

class Api::V1::Statuses::BookmarksController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:bookmarks' }
  before_action :require_user!
  before_action :set_status, only: [:create]

  def create
    current_account.bookmarks.find_or_create_by!(account: current_account, status: @status)
    # update earn token
    previous_op = EarnRecord.find_by(account_id: current_account.id, target_id: @status.id, op_type: :bookmark)
    should_reward = false
    if !previous_op.present?
      # check if reach the daily reward limit
      earned = EarnRecord.where("created_at >= ?", 24.hours.ago).where(account_id: current_account.id).sum(:earn)
      if (earned < getDailyRewardLimit)
        # not reach daily limit & first execute this op, reward token
        current_account.increment(:balance, getBookmarkReward)
        current_account.save!
        should_reward = true
      end
    end
    EarnRecord.create!(account_id: current_account.id, target_id: @status.id, op_type: :favourite, earn: getBookmarkReward);
    @status.new_balance = current_account.balance
    @status.balance_increment = should_reward ? getBookmarkReward : 0
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    bookmark = current_account.bookmarks.find_by(status_id: params[:status_id])

    if bookmark
      @status = bookmark.status
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    bookmark&.destroy!

    render json: @status, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, bookmarks_map: { @status.id => false })
  rescue Mastodon::NotPermittedError
    not_found
  end

  private

  def set_status
    @status = Status.find(params[:status_id])
    authorize @status, :show?
  rescue Mastodon::NotPermittedError
    not_found
  end
end
