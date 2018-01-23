import ViewModal from './viewModal'
import wepy from 'wepy'

var info = ''
var vm = null
function CHARACTERISTIC_CHANGE() {
  wepy.onBLECharacteristicValueChange(callback)
}

function callback(res) {
  vm = new ViewModal()
  let buffer = res.value
  let str = String.fromCharCode(...new Uint8Array(buffer))
  info += str
  if (str[str.length - 1] === '}') {
    var temp = info
    info = ''
    console.log(JSON.parse(temp))
    vm.viewModal(JSON.parse(temp))
  }
}

export default CHARACTERISTIC_CHANGE
