class AddHideContentToStatuses < ActiveRecord::Migration[6.1]
  def change
    add_column :statuses, :stash_content, :boolean
  end
end
