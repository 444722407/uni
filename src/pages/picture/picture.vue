<template>
	<view class="picture">
		<view class="fixed">
			<view class="search_box">
				<image src="@/static/home_search@2x.png" class="icon"></image>
				<input type="text" class="input" placeholder="输入创作者口令" v-model="value">
				<view class="btn" @click="search">搜索</view>
			</view>
			<view class="nav">
				<scroll-view class="scroll_box" scroll-x="true" :scroll-left="left" scroll-with-animation="true">
					<view v-for="(item,index) in navList" :key="index" class="item" :class="{active:navId == index}" @click="changNav(index)">{{ item }}</view>
				</scroll-view>
			</view>
		</view>
		<view style="height: 256rpx;"></view>
		<view class="picture_box" style="margin-top: -20rpx;">
			<picture-list type="picture" ref="picture"></picture-list>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onReachBottom} from "@dcloudio/uni-app";
	const navList = ref(['全部','上新','励志壁纸','励志壁纸','祝福壁纸','1','123']);
	const left = ref(0)
	const navId = ref(0);
	const changNav = (index)=>{
		navId.value = index;
		left.value = index>3?index* 60:0
	}
	const picture = ref(null);

	onReachBottom(()=>{
		if(picture.value.is_load){
			picture.value.more();
		}
	})
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
</style>
