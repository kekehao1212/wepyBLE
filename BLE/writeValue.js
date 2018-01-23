import cmdBuffer from './cmd.js'
import globalData from '../state/globalData'
import wepy from 'wepy'
var bufferArray = []

function WRITE_BLE_DEIVCE(cmd) {
  return new Promise((resolve, reject) => {
    let typeArray = cmdBuffer(cmd)
    for (let i = 0; i < typeArray.length; i += 20) {
      let subbuffer
      if (i + 20 < typeArray.length) {
        subbuffer = typeArray.buffer.slice(i, i + 20)
      } else {
        subbuffer = typeArray.buffer.slice(i, typeArray.length)
      }
      bufferArray.push(subbuffer)
    }
    writeControl(0, resolve, reject)
  })
}

function writeControl(index, resolve, reject) {
  write(bufferArray[index], index)
    .then(index => {
      if (index < bufferArray.length - 1) {
        writeControl(index + 1, resolve, reject)
      } else {
        resolve()
        bufferArray = []
      }
    })
    .catch(index => {
      writeControl(index, resolve, reject)
    })
}

function write(buffer, index) {
  console.log(String.fromCharCode(...new Uint8Array(buffer)))
  return new Promise((resolve, reject) => {
    wepy
      .writeBLECharacteristicValue({
        deviceId: globalData.deviceId,
        serviceId: globalData.serviceId,
        characteristicId: globalData.characteristicId,
        value: buffer
      })
      .then(res => {
        resolve(index)
      })
      .catch(res => {
        reject(index)
      })
  })
}
export default WRITE_BLE_DEIVCE
