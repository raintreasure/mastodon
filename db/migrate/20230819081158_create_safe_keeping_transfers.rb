class CreateSafeKeepingTransfers < ActiveRecord::Migration[6.1]
  def change
    create_table :safe_keeping_transfers do |t|
      t.string :account_type
      t.string :to
      t.string :amount
      t.string :from

      t.timestamps
    end
    add_index :safe_keeping_transfers, [:account_type, :to], unique:false
  end
end
