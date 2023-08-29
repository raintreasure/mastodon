class Api::V1::Accounts::SubscribingAccountsController < Api::BaseController

  def index
    subscribing_accounts = AccountSubscription.where(account: current_account)
    # subscribing_accounts.each do |record|
    #   puts(">>>>>>>>>>>>>>>>>>>>>>>>>target account id is #{record.target_account_id}")
    #
    # end
    render json: subscribing_accounts, each_serializer: REST::AccountSubscriptionSerializer,  status: 200
  end
end

