# frozen_string_literal: true

class Api::V1::Statuses::ReblogsController < Api::BaseController
  include Authorization
  include Redisable
  include Lockable

  before_action -> { doorkeeper_authorize! :write, :'write:statuses' }
  before_action :require_user!
  before_action :set_reblog, only: [:create]

  override_rate_limit_headers :create, family: :statuses

  def create
    with_redis_lock("reblog:#{current_account.id}:#{@reblog.id}") do
      @status = ReblogService.new.call(current_account, @reblog, reblog_params)
    end

    # update earn token
    previous_op = EarnRecord.find_by(account_id: current_account.id, target_id: @reblog.id, op_type: :retweet)
    should_reward = false
    if !previous_op.present?
      # check if reach the daily reward limit
      earned = EarnRecord.where("created_at >= ?", 24.hours.ago).where(account_id: current_account.id).sum(:earn)
      if (earned < getDailyRewardLimit)
        # not reach daily limit & first execute this op, reward token
        current_account.increment(:balance, getRetweetReward)
        current_account.save!
        should_reward = true
      end
    end
    EarnRecord.create!(account_id: current_account.id, target_id: @status.id, op_type: :favourite, earn: getRetweetReward);
    @status.new_balance = current_account.balance
    @status.balance_increment = should_reward ? getRetweetReward : 0
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    @status = current_account.statuses.find_by(reblog_of_id: params[:status_id])

    if @status
      authorize @status, :unreblog?
      @status.discard
      RemovalWorker.perform_async(@status.id)
      @reblog = @status.reblog
    else
      @reblog = Status.find(params[:status_id])
      authorize @reblog, :show?
    end

    render json: @reblog, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, reblogs_map: { @reblog.id => false })
  rescue Mastodon::NotPermittedError
    not_found
  end

  private

  def set_reblog
    @reblog = Status.find(params[:status_id])
    authorize @reblog, :show?
  rescue Mastodon::NotPermittedError
    not_found
  end

  def reblog_params
    params.permit(:visibility)
  end
end
