class AddBalanceToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :balance, :decimal
  end
end
