var deviceName
var deviceId
var characteristicId
var serviceId
var foundDevice = false

import 'wepy-async-function'
import loading from '../state/loading'
import wepy from 'wepy'
function CLOSE_CONNECTION() {
  return new Promise((resolve, reject) => {
    wepy
      .closeBLEConnection({
        deviceId: deviceId
      })
      .then(res => {
        wepy.closeBluetoothAdapter().then(res => {
          console.log('close bluetooth adapter')
          deviceId = undefined
          deviceName = undefined
          resolve()
        })
      })
  })
}

function ON_DEVICE_FOUND(resolve, reject) {
  wepy.onBluetoothDeviceFound(function(res) {
    if (res.devices[0].localName === deviceName) {
      deviceId = res.devices[0].deviceId
      console.log('deviceId', deviceId)
      foundDevice = true
      wepy.stopBluetoothDevicesDiscovery().then(res => {
        CREATE_CONNECTION(resolve, reject)
        console.log('stop discovery')
      })
    }
  })
}

// function CONNECTION_CHANGE() {
//   wepy.onBLEConnectionStateChange(function(res) {
//     console.log(res)
//   })
// }

function CREATE_CONNECTION(resolve, reject) {
  wepy
    .createBLEConnection({
      deviceId: deviceId
    })
    .then(res => {
      GET_DEVICE_INFO(resolve, reject)
    })
    .catch(res => {
      wepy
        .showModal({
          title: '连接失败',
          content: '请尝试重新连接',
          showCancel: false
        })
        .then(res => {
          if (res.confirm) CREATE_CONNECTION(resolve, reject)
        })
    })
}

function OPEN_NOTIFY(resolve, reject) {
  wepy
    .notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      state: true
    })
    .then(res => {
      loading.hideLoading()
      console.log('open notify')
      resolve(deviceId)
    })
}

async function GET_DEVICE_INFO(resolve, reject) {
  await wepy.getBLEDeviceServices({
    deviceId: deviceId
  })
  await wepy
    .getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId
    })
    .then(res => {
      console.log(res)
      OPEN_NOTIFY(resolve, reject)
    })
}

function ADAPTER_STATE_CHANGE(resolve, reject) {
  wepy.onBluetoothAdapterStateChange(function(res) {
    console.log(res)
    if (
      res.available === true &&
      res.discovering === false &&
      foundDevice === false
    ) {
      ON_DEVICE_FOUND(resolve, reject)
      BLE_SEARCH_DEVICE()
    }
  })
}

function BLE_OPEN_ADAPTER(resolve, reject) {
  wepy
    .openBluetoothAdapter()
    .then(res => {
      console.log('open adapter')
      ON_DEVICE_FOUND(resolve, reject)
      BLE_SEARCH_DEVICE()
    })
    .catch(res => {
      ADAPTER_STATE_CHANGE(resolve, reject)
      wepy.showModal({
        title: '初始化失败',
        content: '请确认蓝牙是否打开',
        showCancel: false
      })
    })
}

function BLE_SEARCH_DEVICE() {
  loading.showLoading('连接设备中')
  wepy.startBluetoothDevicesDiscovery().then(res => {
    console.log('open search')
  })
}

function BLE_INIT(options) {
  try {
    deviceName = options.deviceName
    serviceId = options.serviceId
    characteristicId = options.characteristicId
  } catch (e) {
    console.log(e)
    return
  }
  return new Promise((resolve, reject) => {
    BLE_OPEN_ADAPTER(resolve, reject)
  })
}

export { BLE_INIT, CLOSE_CONNECTION }
