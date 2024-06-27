import axios from 'axios'

// A service for user login and token validation endpoints.

const baseUrl = '/api/login'

const login = async (credentials) => {
  const user = await axios.post(baseUrl, credentials)
  return user.data
}

const checkToken = async (token) => {
  const response = await axios.post(`${baseUrl}/checkToken`, { token })
  return response.data
}

export default { login, checkToken }