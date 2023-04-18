# frozen_string_literal: true

class Api::V1::Statuses::FavouritesController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:favourites' }
  before_action :require_user!
  before_action :set_status, only: [:create]

  def create
    FavouriteService.new.call(current_account, @status)
    # update earn token
    previous_op = EarnRecord.find_by(account_id: current_account.id, target_id: @status.id, op_type: :favourite)
    should_reward = false
    if !previous_op.present?
      # first execute this op, reward token
      current_account.increment(:balance, FAVOURITE_REWARD)
      current_account.save!
      should_reward = true
    end
    EarnRecord.create!(account_id: current_account.id, target_id: @status.id, op_type: :favourite, earn: FAVOURITE_REWARD);
    @status.new_balance = current_account.balance
    @status.balance_increment = should_reward ? FAVOURITE_REWARD : 0
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    fav = current_account.favourites.find_by(status_id: params[:status_id])

    if fav
      @status = fav.status
      UnfavouriteWorker.perform_async(current_account.id, @status.id)
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    render json: @status, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, favourites_map: { @status.id => false })
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
