import FingerprintJS from '@fingerprintjs/fingerprintjs'

export async function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId')

  if (deviceId) {
    return deviceId
  }

  const fp = await FingerprintJS.load()
  const result = await fp.get()

  deviceId = result.visitorId

  localStorage.setItem('deviceId', deviceId)

  return deviceId
}