class AddEthAddressToAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :eth_address, :string
  end
end
