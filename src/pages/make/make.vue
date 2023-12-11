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
			<view class="s" v-if="number">当前作品还有<text style="color: #FFD718;">{{number}}</text>次修改机会</view>
			<view class="save_box">
				<view class="goback" @click="toBack" v-if="number"><image src="@/static/works_modify.png" class="icon_back"></image>再次修改</view>
				<button class="goback share" @click="toBack" v-else open-type="share"><image src="@/static/works_modify.png" class="icon_back"></image>分享</button>

				<view class="confrim" @click="save"><image src="@/static/works_download.png" class="icon_save"></image>保存到系统相册</view>
			</view>
		</view>
		
		<uni-popup ref="save_mask" >
			<view class="save_tips">
				<image src="@/static/works_saved.png" class="icon_success"></image>
				<view class="t">保存成功</view>
				<view class="s">请在手机相册或照片内查看，如果未找到，可尝试在手机文件内查找，部分机型需要等待3分钟才能找到！</view>
				<view class="confrim" @click="hideSave">知道了</view>
			</view>
		</uni-popup>

		<uni-popup ref="edit_mask" >
			<view class="dialog">
				<view class="dialog_title">再次修改</view>
				<view class="dialog_subtitle">当前作品仅有<text style="color: #FD2C55;">{{ number }}</text>次修改机会，请慎重使用</view>
				<view class="dialog_btn_box">
					<view class="dialog_btn dialog_cencel" @click="cancel">取消</view>
					<view class="dialog_btn dialog_confirm" @click="confirm">使用</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onLoad , onReady} from "@dcloudio/uni-app";
	import fetchWork,{fetchWorkImage} from '@/services'
	const app = getApp();

	const number = ref(null);
	const tempImage = ref('');
	const is_progress = ref(true);
	const time = ref(0);
	const animationData  = ref({})
	
	
	const edit_mask = ref(null);
	const save_mask = ref(null);

	const make_id = ref(undefined);
	const record = ref(undefined);
	const id = ref(undefined);

	onLoad( async (options)=>{

		time.value = +new Date();
		tempImage.value = options.tempImage;

		record.value = options.record;
		id.value = options.id;
		make_id.value = options.make_id;

		uni.setNavigationBarTitle({title:options.title})

		// 记录进来 不走上传与制作
		if(options.record){
			is_progress.value = false;
			const res =	await fetchWork('/v1.wallpaper/get_user_make_wallpaper',{make_id:options.make_id},'POST');
			number.value = res.modify_num;
			return
		}


		// 图片上传
		const uploadTask  = fetchWorkImage('/v1.upload/image',options.tempImage,async (res)=>{
			const data = JSON.parse(res.data)
			// 制作数据
			if(options.id){
				console.log('make')
				const res = await fetchWork('/v1.wallpaper/make',{
					wallpaper_id:options.id,
					picture_info:JSON.stringify(app.globalData.temp_theme),
					preview_img:data.data.path
				},'POST')
				make_id.value = res.make_id;
				number.value = res.modify_num;
			}
			// 编辑数据
			if(options.make_id){
				console.log('edit')
				try{
					const res = await fetchWork('/v1.wallpaper/edit',{
						make_id:options.make_id,
						picture_info:JSON.stringify(app.globalData.temp_theme),
						preview_img:data.data.path
					},'POST')
					number.value = res.modify_num;
				}catch(msg){
					uni.showToast({
						title: msg,
						icon: 'none'
					});
				}
			}
		})

		

		// uploadTask.onProgressUpdate((res)=>{
		// 	width.value = res.progress;
		// 	if (res.progress  == 100){
		// 		is_progress.value = false;
		// 	}
		// })
	})
	onReady(()=>{
		var duration = +new Date() - time.value;
		console.log(duration)
		var animation = uni.createAnimation({
			duration:duration + 1000,
			timingFunction: 'ease',
			
		})
		animation.width('100%').step();
		animationData.value = animation.export()
	})
	const end = ()=>{
		console.log('end')
		is_progress.value = false;
	}
	const toBack = ()=>{
		if(number.value >=0){
			edit_mask.value.open()
		}
	}
	const cancel = ()=>{
		edit_mask.value.close()
	}
	const confirm = ()=>{
		edit_mask.value.close()
		// 再次编辑
		uni.redirectTo({
			url:"/pages/draw/draw?make_id=" + make_id.value
		})
	}
	const down = ()=>{
		return new Promise((resolve)=>{
			if(tempImage.value.includes("http")){
				uni.downloadFile({
					url:tempImage.value,
					success:(res)=>{
						tempImage.value = res.tempFilePath;
						resolve()
					}
				})
			}else{
				resolve()
			}
			
	})
	 }
	const save = ()=>{
		down().then(()=>{
			uni.saveImageToPhotosAlbum({
			filePath:tempImage.value,
			success:(res)=>{
				save_mask.value.open();
			},
			fail:(err)=>{
				if(err.errMsg.includes('saveImageToPhotosAlbum:fail auth deny')){
					uni.showModal({
						title:"提示",
						content:"没有权限",
						showCancel:false,
						confirmText:"打开权限",
						confirmColor:"#42b983",
						success:(res)=>{
							uni.openSetting()
						}
					})
				}else{
					uni.showToast({
						title:"保存失败",
						icon:"none"
					})
				}
			}
		})
	})
	}
	const hideSave = ()=>{
		save_mask.value.close();
	}
</script>

<style scoped>
	.make{
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
		background-color:#161616;
	}
	.tempImage{
		width: 430rpx;
		display: block;
		margin: auto;
		height: 0;
	}
	.progress_box{
		width: 100%;
		box-sizing: border-box;
		background-color: #232323;
		padding: 40rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		margin-top: auto;
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
		color: #fff;
	}
	.save_box .icon_back{
		width: 32rpx;height: 32rpx;
		margin-right: 5rpx;
		margin-top: 3rpx;
	}
	.save_box .icon_save{
		width: 40rpx;height: 40rpx;
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
	}
	.successs .s{
		font-size: 28rpx;color: #fff;
	}
	
	.save_tips{
		width: 560rpx;height: 504rpx;
		background-color: #fff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.save_tips .icon_success{
		width: 120rpx;height: 120rpx;
		margin-top: 50rpx;
	}
	.save_tips .t{
		font-size: 36rpx;color: #000;font-weight: bold;
		margin: 16rpx 0;
	}
	.save_tips .s{
		color: #FD2C55;
		font-size: 28rpx;
		padding: 0 36rpx;
		text-align: center;
	}
	.save_tips .confrim{
		margin-top: auto;
		border-top: 1px solid rgba(22,24,35,0.12);
		font-size: 32rpx;color: #000;font-weight: bold;
		height: 92rpx;
		text-align: center;
		line-height: 92rpx;
		width: 100%;
	}
</style>
