import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface RegistrationData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface LoginData {
  email: string
  password: string
  tenant_slug: string
}

export const createInvitation = async (tenantData: {
  name: string
  slug: string
  admin_email: string
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/invitations`, {
      tenant: tenantData,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessages = error.response?.data?.errors || []
      throw new Error(
        errorMessages.join('\n') || '招待リンクの生成に失敗しました',
      )
    }
    throw error
  }
}

export const registerUser = async (token: string, data: RegistrationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/registration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || '登録に失敗しました')
    }
    throw error
  }
}

export const loginUser = async (data: LoginData) => {
  try {
    const { tenant_slug, ...loginData } = data
    const response = await axios.post(
      `${API_BASE_URL}/tenants/${tenant_slug}/sessions`,
      loginData
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'ログインに失敗しました')
    }
    throw error
  }
}

export const logoutUser = async (token: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'ログアウトに失敗しました',
      )
    }
    throw error
  }
}

export const validateSession = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'セッションが無効です')
    }
    throw error
  }
}
