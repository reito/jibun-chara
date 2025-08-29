class CtaButton < ApplicationRecord
  belongs_to :tenant
  
  validates :title, length: { maximum: 100 }
  validates :url, format: { with: URI::DEFAULT_PARSER.make_regexp }, if: :url_present?, allow_blank: true
  validates :position, presence: true, uniqueness: { scope: :tenant_id }
  
  private
  
  def url_present?
    url.present?
  end
  
  scope :visible_items, -> { where(visible: true) }
  scope :ordered, -> { order(:position) }
end
