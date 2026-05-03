import axios from 'axios'
import { getDeviceId } from './utils/device'

const api = axios.create({
  baseURL: 'https://red-or-blue-0v6a.onrender.com/api'
})

api.interceptors.request.use(async config => {
  const deviceId = await getDeviceId()

  config.headers['x-device-id'] = deviceId

  return config
})

export default api