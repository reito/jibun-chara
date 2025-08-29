class AddVisibleToNavigationItems < ActiveRecord::Migration[8.0]
  def change
    add_column :navigation_items, :visible, :boolean, default: true
  end
end
