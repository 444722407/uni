<template>
    <view class="box">
        <view class="nav_box">
            <view class="nav" :class="{active:navId == 0}" @click="changeNav(0)">壁纸</view>
            <view class="nav" :class="{active:navId == 1}" @click="changeNav(1)">头像</view>
        </view>
        <picture-list type="picture" v-if="navId == 0" ref="picture"></picture-list>
        <picture-list type="avatar"  v-if="navId == 1" ref="avatar"></picture-list>
    </view>
    
</template>

<script setup >
    import {ref} from "vue";
    import { onReachBottom } from "@dcloudio/uni-app";
    const picture = ref(null);
    const avatar = ref(null);
    const navId = ref(0)
    const changeNav = (id)=>{
        navId.value = id;
    } 
    onReachBottom(()=>{
        if(picture.value.is_load && navId.value == 0){
            picture.value.more();
            return;
        }
        if(avatar.value.is_load && navId.value == 1){
            avatar.value.more();
            return;
        }
       
        
    })
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