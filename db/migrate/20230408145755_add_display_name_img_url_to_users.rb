class AddDisplayNameImgURLToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :display_name, :string
    add_column :users, :img_url, :string
  end
end
