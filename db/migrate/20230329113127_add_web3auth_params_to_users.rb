class AddWeb3authParamsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :web3auth_address, :string
    add_column :users, :web3auth_pubkey, :string
    add_column :users, :web3auth_id_token, :string
  end
end
