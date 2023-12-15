<template>
	<view class="picture">
		<view class="fixed">
			<view class="search_box">
				<image src="@/static/home_search@2x.png" class="icon"></image>
				<input type="text" class="input" placeholder="请输入关键字搜索" :focus="true" v-model="value" maxlength="16"/>
				<view class="btn" @click="search">搜索</view>
			</view>
		</view>
		<view style="height: 156rpx;"></view>

		<view class="picture_box" v-show="is_result">
            <view class="title">搜索结果</view>
			<picture-list type="picture" :list="picture" :status="status" text="没有相关结果，换个词重新搜索吧"></picture-list>
		</view>

        <view class="picture_box" v-show="!is_result && keys.length">
            <view class="title">猜你想找</view>
			<view class="hot_keys">
				<view class="item_search" v-for="item in keys" @click="toResult(item)" :key="item">
					<image src="@/static/icon_hot_search.png" class="icon_hot_search"></image>
					{{item}}
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {ref,watch} from "vue";
	import { onLoad} from "@dcloudio/uni-app";
	import fetchWork from '@/services'

	const value = ref("");
	const keys = ref([]);
	const picture = ref([]);
    const status = ref("loading");

    const is_result = ref(false);

	watch(value,(newQuestion)=>{
		if(newQuestion == ""){
			is_result.value = false;
		}
	})
	onLoad(async ()=>{
		fetchWork('/v1.wallpaper/get_guest_want_keyword').then((res) => {
			keys.value = res;
		})
		
	})
	const search = async () => {
	if (value.value) {
			fetchWork('/v1.wallpaper/search', { search: value.value }).then((res) => {
				picture.value = res.list;
				is_result.value = true;
				status.value = ''; 
			})
		}
	}
	const toResult = (key)=>{
		value.value = key;
		search()
	}
	
</script>

<style scoped>
	.fixed{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 9;
		background-color: #161616;
	}
	.search_box{
		width: 680rpx;height: 96rpx;
		margin: 40rpx auto 0;
		border: 1rpx solid #353535;
		background-color: #232323;
		border-radius: 48rpx;
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
		color: #fff;
	}
	.input::-webkit-input-placeholder{
		color: rgba(255,255,255,0.5);
	}
	.btn{
		width: 160rpx;
		height: 84rpx;
		background: #FFD717;
		border-radius: 48rpx;
		color: #000;
		font-size: 32rpx;
		margin-right: 6rpx;
		text-align: center;
		line-height: 84rpx;
	}
	.nav{
		height: 100rpx;
		margin-top: 20rpx;
	}
	.scroll_box{
		height: 100rpx;
		width: 100%;
		white-space: nowrap;
		box-sizing: border-box;
		padding-left: 30rpx;
	}
	.item{
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #C5C5C5;
		padding: 0 24rpx;
		display: inline-block;
		position: relative;
	}
	.active{
		color: #FFD717;
		transition: .1s color;
	}
	.active::after{
		content: "";
		width: 40rpx;height: 8rpx;
		background-color: #FFD717;
		border-radius: 4rpx;
		position: absolute;
		bottom: 10rpx;
		left: 50%;
		margin-left: -20rpx;
		animation: ani_width .1s;
	}
	
	@keyframes ani_width{
		0%{
			width: 0;
		}
		100%{
			width: 40rpx;
		}
	}
    .title {
        font-size: 36rpx;
        padding: 0 34rpx;
		font-weight: bold;
    }
	.hot_keys{
		display: flex;
		flex-wrap: wrap;
		padding: 18rpx;
	}
	.hot_keys .item_search {
		width: 332rpx;height: 80rpx;
		display: flex;
		align-items: center;
		background-color: #232323;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		color: #FFD717;
		font-size: 28rpx;
		margin: 12rpx;
	}
	.hot_keys .icon_hot_search{
		width: 32rpx;height: 32rpx;
		margin-right: 24rpx;
	}
	.picture_box{
		margin-top: 40rpx;
	}
</style>
