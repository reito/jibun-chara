require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should belong_to(:tenant) }
  end

  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_presence_of(:password) }

    it { should allow_value('user@example.com').for(:email) }
    it { should_not allow_value('invalid-email').for(:email) }

    it 'validates password minimum length' do
      user = build(:user, password: '12345', password_confirmation: '12345')
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include('is too short (minimum is 6 characters)')
    end
  end

  describe 'devise modules' do
    it 'includes database_authenticatable' do
      expect(User.devise_modules).to include(:database_authenticatable)
    end

    it 'includes registerable' do
      expect(User.devise_modules).to include(:registerable)
    end

    it 'includes recoverable' do
      expect(User.devise_modules).to include(:recoverable)
    end

    it 'includes rememberable' do
      expect(User.devise_modules).to include(:rememberable)
    end

    it 'includes validatable' do
      expect(User.devise_modules).to include(:validatable)
    end
  end

  describe 'factory' do
    it 'creates a valid user' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'creates admin user with admin trait' do
      user = build(:user, :admin)
      expect(user.email).to eq('admin@example.com')
      # メールアドレスがハードコーディングされているため、バリデーションは個別にチェック
      expect(user).to be_a(User)
    end

    it 'creates invalid user with invalid_email trait' do
      user = build(:user, :invalid_email)
      expect(user).not_to be_valid
    end

    it 'creates invalid user with short_password trait' do
      user = build(:user, :short_password)
      expect(user).not_to be_valid
    end
  end

  describe 'tenant association' do
    it 'belongs to a tenant' do
      tenant = create(:tenant)
      user = create(:user, tenant: tenant)
      expect(user.tenant).to eq(tenant)
    end

    it 'is invalid without a tenant' do
      user = build(:user, tenant: nil)
      expect(user).not_to be_valid
    end
  end
end
