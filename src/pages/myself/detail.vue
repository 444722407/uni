<template>
  <view class="help_detail">
    <view class="title">1. 作品无法保存或保存失败？</view>
    <image src="https://fakeimg.pl/480x860/313131/" class="video"></image>
    <text class="desc">
      \r\n 请按照视频步骤操作：\r\n 1、确认已打开小程序的相册权限。\r\n 2、如果仍然不行，请再确认已打开抖音APP的相册权限。\r\n 3、如果两个权限都已打开仍然不能保存，请联系人工客服。
    </text>
  </view>
</template>

<script setup>
    
</script>

<style scoped>
    .help_detail{
      padding: 45rpx 60rpx;
    }
    .title{
      color: #FFD717;font-size: 34rpx;
    }
    .video{
      width: 480rpx;height: 860rpx;border-radius: 32rpx;
      margin: 36rpx auto 0;
      display: block;
    }
    .desc{
      font-size: 28rpx;color: #fff;margin-top: 54rpx;
    }
</style>