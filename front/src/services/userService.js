import axios from 'axios'

// Connections to endpoints for user management.

const baseUrl = '/api/users'
let token = null

const setToken = (newToken) => {
  token = newToken ? `bearer ${newToken}` : null
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data  
}

const create = async (user) => {
  const response = await axios.post(baseUrl, user)
  return response.data
}

const update = async (user) => {
  const config = { 
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${user.id}`, user, config)
  return response.data
}

export default { getAll, getOne, create, update, setToken }