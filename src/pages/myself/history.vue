<template>
    <view class="box">
        <view class="nav_box">
            <view class="nav" :class="{active:navId == 0}" @click="changeNav(0)">壁纸</view>
            <view class="nav" :class="{active:navId == 1}" @click="changeNav(1)">头像</view>
        </view>
        <picture-list type="picture" v-show="navId == 0"  :list="picture" :status="status"></picture-list>
        <picture-list type="avatar"  v-show="navId == 1" ></picture-list>
    </view>
    
</template>

<script setup >
    import {ref} from "vue";
    import { onShow,onReachBottom } from "@dcloudio/uni-app";
	import fetchWork from '@/services'

    const picture = ref([]);
    const avatar = ref([]);

    const navId = ref(0)

    const status = ref("loading");
    const page = ref(1);
    const is_load = ref(false);

    const pictureMore = async ()=>{

        const res = await fetchWork('/v1.user/get_wallpaper_browse_record',{page:page.value});
    
        if(res && res.list.length!= 0){
			picture.value = page.value == 1 ? res.list:[...picture.value,...res.list];
			status.value = res.list.length < 10? 'no-more':'more';
			page.value ++;
			is_load.value = res.list.length == 10;
		}else{
			status.value= "";
			return;
		}
    }
    onShow(()=>{
        picture.value = [];
        page.value = 1;
        pictureMore()
	})

    onReachBottom(()=>{
  
        if(picture.value.is_load && navId.value == 0){
            pictureMore();
            return;
        }
        if(avatar.value.is_load && navId.value == 1){
            avatar.value.more();
            return;
        }
        
    })
    const changeNav = (id)=>{
        navId.value = id;
    } 
</script>

<style scoped>
    .box{
		padding: 45rpx 0;
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