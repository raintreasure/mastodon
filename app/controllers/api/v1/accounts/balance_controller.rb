# frozen_string_literal: true

class Api::V1::Accounts::BalanceController < Api::BaseController

  before_action -> { doorkeeper_authorize! :write, :'write:balance' }
  before_action :require_user!
  before_action :set_account, only: [:update]

  def earn_online
    current_account.increment(:balance, ONLINE_REWARD)
    current_account.save!
    render json: {'new_balance': current_account.balance}
  end
  def get_balance
    render json: {'balance': current_account.balance}
  end

  private

  def set_account
    # @account = Account.find(params[:account_id])
  end

  def increment_param
    params.permit(:increment)
  end

  rescue Mastodon::NotPermittedError
    not_found


end
