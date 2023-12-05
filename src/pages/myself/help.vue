<template>
  <view class="help">
    <uni-collapse accordion @change ="changItem">
      <uni-collapse-item :border="false" title-border="none" :class="{active:itemValue == index}" 
      :title="index + 1 + '.' + item.title" 
        v-for="(item, index) in list" :key="index"  >
        <text>{{ item.desc }}</text>
      </uni-collapse-item>
    </uni-collapse>

    <view style="height: 240rpx;"></view>
    <view class="btn_box">
      <view class="btn">
      <image src="@/static/help_chat@2x.png" class="wx"></image>
      联系人工客服
    </view>
    <view class="s">工作时间：周一至周五（上午9点-下午6点）</view>
    </view>

  </view>
  
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
const list = ref([]);
const itemValue = ref(-1);

onLoad(() => {
  const obj = {
    title: "作品无法保存或保存失败？",
    desc: "我们提供了3次免费修改机会，请找到你的制作记录，从制作记录打开作品，然后点击【再次修改】按钮进行修改。当3次修改机会用完后将不可再修改，感谢大家的理解。",
    check: false
  }
  const array = new Array(10).fill(null).map(() => {
    return { ...obj }
  });
  list.value = array;

})
const changItem = (e) => {
  if(e == 0){
    uni.navigateTo({
      url:"/pages/myself/detail"
    })
    return;
  }
  itemValue.value = e;
}
</script>

<style scoped>
.help {
  padding: 45rpx
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
  padding:0 0 40rpx;
  background-color: #262626;
}

:global(.help .uni-collapse-item__title-arrow) {
  margin-right: 0;
  transform: rotate(-90deg);
}

:global(.help .uni-collapse-item__title-arrow-active) {
  transform: rotate(0deg);
}
:global(.help .active .uni-collapse-item__title-box){
  color: #FFD717;
}
:global(.help .active .uni-collapse-item__title-box),
:global(.help .active .uni-collapse-item),
:global(.help .active .uni-collapse-item__wrap-content){
  background-color: #342F17 !important;
}

.help .wx{
  width: 40rpx;height: 40rpx;margin-right: 12rpx;
}
.help .btn_box{
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
.help .btn{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600rpx;height: 100rpx;
  background-image: linear-gradient(to right,#EF6929,#FD2C55);
  border-radius: 24rpx;
}
.help .s{
  font-size: 24rpx;margin-top: 24rpx;color: #ACACAC;
}
</style>