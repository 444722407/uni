class CreateAd{
    constructor(adUnitId){
        this.adUnitId = adUnitId;
        this.ad = null;
        this.pages = getCurrentPages();
        this.page = this.pages[this.pages.length-1];
    }
  
    create(successAd,failAd){
        
        if(!this.ad){
            this.ad = tt.createRewardedVideoAd({
                adUnitId:this.adUnitId,
            });
           
            this.success = successAd;
            
            this.fail = failAd;
        }
    }
    look(){
        tt.showLoading();
  
        this.unBindListener();
        this.bindListener();
       
        // 显示广告
        this.ad
          .show()
          .then(() => {
            console.log("广告显示成功");
          })
          .catch((err) => {
            console.log("广告组件出现问题", err);
            // 可以手动加载一次
            this.ad.load().then(() => {
              console.log("手动加载成功");
              // 加载成功后需要再显示广告
              return this.ad.show();
            });
          });
    }
    loadHandler(){
        console.log("拉取广告素材成功");
    }
    errorHandler(error){
        console.log("errorCode: " + error.code);
        console.log("errMsg: " + error.errMsg);
    }
    closeHandler(data){
        tt.hideLoading();
        
        if (data.isEnded) {
            console.log("观看了", data.count, "个视频");
            tt.showLoading({
              title:"请稍等",
              mask:true 
            });
           
            this.success && this.success()
            tt.hideLoading();
          
    
          } else {
            tt.hideLoading();
            console.log("未观看完视频");
            tt.showToast({
              title: "未完成观看,暂未获得免费制作次数",
              icon:'none'
            });
            this.fail && this.fail()
          }    
    }
    bindListener(){
        console.log('bindListener')
        this.ad.onLoad(this.loadHandler);

        this.ad.onError(this.errorHandler);
    
        this.ad.onClose(this.closeHandler.bind(this));
    }
    unBindListener(){
        console.log('unBindListener')
   
        this.ad.offLoad(this.loadHandler);

        this.ad.offError(this.errorHandler);
    
        this.ad.offClose(this.closeHandler.bind(this));
    }
}

export default CreateAd