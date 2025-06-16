class AddAdminEmailToTenants < ActiveRecord::Migration[8.0]
  def change
    add_column :tenants, :admin_email, :string
  end
end
