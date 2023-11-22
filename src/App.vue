<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
	page {
		background-color: #161616;
		color:#FFFFFF
	}
  .uni-dialog-title{
    display: none !important;
  }
  .uni-dialog-button:nth-child(1){
    display: none !important;
  }
  .uni-border-left{
    border: 0 !important;
  }
  .uni-dialog-content{
    padding: 50rpx !important;
  }
  .uni-dialog-content-text{
    font-size: 36rpx !important;
    color: #000 !important;
    text-align: center !important;
    font-weight: bold !important;
  }
  .uni-button-color{
    color: #000000 !important;
    font-size: 32rpx !important;
  }
</style>
