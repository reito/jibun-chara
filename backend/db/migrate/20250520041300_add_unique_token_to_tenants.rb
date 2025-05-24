class AddUniqueTokenToTenants < ActiveRecord::Migration[8.0]
  def change
    add_column :tenants, :unique_token, :string
    add_index :tenants, :unique_token, unique: true
  end
end 