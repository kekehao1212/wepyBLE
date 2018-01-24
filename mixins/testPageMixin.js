import wepy from 'wepy'
import { BLE_INIT, CLOSE_CONNECTION } from '../BLE/connection'
import WRITE_BLE_DEIVCE from '../BLE/writeValue'
import parseUrl from '../utils/parseUrl'
import globalData from '../state/globalData'
var vibrateInterval
export default class testPageMixin extends wepy.mixin {
  data = {
    showScanButton: true,
    testValue: undefined,
    connectState: undefined,
    backButton: undefined,
    deviceName: undefined,
    timer: undefined
  }
  watch = {
    deviceName(newVal, oldVal) {
      console.log(`newValdeviceName ${newVal} oldValdeviceName ${oldVal}`)
      if (newVal) {
        this.showScanButton = false
        BLE_INIT({
          deviceName: this.deviceName,
          serviceId: globalData.serviceId,
          characteristicId: globalData.characteristicId
        })
          .then(res => {
            wepy.onBLEConnectionStateChange(res => {
              if (res.errorCode['0'] !== '0') {
                this.closeOperation()
                .then(res => {
                  wepy.showModal({
                    title: '连接异常',
                    content: '连接已经断开',
                    showCancel: false
                  })
                  this.deviceName = undefined
                  this.showScanButton = true
                  this.$apply()
                })
              }
            })
            globalData.deviceId = res
            wepy.setKeepScreenOn({
              keepScreenOn: true
            })
            vibrateInterval = setInterval(() => {
              wepy.vibrateLong({})
            }, 1800)
            this.$invoke('viewModal', 'CHARACTERISTIC_CHANGE', '').then(() => {
              console.log('write 0x00')
              WRITE_BLE_DEIVCE('0x00')
            })
            console.log(globalData.deviceId)
          })
          .catch(res => {
            console.log(res)
          })
      }
    },
    timer(newVal, oldVal) {
      if (this.timer === 0) {
        this.closeOperation()
      }
    },
    testValue(newVal, oldVal) {
      if (this.testValue) {
        WRITE_BLE_DEIVCE('0x04').then(res => {
          console.log('write 0x04 success')
          console.log(this.timer)
          this.timer = 0
          this.$apply()
        })
      }
    }
  }
  closeOperation() {
    return new Promise((resolve, reject) => {
      console.log(this.connectState)
      if (this.connectState) {
        CLOSE_CONNECTION().then(res => {
          console.log(res)
          this.connectState = false
          this.$apply()
          wepy.setKeepScreenOn({
            keepScreenOn: false
          })

          clearInterval(vibrateInterval)
          vibrateInterval = null
          resolve()
        })
      } else {
      }
    })
  }

  onLoad(options) {
    console.log(globalData.url)
    options = options || {}
    let scene = options.q ? parseUrl(decodeURIComponent(options.q)) : null
    this.deviceName = scene && scene.deviceName ? scene.deviceName : null
  }

  onHide() {
    this.closeOperation()
  }
  onUnLoad() {
    this.closeOperation()
  }
}
