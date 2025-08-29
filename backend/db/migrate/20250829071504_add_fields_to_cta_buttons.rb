class AddFieldsToCtaButtons < ActiveRecord::Migration[8.0]
  def change
    add_column :cta_buttons, :subtitle, :text
    add_column :cta_buttons, :description, :text
  end
end
