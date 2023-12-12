<script>
import fetchWork from '@/services'
export default {
  globalData: {
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
    },
    
  },

  onLaunch: function () {
    console.log('App Launch');
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

.dialog_btn_box .dialog_btn {
  color: #000;
  font-size: 32rpx;
  flex: 1;
  text-align: center;
  height: 94rpx;
  line-height: 94rpx;
}

.dialog .dialog_cancel {
  border-right: 1px solid rgba(22, 24, 35, 0.12);
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
}</style>
