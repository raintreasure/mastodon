class AddSubscriptionFeeToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :subscription_fee, :decimal
  end
end
