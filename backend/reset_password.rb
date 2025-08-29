#!/usr/bin/env ruby
require_relative 'config/environment'

user = User.find_by(email: 'zhenlinshannei@gmail.com')
if user
  user.password = 'password123'
  user.password_confirmation = 'password123'
  user.save!
  puts "Password reset for #{user.email}"
  puts "Tenant: #{user.tenant.slug}"
else
  puts "User not found"
end
