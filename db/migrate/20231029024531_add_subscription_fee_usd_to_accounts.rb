class AddSubscriptionFeeUsdToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :subscription_fee_usd, :decimal
  end
end
