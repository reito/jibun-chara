class Tenant < ApplicationRecord
  has_many :cta_buttons, dependent: :destroy
end
