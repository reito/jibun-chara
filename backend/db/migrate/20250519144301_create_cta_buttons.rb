class CreateCtaButtons < ActiveRecord::Migration[8.0]
  def change
    create_table :cta_buttons do |t|
      t.references :tenant, null: false, foreign_key: true
      t.string :title
      t.string :url
      t.string :category
      t.boolean :visible
      t.integer :position

      t.timestamps
    end
  end
end
