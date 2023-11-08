class AddMembershipToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :membership, :integer
  end
end
