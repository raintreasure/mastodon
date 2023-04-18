class CreateEarnRecords < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!
  def change
    create_table :earn_records do |t|
      t.bigint :account_id
      t.bigint :target_id
      t.string :op_type
      t.decimal :earn

      t.timestamps
    end
    add_index :earn_records, [:account_id, :op_type], unique: false, algorithm: :concurrently
  end
end
