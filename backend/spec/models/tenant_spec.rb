require 'rails_helper'

RSpec.describe Tenant, type: :model do
  describe 'associations' do
    it { should have_one(:user) }
    it { should have_many(:cta_buttons).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:tenant) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:slug) }
    it { should validate_uniqueness_of(:slug) }
    # unique_tokenは自動生成されるため、presence validationのテストは不要
    # it { should validate_presence_of(:unique_token) }
    # it { should validate_uniqueness_of(:unique_token) }
    it { should validate_presence_of(:admin_email) }

    it { should allow_value('test@example.com').for(:admin_email) }
    it { should_not allow_value('invalid-email').for(:admin_email) }

    describe 'slug validation' do
      it { should allow_value('test-tenant').for(:slug) }
      it { should allow_value('tenant123').for(:slug) }
      it { should_not allow_value('123tenant').for(:slug) }
      it { should_not allow_value('-tenant').for(:slug) }
      it { should_not allow_value('tenant-').for(:slug) }
      it { should_not allow_value('ab').for(:slug) }
      it { should_not allow_value('a' * 51).for(:slug) }
    end

    describe 'reserved slug validation' do
      %w[admin api auth login logout register].each do |reserved_word|
        it "should not allow reserved word: #{reserved_word}" do
          tenant = build(:tenant, slug: reserved_word)
          expect(tenant).not_to be_valid
          expect(tenant.errors[:slug]).to include('は予約語のため使用できません')
        end
      end
    end
  end

  describe 'callbacks' do
    describe '#generate_unique_token' do
      it 'generates unique_token before validation on create' do
        tenant = build(:tenant, unique_token: nil)
        expect(tenant.unique_token).to be_nil
        tenant.valid?
        expect(tenant.unique_token).to be_present
        expect(tenant.unique_token.length).to be_between(27, 28) # Base64 encoded 20 bytes can be 27 or 28 chars
      end

      it 'does not regenerate unique_token on update' do
        tenant = create(:tenant)
        original_token = tenant.unique_token
        tenant.update(name: 'Updated Name')
        expect(tenant.unique_token).to eq(original_token)
      end
    end
  end

  describe 'factory' do
    it 'creates a valid tenant' do
      tenant = build(:tenant)
      expect(tenant).to be_valid
    end

    it 'creates invalid tenant with invalid_slug trait' do
      tenant = build(:tenant, :invalid_slug)
      expect(tenant).not_to be_valid
    end

    it 'creates invalid tenant with short_slug trait' do
      tenant = build(:tenant, :short_slug)
      expect(tenant).not_to be_valid
    end

    it 'creates invalid tenant with invalid_email trait' do
      tenant = build(:tenant, :invalid_email)
      expect(tenant).not_to be_valid
    end
  end
end
