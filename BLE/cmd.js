import globalData from '../state/globalData'
function getCmd0() {
  return {
    cmd: 0,
    id: globalData.student.id,
    name: globalData.student.base64_name,
    longitude: globalData.longitude,
    latitude: globalData.latitude
  }
}
var cmd4 = {
  cmd: 4
}

function cmdBuffer(cmd) {
  if (cmd === '0x00') {
    let typedArray = Uint8Array.from(
      Array.from(JSON.stringify(getCmd0())).map(e => e.charCodeAt(0))
    )
    return typedArray
  } else if (cmd === '0x04') {
    let typedArray = Uint8Array.from(
      Array.from(JSON.stringify(cmd4)).map(e => e.charCodeAt(0))
    )
    return typedArray
  } else {
    return null
  }
}

export default cmdBuffer
