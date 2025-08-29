class Tenant < ApplicationRecord
  has_one :user
  has_many :cta_buttons, dependent: :destroy
  has_many :navigation_items, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true,
                  format: { with: /\A[a-z][a-z0-9\-]*[a-z0-9]\z/, message: "は小文字の英字で始まり、小文字の英数字またはハイフンを含むことができます。ハイフンのみの使用はできません。" },
                  length: { minimum: 3, maximum: 50, message: "は3文字以上50文字以下で入力してください" }
  validates :unique_token, presence: true, uniqueness: true
  validates :admin_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "の形式が正しくありません" }

  before_validation :generate_unique_token, on: :create
  before_validation :slug_not_reserved

  private

  def generate_unique_token
    self.unique_token = SecureRandom.urlsafe_base64(20)
  end

  def slug_not_reserved
    reserved_words = %w[admin api auth login logout register]
    if reserved_words.include?(slug)
      errors.add(:slug, "は予約語のため使用できません")
    end
  end
end
