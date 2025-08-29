class NavigationItem < ApplicationRecord
  belongs_to :tenant

  validates :label, presence: true, length: { maximum: 50 }
  validates :url, presence: true, format: { with: URI::DEFAULT_PARSER.make_regexp }
  validates :position, presence: true, uniqueness: { scope: :tenant_id }

  scope :ordered, -> { order(:position) }
end
