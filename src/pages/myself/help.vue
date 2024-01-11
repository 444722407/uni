<template>
  <view class="help">
    <!-- <navigator url="/pages/myself/detail?id=0" class="item_cell">
      1、图片无法保存或保存失败？
      <uni-icons type="right" size="14" style="margin-left: auto;" color="rgb(187, 187, 187)"></uni-icons>
    </navigator>
    <navigator url="/pages/myself/detail?id=0" class="item_cell">
      2、保存的壁纸如何设置为手机桌面？
      <uni-icons type="right" size="14" style="margin-left: auto;" color="rgb(187, 187, 187)"></uni-icons>
    </navigator> -->

    <uni-collapse accordion @change="changItem">
      <uni-collapse-item :border="false" title-border="none" :class="{ active: itemValue == index }"
        :title="index +1 + '、' + item.title" v-for="(item, index) in list" :key="index">
        <text>{{ item.desc }}</text>
      </uni-collapse-item>
    </uni-collapse>

    <view style="height: 240rpx;"></view>
    <view class="btn_box">
      <button class="btn" data-im-id="55023321576" open-type="im">
        <image src="@/static/help_chat@2x.png" class="wx"></image>
        联系人工客服
      </button>
      <view class="s">工作时间：周一至周五（上午9点-下午6点）</view>
    </view>

  </view>
</template>

<script setup>
    import { ref } from "vue";
    const list = ref([
      {
        title: "图片无法保存或保存失败？",
        desc: "确认已打开小程序的相册权限。如果仍然不行，请再确认已打开抖音APP的相册权限。如果两个权限都已打开仍然不能保存，请联系人工客服。",
   
      },
      {
        title: "保存的壁纸如何设置为手机桌面？",
        desc: "保存壁纸之后，请打开你的手机相册，找到保存的壁纸，点击【更多】，点击【设为壁纸】，可以选择设置为锁屏壁纸或者桌面壁纸。",
   
      },
    {
      title: "保存的壁纸可以修改吗？",
      desc: "我们提供了3次免费修改机会，请找到你的制作记录，从制作记录打开作品，然后点击【再次修改】按钮进行修改。\r\n注意，当3次修改机会用完后将不可再修改，感谢大家的理解。",
   
    },
    {
      title: "付款后不想要了，可以退款吗？",
      desc: "这是属于虚拟商品，下单后不支持退款，希望您能理解。如有疑问，请咨询客服。",
     
    },
    {
      title: "为什么收费？",
      desc: "亲爱的用户，平台的运行是需要大量成本的，例如设计师费用、技术开发费用、服务器费用等人员和运营成本。收费是为了平台的可持续发展，这样我们才能不断提供更好的图片内容给用户。希望您能理解。",
    
    },
    {
      title: "会不会下个月自动连续扣费？",
      desc: "不会。由您自己选择购买制作次数。我们不存在包年包月等自动续费服务，请放心使用。",
    
    },
    {
      title: "我制作的图片可以保存多久？",
      desc: "您制作好的图片，我们只会保存7天，超过7天将自动删除。所以当制作好图片后，请您务必要保存到自己的手机相册。您保存到相册后，只要自己不删除就可以永久使用。",
     
    },
    {
      title: "保存到相册后无法找到？",
      desc: "有一些手机可能需要等待3分钟才能在相册看到。\r\n如果仍然找不到，请在你的手机上找到【文件管理】，在文件管理里面查看图片文件。",
    
    },
    {
      title: "还有更多问题？",
      desc: "如果上面的常见问题没有解决您的疑虑，可点击页面底部【联系人工客服】进行咨询。\r\n温馨提示：工作时间为周一至周五9点至18点，敬请谅解",
     
    },
    ]);
const itemValue = ref(-1);

const changItem = (e) => {
  itemValue.value = e;
}
</script>

<style scoped>
.help {
  padding: 45rpx
}
.item_cell{
  height: 120rpx;
  display: flex;
  align-items: center;
  background-color: #262626;
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  padding: 0 40rpx;
  font-size: 28rpx;
  color: #fff;
}

:global(.help .uni-collapse) {
  background-color: transparent;
}

:global(.help .uni-collapse-item__title-box) {
  background-color: #262626;
  color: #fff;
  padding: 0;
  height: 120rpx;
  line-height: 120rpx;
}

:global(.help .uni-collapse-item) {
  background-color: #262626;
  color: #fff;
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  padding: 0 40rpx;
}

:global(.help .uni-collapse-item__wrap-content) {
  font-size: 28rpx;
  color: #fff;
  padding: 0 0 40rpx;
  background-color: #262626;
}

:global(.help .uni-collapse-item__title-arrow) {
  margin-right: 0;
  transform: rotate(-90deg);
}

:global(.help .uni-collapse-item__title-arrow-active) {
  transform: rotate(0deg);
}

:global(.help .active .uni-collapse-item__title-box) {
  color: #FFD717;
}

:global(.help .active .uni-collapse-item__title-box),
:global(.help .active .uni-collapse-item),
:global(.help .active .uni-collapse-item__wrap-content) {
  background-color: #342F17 !important;
}

.help .wx {
  width: 40rpx;
  height: 40rpx;
  margin-right: 12rpx;
}

.help .btn_box {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #000;
  height: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
}

.help .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600rpx;
  height: 100rpx;
  background-image: linear-gradient(to right, #EF6929, #FD2C55);
  border-radius: 24rpx;
  color: #fff;
}

.help .s {
  font-size: 24rpx;
  margin-top: 24rpx;
  color: #ACACAC;
}</style>