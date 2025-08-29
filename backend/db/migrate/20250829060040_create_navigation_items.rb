class CreateNavigationItems < ActiveRecord::Migration[8.0]
  def change
    create_table :navigation_items do |t|
      t.references :tenant, null: false, foreign_key: true
      t.string :label
      t.string :url
      t.integer :position

      t.timestamps
    end
  end
end
