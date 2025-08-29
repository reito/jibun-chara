require 'rails_helper'

RSpec.describe "Api::V1::NavigationItems", type: :request do
  let(:tenant) { create(:tenant) }
  let(:user) do
    create(:user, tenant: tenant).tap do |u|
      u.update(
        authentication_token: 'valid_token_123',
        token_expires_at: 1.hour.from_now
      )
    end
  end
  let(:headers) { { 'Authorization' => "Bearer #{user.authentication_token}" } }

  describe 'GET /api/v1/navigation_items' do
    before do
      create(:navigation_item, tenant: tenant, label: 'Item 1', url: 'https://example.com/1', position: 1)
      create(:navigation_item, tenant: tenant, label: 'Item 2', url: 'https://example.com/2', position: 2)
    end

    context 'with valid authentication' do
      it 'returns navigation items for the tenant' do
        get '/api/v1/navigation_items', headers: headers
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['data'].length).to eq(2)
        expect(json_response['data'].first['label']).to eq('Item 1')
      end
    end

    context 'without authentication' do
      it 'returns unauthorized' do
        get '/api/v1/navigation_items'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/tenants/:tenant_slug/navigation_items' do
    before do
      create(:navigation_item, tenant: tenant, label: 'Public Item', url: 'https://example.com/public', position: 1)
    end

    it 'returns navigation items without authentication' do
      get "/api/v1/tenants/#{tenant.slug}/navigation_items"
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response['status']).to eq('success')
      expect(json_response['data'].first['label']).to eq('Public Item')
    end

    it 'returns error for invalid tenant slug' do
      get '/api/v1/tenants/invalid-slug/navigation_items'
      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response['status']).to eq('error')
    end
  end

  describe 'POST /api/v1/navigation_items' do
    context 'with valid params' do
      let(:valid_params) do
        {
          navigation_item: {
            label: 'New Item',
            url: 'https://example.com/new',
            position: 1
          }
        }
      end

      it 'creates a new navigation item' do
        expect {
          post '/api/v1/navigation_items', params: valid_params, headers: headers
        }.to change(NavigationItem, :count).by(1)

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['data']['label']).to eq('New Item')
      end
    end

    context 'with invalid params' do
      let(:invalid_params) do
        {
          navigation_item: {
            label: '',
            url: '',
            position: 1
          }
        }
      end

      it 'returns validation errors' do
        post '/api/v1/navigation_items', params: invalid_params, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
      end
    end
  end

  describe 'POST /api/v1/navigation_items/bulk_update' do
    context 'with valid navigation items' do
      let(:bulk_params) do
        {
          navigation_items: [
            { label: 'Item 1', url: 'https://example.com/1', position: 1, visible: true },
            { label: 'Item 2', url: 'https://example.com/2', position: 2, visible: false }
          ]
        }
      end

      it 'creates new navigation items and destroys existing ones' do
        existing_item = create(:navigation_item, tenant: tenant, label: 'Old Item', position: 1)
        initial_count = NavigationItem.count

        expect {
          post '/api/v1/navigation_items/bulk_update', params: bulk_params, headers: headers
        }.to change(NavigationItem, :count).by(1)

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['data'].length).to eq(2)

        expect(NavigationItem.exists?(existing_item.id)).to be false

        # visible属性が正しく保存されているか確認
        items = tenant.navigation_items.reload.ordered
        expect(items[0].visible).to be true
        expect(items[1].visible).to be false
      end
    end

    context 'with empty items (should be skipped)' do
      let(:empty_bulk_params) do
        {
          navigation_items: [
            { label: '', url: '', position: 1, visible: true },
            { label: 'Valid Item', url: 'https://example.com/valid', position: 2, visible: true }
          ]
        }
      end

      it 'skips empty items and saves only valid ones' do
        post '/api/v1/navigation_items/bulk_update', params: empty_bulk_params, headers: headers
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['data'].length).to eq(1)
        expect(json_response['data'][0]['label']).to eq('Valid Item')
      end
    end

    context 'with invalid navigation items' do
      let(:invalid_bulk_params) do
        {
          navigation_items: [
            { label: 'Invalid URL', url: 'not-a-url', position: 1 },
            { label: 'Valid Item', url: 'https://example.com/valid', position: 2 }
          ]
        }
      end

      it 'returns errors for invalid items' do
        post '/api/v1/navigation_items/bulk_update', params: invalid_bulk_params, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response['errors']).to include(match(/1番目:/))
      end
    end
  end

  describe 'PUT /api/v1/navigation_items/:id' do
    let(:navigation_item) { create(:navigation_item, tenant: tenant) }

    context 'with valid params' do
      let(:update_params) do
        {
          navigation_item: {
            label: 'Updated Label',
            url: 'https://example.com/updated'
          }
        }
      end

      it 'updates the navigation item' do
        put "/api/v1/navigation_items/#{navigation_item.id}", params: update_params, headers: headers
        expect(response).to have_http_status(:success)
        navigation_item.reload
        expect(navigation_item.label).to eq('Updated Label')
      end
    end
  end

  describe 'DELETE /api/v1/navigation_items/:id' do
    let(:navigation_item) { create(:navigation_item, tenant: tenant) }

    it 'destroys the navigation item' do
      delete "/api/v1/navigation_items/#{navigation_item.id}", headers: headers
      expect(response).to have_http_status(:success)
      expect(NavigationItem.exists?(navigation_item.id)).to be false
    end
  end
end
