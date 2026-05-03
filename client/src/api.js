import axios from 'axios'
import { getDeviceId } from './utils/device'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use(async config => {
  const deviceId = await getDeviceId()

  config.headers['x-device-id'] = deviceId

  return config
})

export default api