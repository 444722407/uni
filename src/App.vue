<script>
import fetchWork from '@/services'
export default {
  globalData: {
    videoAd:tt.createRewardedVideoAd({
      adUnitId: 'ah1f2uj8j1ew9cqxc5'
    }),
    currentPage: {},
    system: {},
    temp_theme: [],
    checkLogin() {
        return new Promise(async (resolve, reject) => {
          const token = uni.getStorageSync('token');
          if (token) {
            uni.checkSession({
              complete: async (res) => {
                if (res.errMsg != 'checkSession:ok') {
                  await this.userLogin();
                }
                resolve()
              }
            })
          } else {
            
            await this.userLogin();
            resolve()
          }
        })

    },

    userLogin(){
      return new Promise((resolve, reject) => {
        uni.login({
          force: true,
          success(res) {
            const code = res.code;
            fetchWork("/v1.auth/silent_login", { code }, 'POST').then((res) => {
              const token = res.token;
              uni.setStorageSync('token', token);
              resolve()
            })
          },
          fail(err) {
            console.log(`login 调用失败`);
            reject(err)
          },
        })
      })

    }
  },
  methods: {
    getSystem() {
      const system = uni.getSystemInfoSync();
      this.globalData.system = system;
      this.globalData.system.safeAreaInsets.bottom = this.globalData.system.safeAreaInsets.bottom > 20? this.globalData.system.safeAreaInsets.bottom-20:0;
    },
    playAd: function () {
      let videoAd = this.globalData.videoAd

      // 照抄的官方例子
      videoAd
        .show()
        .then(() => {
          console.log("广告显示成功");
        })
        .catch((err) => {
          console.log("广告组件出现问题", err);
          // 可以手动加载一次
          videoAd.load().then(() => {
            console.log("手动加载成功");
            // 加载成功后需要再显示广告
            return videoAd.show();
          });
        });
  },
  },

  onLaunch: function () {
    console.log('App Launch');
    if (this.globalData.videoAd) {

    // onClose只监听一次
    this.globalData.videoAd.onClose(res => {
        if (res.isEnded) {
          // 实现子子页面的closeAdFunction与cancelAdFunction方法
          this.globalData.currentPage.closeAdFunction()
        } else {
          this.globalData.currentPage.cancelAdFunction()
        }
      })
    }
    this.globalData.videoAd.offError(err => {
      this.globalData.currentPage.errorAdFunction(err)
    })

    
    this.getSystem();
  
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
  color: #FFFFFF
}

button {
  padding: 0;
  margin: 0;
  background: none;
}

.dialog {
  width: 560rpx;
  background-color: #fff;
  border-radius: 16rpx;

}

.dialog_title {
  font-size: 36rpx;
  color: #000;
  font-weight: bold;
  padding: 60rpx 40rpx;
  text-align: center;
}

.dialog_subtitle {
  font-size: 28rpx;
  color: #000;
  text-align: center;
  margin-top: -20rpx;
  padding: 0 70rpx 40rpx;
}

.dialog_btn_box {
  border-top: 1px solid rgba(22, 24, 35, 0.12);
  display: flex;
}
.dialog_input{
  display: block;
  width: 80%;
  margin: -30rpx auto 30rpx;
  height: 80rpx;
  border: 1px solid rgba(22, 24, 35, 0.12);
  color: #000;
  border-radius: 10rpx;
  font-size: 32rpx;
  box-sizing: border-box;
  padding: 0 20rpx;
}


.dialog_btn_box .dialog_btn {
  font-size: 32rpx;
  flex: 1;
  text-align: center;
  height: 94rpx;
  line-height: 94rpx;
}

.dialog .dialog_cancel {
  border-right: 1px solid rgba(22, 24, 35, 0.12);
  color: #000;
}
.dialog .dialog_confirm {
  font-weight: bold;
  color: #FD2C55;
}

.uni-dialog-title-text {
  font-size: 36rpx !important;
  color: #000 !important;
  text-align: center !important;
  font-weight: bold !important;
}

.uni-button-color {
  color: #000000 !important;
  font-size: 32rpx !important;
}


</style>



