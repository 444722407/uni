<template>
    <view class="head">
      <image :src="authorInfo.background_img_url" class="bg" mode="widthFix"></image>
      <view class="user_box">
        <image class="author" :src="authorInfo.avatar_url"></image>
        <view class="aside">
          <view class="name">{{authorInfo.nickname}}</view>
          <view class="copy" @click="copy(authorInfo.code_word)">创作者口令：{{authorInfo.code_word}}  <image src="@/static/author_copy@2x.png" class="icon"></image></view>
        </view>
      </view>
    </view>
    <view class="box">
      <view class="nav_box">
          <view class="nav" :class="{active:navId == 0}" @click="changeNav(0)">壁纸</view>
          <view class="nav" :class="{active:navId == 1}" @click="changeNav(1)">头像</view>
      </view>
      <picture-list type="picture" v-show="navId == 0" :list="picture" :status="status"></picture-list>
      <picture-list type="avatar"  v-show="navId == 1"></picture-list>
  </view>

  
</template>

<script setup >
  import {ref} from "vue";
  import { onLoad,onReachBottom } from "@dcloudio/uni-app";
  import fetchWork from '@/services'
  const picture = ref([]);
  const avatar = ref([]);
  const navId = ref(0)
  const authorInfo = ref({});

  const status = ref("loading");
  

  const changeNav = (id)=>{
      navId.value = id;
  } 
  onLoad(async(options)=>{
    const creator_id = options.creator_id;
    if(creator_id){
       fetchWork('/v1.creator/get_detail',{creator_id}).then((res)=>{

        authorInfo.value = res;
       })

       fetchWork('/v1.creator/get_wallpaper_list',{creator_id}).then((res)=>{
          picture.value= res.list;
          status.value = "";
       })

    }
  })

  const copy = (value)=>{
    uni.setClipboardData({
      data: value,
      success: function () {
        uni.showToast({
            title: '复制成功',
            icon: 'none'
          });
      }
    });
  }
</script>

<style scoped>
	.bg{
		width: 100%;
		position: absolute;
		top:0;
		left: 0;
		z-index: -1;
	}
  .user_box{
    display: flex;
    align-items: center;
    padding: 60rpx 50rpx;
  }
  .author{
    width: 144rpx;height: 144rpx;border-radius: 50%;display: block;
  }
  .aside{
    margin-left: 22rpx;
  }
  .name{
    font-size: 40rpx;
  }
  .copy{
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: rgba(255,255,255,0.8);
    margin-top: 14rpx;
  }
  .icon{
    width: 32rpx;height: 32rpx;
  }
  .box{
    padding: 45rpx 0;
    border-top-right-radius: 40rpx;
    border-top-left-radius: 40rpx;
    background-color: #161616;
  }
  .nav_box{
      display: flex;
      align-items: center;
      padding: 0 45rpx;
  }
  .nav{
      border: 1px solid #505050;
      color: #fff;
      border-radius: 16rpx;
      margin-right: 24rpx;
      width: 200rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      background-color: #161616;
  }
  .active{
      border: 1px solid #FFD717;
      color: #FFD717;
      background-color: #37300F;
  }
</style>