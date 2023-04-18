class AddNewbalanceIncrementToStatuses < ActiveRecord::Migration[6.1]
  def change
    add_column :statuses, :new_balance, :decimal
    add_column :statuses, :balance_increment, :decimal
  end
end
