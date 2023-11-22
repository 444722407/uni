<template>
	<view class="draw">
		<view class="canvas_box">
			<canvas-drag id="canvas-drag" :graph="graph" :width="474" :height="1026" :enableUndo="true" ref="canvas" @getData="getData" @changeImg="changeImg" @selectImgId="selectImgId"></canvas-drag>
		</view>
		<view class="menu_nav">
			<view class="item" :class="{active:navId == 0}" @click="changeNav(0)">换图片</view>
			<view class="item" :class="{active:navId == 1}" @click="changeNav(1)">换文字</view>
			<view class="help" @click=""><image src="@/static/icon_when.png" class="icon_help"></image> 操作说明</view>
		</view>
		<view class="menu_img" v-show="navId == 0">
			<template  v-for="(item,index) in temp_theme" >
				<view class="item" v-if="item.type != 'bg'" :key="index" @click.stop="selectImg(item.id)" >
					<view class="mask" v-if="item.selected" @click.stop="changeImg(item.id)"><image src="@/static/make_pic_mask.png" class="mask_img"></image></view>
					<image :src="item.url" class="item_img"></image>
				</view>
			</template>
		</view>

		<view class="menu_text" v-show="navId == 1">
			<scroll-view scroll-x="true" class="scroll_w">
				<view class="input_box">
					<input type="text" class="input">
				</view>
				<view class="input_box">
					<input type="text" class="input">
				</view>
				<view class="input_box">
					<input type="text" class="input">
				</view>
				<view class="input_box">
					<input type="text" class="input">
				</view>
			</scroll-view>
		</view>
		
		<view class="btn_box">
			<view class="btn" @click="toImage">立即制作</view>
			<view class="jump">
				<image src="@/static/make_history.png" class="icon_hisory"></image>
				制作记录
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onReady } from "@dcloudio/uni-app";
	const  graph = ref({})
	const canvas = ref(null)
	const navId = ref(0);

	var temp_theme = ref([
		{"type":"bg","url":"../../static/canvas_bg.png","y":0,"x":0,"w":1080,"h":2336,"rotate":0,"index":2},
		{"type":"image","url":"../../static/canvas_item.jpg","y":970,"x":300,"w":600,"h":600,"rotate":0,"index":0,"id":1,"selected":true},
		{"type":"text","url":"https://lf3-static.bytednsdoc.com/obj/eden-cn/kuLauvyM-tyvmahsWulwV-upfbvK/ljhwZthlaukjlkulzlp/pc/Logo.png","y":160,"x":150,"w":608,"h":128,"rotate":0,"index":0,"id":3}
	]);     

	// ps中的像素转成rpx 在转成canvas中的px
	const sysInfo = uni.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
	const ratio = 1080 / 474;

	temp_theme.value.map((item)=>{
		item.w = item.w / ratio * (screenWidth / 750);
		item.h = item.h / ratio * (screenWidth / 750);
		item.x = item.x / ratio * (screenWidth / 750);
		item.y = item.y / ratio * (screenWidth / 750);
	})
	temp_theme.value.sort((a, b) => a.index - b.index);
	onReady(function(){
		setTimeout(() => {
			canvas.value.initByArr(temp_theme.value)
		}, 1000);
	})
	const onExportJSON = ()=>{
		canvas.value.exportJson().then((imgArr) => {
            console.log(JSON.stringify(imgArr));
        })
		.catch((e) => {
			console.error(e);
		});
	}
	const selectImg = (id)=>{
		temp_theme.value.map((item)=>item.selected = false);
		temp_theme.value.map((item)=>item.selected = item.id == id);
		
		canvas.value.initByArr(temp_theme.value);
		canvas.value.selectImg(id)

	}
	// canvas选中元素后 同桌父组件更新按钮
	const selectImgId = (id)=>{
		
		temp_theme.value.map((item)=>item.selected = false);
		temp_theme.value.map((item)=>item.selected = item.id == id)
	}
	const changeImg = (id)=>{
		
		uni.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			camera: 'back',
			success:(res)=> {
				const url = res.tempFiles[0].tempFilePath;
				uni.getImageInfo({
					src:url,
					success:(image)=>{
						temp_theme.value.map((item)=>item.selected = false);
						temp_theme.value.map((item)=>{
							if(item.id == id){
								item.w = image.width;
								item.h = image.height;
								item.url = url;
								item.selected = true;
							}
						})
						canvas.value.initByArr(temp_theme.value)
					}
				})
	
			}
		})
	}
	const getData = (item)=>{
		const {id,x,y,w,h,rotate} = item;
		
		temp_theme.value.map((t)=>{
			if(t.id == id){
				t.x = x;
				t.y = y;
				t.w = w;
				t.h = h;
				t.rotate = rotate;
			}
		})
	
	}
	const changeNav = (id)=>{
		navId.value = id;
	}
	const toImage = ()=>{
		canvas.value.export().then((res)=>{
			console.log(res)
			wx.previewImage({
				urls: [res]
			})
		})
	}
</script>

<style>
	.draw{
		height: 100vh;
		overflow: hidden;
	}
	.menu_nav{
		display: flex;
		align-items: center;
		height: 80rpx;
		padding: 0 16rpx 0 30rpx;
		background-color: #232323;
	}
	
	.menu_nav .item{
		color: #fff;
		font-size: 28rpx;
		line-height: 80rpx;
		margin: 0 30rpx;
		position: relative;
	}
	.menu_nav .active{
		color: #FFD717;
	}
	.menu_nav .active::after{
		content: "";
		width: 100%;
		height: 4rpx;
		border-radius: 4rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #FFD717;
	}
	.menu_nav .help{
		margin-left: auto;
		color: #909090;
		font-size: 24rpx;
		display: flex;
		align-items: center;
	}
	.icon_help{
		width: 32rpx;height: 32rpx;
		margin-right: 4rpx;
	}
	.menu_img{
		display: flex;
		padding: 30rpx 60rpx;
	}
	.menu_img .item{
		position: relative;
		width: 120rpx;height:120rpx;
		border: 1px solid #FFD717;
		border-radius: 16rpx;
		overflow: hidden;
		margin-right: 24rpx;
	}
	.menu_img .mask_img{
		position: absolute;
		z-index: 2;
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}
	.item_img{
		width: 120rpx;height:120rpx;
		border-radius: 16rpx;
		display: block;
	}
	.btn_box{
		padding: 0 60rpx;
		display: flex;
		align-items: center;
	}
	.btn{
		width: 500rpx;height: 92rpx;
		border-radius: 24rpx;
		background-color: #FD2C55;
		font-size: 36rpx;
		color: #fff;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.jump{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #fff;
		margin-left: auto;
	}
	.jump .icon_hisory{
		width: 48rpx;height: 48rpx;
	}
	.menu_text{
		padding: 30rpx 60rpx;
	}
	.scroll_w{
		white-space: nowrap;
		
	}
	.input_box{
		display: inline-block;
		width: 300rpx;height: 100rpx;
		border-radius: 16rpx;
		border: 1px solid #FFD717;
		margin-right: 24rpx;
	}
	.input_box .input{
		width: 100%;
		height: 100%;
		line-height: 100rpx;
		padding: 0 34rpx;
		box-sizing: border-box;
		font-size: 32rpx;
		color: #fff;
	}
</style>
