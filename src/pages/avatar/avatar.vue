<template>
	<view class="avatar">
		<image src="@/static/avatar_logo@2x.png" class="logo"></image>
		<view class="search_box">
			<image src="@/static/home_search@2x.png" class="icon"></image>
			<input type="text" class="input" placeholder="输入您的姓氏" v-model="value" maxlength="16">
			<image src="@/static/avatar_search_clear@2x.png" class="clear" @click="clear" v-if="value"></image>
			<view class="btn" @click="search">立即匹配</view>
		</view>
		<view class="picture_box">
			<view class="title">{{is_search?'热门头像':'为您匹配以下头像'}}</view>
			<picture-list type="picture" :list="picture" :status="status"></picture-list>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onLoad,onReachBottom} from "@dcloudio/uni-app";
	import fetchWork from '@/services'

	const value = ref("")
	const picture = ref([]);
    const status = ref("loading");
    const page = ref(1);
    const is_load = ref(false);

	onLoad(async ()=>{
		pictureMore();
		
	})
	const pictureMore = async ()=>{
		const res = await fetchWork('/v1.avatar/data_list',{page:page.value,limit:10,avatarName:value.value},'POST');
		
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

	onReachBottom(()=>{
		if(is_load.value){
            pictureMore();
            return;
        }
	})
</script>

<style scoped>
.logo{
		width: 500rpx;height: 136rpx;
		margin: 54rpx auto 0;
		display: block;
	}
	.search_box{
		width: 632rpx;height: 112rpx;
		margin: 70rpx auto 0;
		border: 1rpx solid #6C3FFF;
		background-color: rgba(108,63,255,0.2);
		border-radius: 62rpx;
		box-shadow: 0px 20rpx 24rpx 0px rgba(0,0,0,0.2);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.icon{
		width: 32rpx;height: 32rpx;margin-left: 44rpx;
	}
	.input{
		flex:1;
		height: 100%;
		font-size: 36rpx;
		padding: 0 32rpx;
	}
	.input::-webkit-input-placeholder{
		color: rgba(255,255,255,0.5);
	}
	.btn{
		width: 212rpx;
		height: 96rpx;
		background: #6C3FFF;
		border-radius: 62rpx;
		color: #fff;
		font-size: 32rpx;
		margin-right: 8rpx;
		text-align: center;
		line-height: 96rpx;
	}
	.picture_box{
		margin-top: 60rpx;
	}
	.title{
		font-size: 36rpx;padding: 0 34rpx;font-weight: bold;
	}
	.clear{
		width: 32rpx;height: 32rpx;
		margin-right: 32rpx;
	}
</style>
