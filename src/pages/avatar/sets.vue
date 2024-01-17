<template>
	<view class="avatar">
		<view class="fixed_search">
			<view class="search_box">
				<image src="@/static/home_search@2x.png" class="icon"></image>
				<input type="text" class="input" placeholder="输入姓氏/名字" v-model="value">
				
				<view class="clear_box" @click="clear" v-if="value">
					<image src="@/static/avatar_search_clear@2x.png" class="clear"></image>
				</view>
				<view class="btn" @click="search">搜索</view>
			</view>
		</view>
		<view style="height: 136rpx;"></view>
		<view class="picture_box">
			<picture-list type="avatar" :list="picture" :status="status" size="205" w="33.333%"></picture-list>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onLoad,onReachBottom,onReady} from "@dcloudio/uni-app";
	import fetchWork from '@/services'
	const app = getApp()
	const seriesId = ref("");
	const value = ref("")
	const picture = ref([]);
    const status = ref("loading");
    const page = ref(1);
    const is_load = ref(false);
    const is_search = ref(false);
	const title = ref("");

	onLoad(async (options)=>{
		await app.globalData.checkLogin();
		seriesId.value = options.seriesId;
		pictureMore();
		title.value = options.title;
	})
	onReady(()=>{
		// uni.setNavigationBarTitle({title:title.value})
	})
	const pictureMore = async ()=>{
		const res = await fetchWork('/v1.avatar/series',{page:page.value,limit:18,seriesId:seriesId.value,avatarName:value.value},'POST');
		
        if(res && res.list.length!= 0){
			picture.value = page.value == 1 ? res.list:[...picture.value,...res.list];
			status.value = res.list.length < 18? 'no-more':'more';
			page.value ++;
			is_load.value = res.list.length == 18;
			uni.setNavigationBarTitle({title:res.list[0].series_name})
		}else{
			status.value= "";
			return;
		}

	}
	const search = async ()=>{
		if(value.value){
			picture.value = [];
			page.value = 1;
			is_load.value = false;
			status.value = "loading";
			is_search.value = true;
			pictureMore()
		}
	
	}
	const clear = ()=>{
		value.value = "";
		uni.hideKeyboard();

		if(is_search.value){
			picture.value = [];
			page.value = 1;
			is_load.value = false;
			status.value = "loading";
			is_search.value = false;
			value.value = "";
			pictureMore()
		}
	}
	onReachBottom(()=>{
		if(is_load.value){
            pictureMore();
        }
	})
</script>

<style scoped>
.logo{
		width: 500rpx;height: 136rpx;
		margin: 54rpx auto 0;
		display: block;
	}
	.fixed_search{
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		background-color: #161616;
	}
	.search_box{
		width: 680rpx;height: 96rpx;
		border: 1px solid #6C3FFF;
		border-radius: 48rpx;
		background-color: rgba(108,63,255,0.2);
		box-shadow: 0px 20rpx 24rpx 0px rgba(0,0,0,0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.clear_box{
		position: absolute;
		z-index: 999;
		right: 140rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
	}
	.clear{
		width: 32rpx;height: 32rpx;
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
		width: 160rpx;
		height: 84rpx;
		background: #6C3FFF;
		border-radius: 62rpx;
		color: #fff;
		font-size: 32rpx;
		margin-right: 8rpx;
		text-align: center;
		line-height: 84rpx;
	}
	
	.title{
		font-size: 32rpx;padding: 0 34rpx;
	}
	.picture_box {
		margin-top: -30rpx;
	}

</style>
