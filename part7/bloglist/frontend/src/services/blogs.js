// Path operations on the frontend related with blogs

import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const getOne = async (id) => {
  const request = axios.get(`${baseUrl}/${id}`, id)
  const response = await request
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const getComments = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

const addComment = async (blogId, content, author) => {
  const config = token ? { headers: { Authorization: token } } : {}
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { content, author }, config)
  return response.data
}

export default { getAll, getOne, create, update, setToken, remove, getComments, addComment }
