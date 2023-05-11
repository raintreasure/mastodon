class AddGivenNativeTokenToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :given_native_token, :boolean
  end
end
