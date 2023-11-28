<template>
	<view class="draw">
		<view class="canvas_box">
			<canvas-drag id="canvas-drag" :graph="graph" :width="width" :height="height" :enableUndo="true" ref="canvas" @getData="getData" @changeImg="changeImg" @selectImgId="selectImgId"></canvas-drag>
		</view>
		<view class="menu_nav">
			<view class="item" :class="{active:navId == 0}" @click="changeNav(0)">换图片</view>
			<view class="item" :class="{active:navId == 1}" @click="changeNav(1)">换文字</view>
			<view class="help" @click="toExport"><image src="@/static/icon_when.png" class="icon_help"></image> 操作说明</view>
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

		<uni-popup ref="popup_img" :safe-area="false">
			<view class="preview_box">
				<view class="t">请预览制作效果</view>
				<image :src="tempImage" class="tempImage" mode="widthFix"></image>
				<view class="s">点击【确认提交】可保存高清无水印作品</view>
				<view class="preview_btn_box">
					<view class="goback" @click="toBack"><image src="@/static/make_back.png" class="icon_back"></image> 返回修改</view>
					<view class="confrim" @click="toPay">确认提交</view>
				</view>
			</view>
		</uni-popup>
 
		<uni-popup ref="popup_pay" >
			<view class="popup_pay">
				<view class="t">编辑完成</view>
				<view class="s">只差一步就可以生成啦</view>
				<view class="cell" :class="{active:check_id == 0}" @click="changePay(0)">
					<image :src="check_id == 0?'/static/icon_radio_check.png':'/static/icon_radio_default.png'" class="icon_radio"></image>
					<view class="name">制作1次</view>
					<view class="symbol">￥</view>
					<view class="price">6.8</view>
				</view>
				<view class="cell" :class="{active:check_id == 1}" @click="changePay(1)">
					<image :src="check_id == 1?'/static/icon_radio_check.png':'/static/icon_radio_default.png'" class="icon_radio"></image>
					<view class="name">制作3次</view>
					<view class="symbol">￥</view>
					<view class="price">12.8</view>
				</view>
				<view class="btn" @click="goMake">立即制作</view>
				<view class="tips">支付前请阅读 <text class="xy">《付费制作协议》</text>支付后不支持退款</view>
			</view>
		</uni-popup>
 
	</view>
</template>

<script setup>
	import {ref,getCurrentInstance } from "vue";
	import { onReady } from "@dcloudio/uni-app";
	const width = ref(0);
	const height = ref(0);

	const  graph = ref({})
	const canvas = ref(null)
	const navId = ref(0);
	const popup_img = ref(null);
	const popup_pay = ref(null);
	const tempImage = ref("");
	const check_id = ref(0);

	var temp_theme = ref([
		{"type":"bg","url":"../../static/canvas_bg.png","y":0,"x":0,"w":1080,"h":2336,"rotate":0,"index":2},
		{"type":"image","url":"../../static/canvas_item.jpg","y":970,"x":300,"w":600,"h":600,"rotate":0,"index":0,"id":1,"selected":true},
		{"type":"text","url":"https://lf3-static.bytednsdoc.com/obj/eden-cn/kuLauvyM-tyvmahsWulwV-upfbvK/ljhwZthlaukjlkulzlp/pc/Logo.png","y":160,"x":150,"w":608,"h":128,"rotate":0,"index":0,"id":3}
	]);     



	onReady(function(){
		const query = uni.createSelectorQuery().in(getCurrentInstance());
		query.select('.canvas_box').boundingClientRect(data => {
			// 按比例缩放canvas
			const this_height = data.height;
			const ratio = 2336 / this_height;

			height.value = this_height;
			width.value = 1080 / ratio;

			temp_theme.value.map((item)=>{
				item.w = item.w / ratio;
				item.h = item.h / ratio;
				item.x = item.x / ratio;
				item.y = item.y / ratio;
			})
			temp_theme.value.sort((a, b) => a.index - b.index);
			console.log(temp_theme.value)
			setTimeout(() => {
				canvas.value.initByArr(temp_theme.value)
			}, 1000);
		}).exec();


	
	
	})

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
			tempImage.value =  res;
			popup_img.value.open('bottom')
		})
	}
	const toPay = ()=>{
		popup_img.value.close('bottom')
		popup_pay.value.open('center')
	}
	const toBack = ()=>{
		popup_img.value.close('bottom')
	}
	const changePay = (id)=>{
		check_id.value = id;
	}
	const goMake = ()=>{
		uni.navigateTo({
			url:'/pages/make/make?tempImage=' + tempImage.value
		})
	}
	const toExport = ()=>{
		canvas.value.exportJson().then(res=>{
			console.log(res)
		})
	}
</script>

<style>
	.draw{
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.canvas_box{
		flex: 1;
	}
	.menu_nav{
		display: flex;
		align-items: center;
		height: 80rpx;
		padding: 0 16rpx 0 30rpx;
		background-color: #232323;
		margin-top: auto;
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
		padding: 0 60rpx 30rpx;
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
	.preview_box{
		padding:40rpx 108rpx;
		background-color: #383838;
		border-top-right-radius: 40rpx;
		border-top-left-radius: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.preview_box .tempImage{
		width: 300rpx;
		display: block;
		margin-top: 40rpx;
	}
	.preview_box .t{
		font-size: 40rpx;
		font-weight: bold;
	}
	.preview_box .s{
		color: #FFD717;font-size: 24rpx;
		margin-top: 40rpx;
	}
	.preview_box .preview_btn_box{
		display: flex;
		align-items: center;
		font-size: 32rpx;color: #fff;
		margin-top: 45rpx;
	}
	.preview_box .goback{
		background-color: #494949;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 24rpx;
		width: 240rpx;
		height: 92rpx;
		margin-right:20rpx;
	}
	.preview_box .icon_back{
		width: 32rpx;height: 32rpx;
		margin-right: 5rpx;
		margin-top: 3rpx;
	}
	.preview_box .confrim{
		background-color: #FD2C55;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 24rpx;
		width: 310rpx;
		height: 92rpx;
	}
	.popup_pay{
		padding: 60rpx 50rpx;
		background-color: #383838;
		border-radius: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.popup_pay .t{
		font-size: 48rpx;color: #fff;font-weight: bold;
	}
	.popup_pay .s{
		color: #909090;font-size: 28rpx;
	}
	.popup_pay .cell{
		display: flex;
		align-items: center;
		height: 108rpx;
		width: 536rpx;
		box-sizing: border-box;
		padding: 0 34rpx;
		border: 1px solid #8D8D8D;
		color: #fff;
		margin-top: 24rpx;
		border-radius: 32rpx;
	}
	.popup_pay .cell .name{
		font-size: 32rpx;
		font-weight: bold;
	}
	.popup_pay .cell .symbol{
		font-size: 28rpx;
		margin-left: auto;
		position: relative;
		top: -5rpx;
	}
	.popup_pay .cell .price{
		font-size: 48rpx;
	}
	.popup_pay .active{
		border: 1px solid #FFD717;
		color: #FFD717;
	}
	.popup_pay .cell .icon_radio{
		width:38rpx;height: 38rpx;
		margin-right: 20rpx;
	}
	.popup_pay .btn{
		width: 100%;
		height: 108rpx;
		color: #fff;
		background-color: #FD2C55;
		font-size: 36rpx;
		font-weight: bold;
		margin-top: 60rpx;
	}
	.popup_pay .tips{
		color: #7A7A7A;font-size: 20rpx;margin-top: 32rpx;
	}
	.popup_pay .xy{
		color: #fff;
	}
</style>
