// Path operations on the frontend related with users

import axios from 'axios'
const baseUrl = '/api/users'

const getUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const getAllUsers = async () => {
  const response = await axios.get(`${baseUrl}`)
  return response.data
}

export default { getUser, getAllUsers }
