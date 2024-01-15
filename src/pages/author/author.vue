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
      <picture-list type="picture" v-show="navId == 0" :list="picture" :status="status1"></picture-list>
      <picture-list type="avatar"  v-show="navId == 1" :list="avatar"  :status="status2"></picture-list>
  </view>

  
</template>

<script setup >
  import {ref} from "vue";
  import { onLoad,onReachBottom } from "@dcloudio/uni-app";
  import fetchWork from '@/services'


  const navId = ref(0)
  const authorInfo = ref({});
  const creator_id =  ref("");
  const picture = ref([]);
  const avatar = ref([]);

  const status1 = ref("loading");
  const page1 = ref(1);
  const is_load1 = ref(false);

  const status2 = ref("loading");
  const page2 = ref(1);
  const is_load2 = ref(false);
  

  const changeNav = (id)=>{
      navId.value = id;
  } 
  const avatarMore = async ()=>{
    
      const res = await fetchWork('/v1.avatar/creator',{page:page2.value,limit:10,creatorId:creator_id.value},'POST');

      if(res && res.list.length!= 0){
          
          avatar.value = page2.value == 1 ? res.list:[...avatar.value,...res.list];
          status2.value = res.list.length < 10? 'no-more':'more';
          page2.value ++;
          is_load2.value = res.list.length == 10;
      }else{
          status2.value= "";
          return;
      }
    }
  onLoad(async(options)=>{
    creator_id.value = options.creator_id;
    if(creator_id){
       fetchWork('/v1.creator/get_detail',{creator_id:creator_id.value}).then((res)=>{
          authorInfo.value = res;
       })

       fetchWork('/v1.creator/get_wallpaper_list',{creator_id:creator_id.value}).then((res)=>{
          picture.value= res.list;
          status1.value = "";
       })
       avatarMore();
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
  onReachBottom(()=>{
   
		if(is_load2.value && navId.value == 1){
        avatarMore();
    }
	})

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