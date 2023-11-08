class AddDefault0ToMembershipForAccounts < ActiveRecord::Migration[6.1]
  def change
    change_column_default :accounts, :membership, from: nil, to: 0
  end
end
