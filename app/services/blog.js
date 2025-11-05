const API_BASE_URL = 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
  }
}

const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  
  return data
}

export const blogService = {
  async getAllBlogs(page = 1, limit = 10) {
    const response = await fetch(
      `${API_BASE_URL}/blogs?page=${page}&limit=${limit}`
    )
    return handleResponse(response)
  },

  async getBlog(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`)
    return handleResponse(response)
  },

  async createBlog(blogData) {
    const formData = new FormData()
    formData.append('title', blogData.title)
    formData.append('content', blogData.content)
    
    if (blogData.image) {
      formData.append('image', blogData.image)
    }

    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })
    
    return handleResponse(response)
  },

  async updateBlog(id, blogData) {
    const formData = new FormData()
    formData.append('title', blogData.title)
    formData.append('content', blogData.content)
    
    if (blogData.image) {
      formData.append('image', blogData.image)
    }

    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    })
    
    return handleResponse(response)
  },

  async deleteBlog(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    
    return handleResponse(response)
  },

  async getUserBlogs(page = 1, limit = 10) {
    const response = await fetch(
      `${API_BASE_URL}/user/my-blogs?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders(),
      }
    )
    
    return handleResponse(response)
  },

  async getDashboard() {
    const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: getAuthHeaders(),
    })
    
    return handleResponse(response)
  }
}