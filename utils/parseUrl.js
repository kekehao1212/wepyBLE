export default function(url) {
  if (!url) {
    return null
  }
  var obj = {}
  var query = url.split("?")[1];
  var queryArr = query.split("&");
  queryArr.forEach(function (item) {
    var value = item.split("=")[0];
    var key = item.split("=")[1];
    obj[value] = key;
  });
  return obj;
}
