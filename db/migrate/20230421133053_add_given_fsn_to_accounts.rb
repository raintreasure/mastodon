class AddGivenFsnToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :given_fsn, :boolean
  end
end
