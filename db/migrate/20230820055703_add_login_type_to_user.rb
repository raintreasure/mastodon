class AddLoginTypeToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :login_type, :string
  end
end
