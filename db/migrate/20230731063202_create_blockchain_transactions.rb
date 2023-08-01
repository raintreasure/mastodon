class CreateBlockchainTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :blockchain_transactions do |t|
      t.string :trx_hash
      t.string :chain_id
      t.string :contract
      t.string :function
      t.string :from
      t.string :to
      t.string :value
      t.string :message
      t.string :timestamp

      t.timestamps
    end
    add_index :blockchain_transactions, :trx_hash, unique: true
  end
end
