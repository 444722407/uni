<template>
	<view class="make">
		<image :src="tempImage" class="tempImage" mode="widthFix"></image>
		<view class="progress_box" v-if="is_progress">
			<view class="t">正在制作中，请不要离开页面</view>
			<view class="progress_wrap">
				<view class="progress" :animation="animationData" @transitionend="end"></view>
			</view>
			<view class="s">马上就好了，请耐心等待</view>
		</view>
		<view class="successs" v-else>
			<view class="s">制作记录只保留7天，请您尽快保存</view>
			<view class="s">当前作品还有<text style="color: #FFD718;">3</text>次修改机会</view>
			<view class="save_box">
				<view class="goback" @click="toBack"><image src="@/static/make_back.png" class="icon_back"></image> 返回修改</view>
				<view class="confrim" @click="toPay">确认提交</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onLoad , onReady} from "@dcloudio/uni-app";
	const tempImage = ref('');
	const animationData = ref({});
	const is_progress = ref(true)
	onLoad((optinos)=>{
		tempImage.value = optinos.tempImage;
		
		
	})
	onReady(()=>{
		var duration = 3000;
		var animation = uni.createAnimation({
			duration,
			timingFunction: 'ease',
			
		})
		animation.width('100%').step();
		animationData.value = animation.export()
	})
	const end = ()=>{
		console.log('end')
		is_progress.value = false;
	}
</script>

<style scoped>
	.make{
		height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
		background-color:#232323;
	}
	.tempImage{
		width: 430rpx;
		display: block;
		margin: 0 auto;
	}
	.progress_box{
		margin-top: auto;
		background-color: #232323;
		height: 328rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		
	}
	.progress_box .t{
		color: #fff;font-size: 32rpx;
	}
	.progress_box .progress_wrap{
		width: 560rpx;
		height: 20rpx;
		border: 1px solid #FFD717;
		border-radius: 10rpx;
		box-sizing: border-box;
		overflow: hidden;
		margin: 40rpx 0;
	}
	.progress_box .s{
		color: #FFD717;font-size: 28rpx;
	}
	.progress{
		background-color: #FFD717;
		border-radius: 10rpx;
		height: 100%;
		width: 0%;
	}
	.save_box{
		display: flex;
		align-items: center;
		font-size: 32rpx;color: #fff;
		margin-top: 45rpx;
	}
	
	.save_box .goback{
		background-color: #494949;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 24rpx;
		width: 240rpx;
		height: 92rpx;
		margin-right:20rpx;
	}
	.save_box .icon_back{
		width: 32rpx;height: 32rpx;
		margin-right: 5rpx;
		margin-top: 3rpx;
	}
	.save_box .confrim{
		background-color: #FD2C55;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 24rpx;
		width: 310rpx;
		height: 92rpx;
	}
	.successs{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: auto;
	}
	.successs .s{
		font-size: 28rpx;color: #fff;
	}
</style>
