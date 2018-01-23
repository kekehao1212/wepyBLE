var loadingState = false
import wepy from 'wepy'
var loading = {
  showLoading(str, mask) {
    if (loadingState) {
      this.hideLoading()
    }
    wepy.showLoading({
      title: str,
      mask: mask
    })
    .then(res => {
      loadingState = true
    })
  },
  hideLoading() {
    wepy.hideLoading()
    loadingState = false
  }
}

export default loading
