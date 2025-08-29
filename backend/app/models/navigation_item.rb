class NavigationItem < ApplicationRecord
  belongs_to :tenant

  validates :label, presence: true, length: { maximum: 50 }
  validates :url, format: { with: URI::DEFAULT_PARSER.make_regexp }, if: :url_present?

  private

  def url_present?
    url.present?
  end
  validates :position, presence: true, uniqueness: { scope: :tenant_id }

  scope :visible_items, -> { where(visible: true) }
  scope :ordered, -> { order(:position) }
end
