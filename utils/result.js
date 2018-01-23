
export default (item, value, longitude, latitude) => {
  var obj = {
    project: item,
    value: value,
    longitude: longitude,
    latitude: latitude,
    runAt: Date.now()
  }
  return obj
}
