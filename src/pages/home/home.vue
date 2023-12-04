<template>
	<view class="home">
		<image src="@/static/home_bg@2x.png" class="bg" mode="bottom"></image>
		<image src="@/static/home_logo@2x.png" class="logo"></image>
		<view class="search_box">
			<image src="@/static/home_search@2x.png" class="icon"></image>
			<input type="text" class="input" placeholder="输入创作者口令" v-model="value">
			<view class="btn" @click="search">搜索</view>
		</view>
		<view class="user_box">
			<view class="title">优质创作者</view>
			<view class="author_list">
				<navigator url="/pages/author/author" v-for="(item,index) in [1,2,3,4,5]" :key="index" >
					<image class="author" src="https://fakeimg.pl/108x108/ffffff/"></image>
				</navigator>
			</view>
		</view>
		<view class="picture_box">
			<view class="title">精选图片</view>
			<picture-list type="picture" ref="picture"></picture-list>
		</view>
	</view>
	<uni-popup ref="popup">
		<view class="dialog">
			<view class="dialog_title">暂无相关创作者，请换个口令搜索</view>
			<view class="dialog_btn_box">
				<view class="dialog_btn dialog_confirm" @click="confirm">知道了</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {ref,onMounted } from "vue";
    import { onLoad, onReachBottom} from "@dcloudio/uni-app";
	const value = ref("")
    const picture = ref(null);
	const popup = ref(null);
	onMounted(()=>{
		console.log('onMounted')
	})
	onLoad(()=>{
		console.log('onLoad')
	})
    onReachBottom(()=>{
        if(picture.value.is_load){
            picture.value.more();
        }
    })
	const confirm = ()=>{
		popup.value.close()
	}
	const search = ()=>{
		popup.value.open()
	}
</script>

<style scoped>
	.bg{
		width: 100%;
		height: 634rpx;
		position: absolute;
		top:0;
		left: 0;
		z-index: -1;
	}
	.logo{
		width: 440rpx;height: 200rpx;
		margin: 54rpx auto 0;
		display: block;
	}
	.search_box{
		width: 632rpx;height: 112rpx;
		margin: 70rpx auto 0;
		border: 1rpx solid rgba(255,255,255,0.5);
		background-color: rgba(255,255,255,0.2);
		border-radius: 62rpx;
		box-shadow: 0rpx 20rpx 24rpx 0rpx rgba(0,0,0,0.2);
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
		width: 178rpx;
		height: 96rpx;
		background: #FE44B7;
		border-radius: 62rpx;
		color: #fff;
		font-size: 40rpx;
		margin-right: 8rpx;
		text-align: center;
		line-height: 96rpx;
	}

	.user_box{
		margin-top: 84rpx;
	}
	.user_box .author_list{
		display: flex;
		align-items: center;
		margin-top: 36rpx;
		padding: 0 16rpx;
	}
	.user_box .author{
		width: 108rpx;height: 108rpx;
		border: 4rpx solid rgba(255,255,255,0.8);
		margin: 0 16rpx;
		border-radius: 50%;
		display: block;
	}
	.picture_box{
		margin-top: 70rpx;
	}
	.title{
		font-size: 32rpx;padding: 0 34rpx;
	}
</style>
