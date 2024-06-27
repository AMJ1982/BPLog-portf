import axios from 'axios'
import { buildDataObject } from '../util/helpers'

// Server connections for entry related endpoints. The token for user authorization is needed in
// some endpoints of the server.
const baseUrl = '/api/entries'
let token = null

// A method for setting the value of user token. This is used in loginReducer when user is logging in,
// or when already logged in user data is read from local storage.
const setToken = (newToken) => {
  token = newToken ? `bearer ${newToken}` : null
}

// Fetching all data for the logged user.
const getAll = async () => {
  const userId = token !== null ? JSON.parse(window.localStorage.getItem('bplogUser')).id : null
  const response = await axios.get(`${baseUrl}`, { params: { userId } })
  return buildDataObject(response.data)
}

// Creating a new entry.
const create = async (entry) => {
  const config = { 
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}`, entry, config)
  return response.data
}

// Updating an existing entry.
const update = async (entry) => {
  const response = await axios.put(`${baseUrl}/${entry.id}`, entry)
  return response.data
}

// Removing an entry.
const remove = async (entryId) => {
  return await axios.delete(`${baseUrl}/${entryId}`, { headers: { 'Authorization': token } })
}

export default { getAll, create, update, remove, setToken }