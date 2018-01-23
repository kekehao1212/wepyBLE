import wepy from 'wepy'
import { BLE_INIT, CLOSE_CONNECTION } from '../BLE/connection'
import WRITE_BLE_DEIVCE from '../BLE/writeValue'
import parseUrl from '../utils/parseUrl'
import globalData from '../state/globalData'
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
            globalData.deviceId = res
            this.$invoke('test', 'CHARACTERISTIC_CHANGE', '')
            .then(() => {
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
        CLOSE_CONNECTION().then(res => {
          this.connectState = false
          this.$apply()
        })
      }
    },
    testValue(newVal, oldVal) {
      if (this.testValue) {
        WRITE_BLE_DEIVCE('0x04')
        .then(res => {
          console.log('write 0x04 success')
          this.timer = 0
          this.$apply()
        })
      }
    }
  }

  onLoad(options) {
    options = options || {}
    let scene = options.q ? parseUrl(decodeURIComponent(options.q)) : null
    this.deviceName = scene && scene.deviceName ? scene.deviceName : null
  }

  onHide() {
    if (this.connectState) {
      CLOSE_CONNECTION().then(res => {
        console.log(res)
        this.connectState = false
      })
    }
  }
  onUnLoad() {
    if (this.connectState) {
      CLOSE_CONNECTION().then(res => {
        console.log(res)
        this.connectState = false
      })
    }
  }
}
