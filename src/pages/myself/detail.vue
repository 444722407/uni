<template>
  <view class="help_detail">
    <view class="title">{{detail[id].title}}</view>
    <video :src="detail[id].video" class="video"></video>
    <text class="desc">
    {{detail[id].desc}}
    </text>
  </view>
</template>

<script setup>
     import {ref} from "vue";
     const id = ref(0);
     const detail = ref([{
        title:"1、图片无法保存或保存失败？",
        video:"https://ttzl.oss-cn-hangzhou.aliyuncs.com/down/zhouxiaowa/tuwang_video_test.MOV",
        desc:"\r\n 请按照视频步骤操作：\r\n 1、确认已打开小程序的相册权限。\r\n 2、如果仍然不行，请再确认已打开抖音APP的相册权限。\r\n 3、如果两个权限都已打开仍然不能保存，请联系人工客服。"
     },
     {
        title:"2、保存的壁纸如何设置为手机桌面？",
        video:"https://ttzl.oss-cn-hangzhou.aliyuncs.com/down/zhouxiaowa/tuwang_video_test.MOV",
        desc:"\r\n 华为手机步骤操作：待定 \r\n 小米手机步骤操作：待定 \r\n OPPO手机步骤操作：待定 \r\n vivo手机操作步骤：待定"
     }])
     import { onLoad } from "@dcloudio/uni-app";
     onLoad((options)=>{
      id.value = options.id;
     })
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