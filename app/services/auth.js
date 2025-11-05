const API_BASE_URL = 'http://localhost:8080/api'

const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  
  return data
}

export const authService = {
  async signup(fullName, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password }),
    })
    
    return handleResponse(response)
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    return handleResponse(response)
  },

  async getGoogleAuthUrl() {
    const response = await fetch(`${API_BASE_URL}/auth/google`)
    return handleResponse(response)
  },

  async googleAuth(idToken) {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
    
    return handleResponse(response)
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No token found')
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    const data = await handleResponse(response)
    return data.user
  },

  getToken() {
    return localStorage.getItem('token')
  }
}