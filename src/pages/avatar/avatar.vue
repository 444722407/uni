<template>
	<view class="avatar">
		<image src="@/static/avatar_logo@2x.png" class="logo"></image>
		<view class="search_box">
			<image src="@/static/home_search@2x.png" class="icon"></image>
			<input type="text" class="input" placeholder="输入姓氏/名字" v-model="value" maxlength="16">
		
			<view class="clear_box" @click="clear" v-if="value">
				<image src="@/static/avatar_search_clear@2x.png" class="clear"></image>
			</view>
			<view class="btn" @click="search">立即匹配</view>
		</view>
		<view class="picture_box">
			<view class="title">{{is_search?'为您匹配以下头像':'热门头像'}}</view>

			<view v-show="!is_search">
				<picture-list type="avatar" :list="picture" :status="status1" url="sets"></picture-list>
			</view>
			<view v-show="is_search">
				<picture-list type="avatar" :list="searchData" :status="status2" url="detail"></picture-list>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onLoad,onReachBottom} from "@dcloudio/uni-app";
	import fetchWork from '@/services'

	const value = ref("");
	const is_search = ref(false);
	const picture = ref([]);
	const searchData = ref([]);


    const status1 = ref("loading");
    const page1 = ref(1);
    const is_load1 = ref(false);
	
	const status2 = ref("loading");
    const page2 = ref(1);
    const is_load2 = ref(false);


	onLoad(async ()=>{
		pictureMore();
		
	})
	const searchMore = async ()=>{
		const res = await fetchWork('/v1.avatar/data_list',{page:page2.value,limit:10,avatarName:value.value},'POST');
		
        if(res && res.list.length!= 0){
			searchData.value = page2.value == 1 ? res.list:[...searchData.value,...res.list];
			status2.value = res.list.length < 10? 'no-more':'more';
			page2.value ++;
			is_load2.value = res.list.length == 10;
		}else{
			status2.value= "";
			return;
		}
	}
	const pictureMore = async ()=>{
		const res = await fetchWork('/v1.avatar/recommend',{page:page1.value,limit:10},'POST');
		
        if(res && res.list.length!= 0){
			
			picture.value = page1.value == 1 ? res.list:[...picture.value,...res.list];
			status1.value = res.list.length < 10? 'no-more':'more';
			page1.value ++;
			is_load1.value = res.list.length == 10;
		}else{
			status1.value= "";
			return;
		}

	}
	const search = async ()=>{
		if(value.value){
			searchData.value = [];
			page2.value = 1;
			is_load2.value = false;
			status2.value = "loading";
			is_search.value = true;
			searchMore()
		}
		
	}
	const clear = ()=>{
		value.value = "";
		uni.hideKeyboard();

		if(is_search.value){
			page2.value = 1;
			is_load2.value = false;
			status2.value = "loading";
			is_search.value = false;
		}
		
	}
	onReachBottom(()=>{
		if(is_load1.value && !is_search.value){
            pictureMore();
        }
		if(is_load2.value && is_search.value){
            searchMore();
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
		position: relative;
	}
	.icon{
		width: 32rpx;height: 32rpx;margin-left: 44rpx;
	}
	.input{
		flex:1;
		height: 100%;
		font-size: 36rpx;
		padding: 0 64rpx 0 32rpx;
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
	.clear_box{
		position: absolute;
		z-index: 999;
		right: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
	}
	.clear{
		width: 32rpx;height: 32rpx;
	}
</style>
