class CreateAccountSubscriptions < ActiveRecord::Migration[6.1]
  def change
    create_table :account_subscriptions do |t|
      t.bigint :account_id, null: false
      t.bigint :target_account_id, null: false

      t.timestamps
    end

    add_index :account_subscriptions, [:account_id, :target_account_id], unique: true
  end
end
