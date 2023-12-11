<template>
	<view class="box">
		<view class="desc_box">
			<view class="desc">
				1.生成的作品只保留7天，请您尽快保存
			</view>
			<view class="desc">
				2.下拉刷新可查看作品状态
			</view>
		</view>

		<view class="list" v-if="picture.length">
			<view v-for="item in picture" :key="item.id" class="item" @click="handlerItem(item)">
				<image :src="item.preview_img_url" class="img" mode="aspectFill"></image>
				<view class="aside">
					<view class="name">{{ item.title }}</view>
					<view class="time">{{ item.updated_at }}</view>
					<view class="btn" v-if="item.is_expire == 0">前往下载</view>
					<view class="btn btn_disabled" v-if="item.is_expire == 1">前往下载</view>
				</view>
			</view>
		</view>
		
		<no-data v-else-if="status != 'loading'" :marginTop="100"></no-data>
		<uni-load-more :status="status" :contentText="contentText" v-else-if="status != 'no-more'"/>  

		<uni-popup ref="popup">
			<view class="dialog">
				<view class="dialog_title">过期作品无法查看</view>
				<view class="dialog_btn_box">
					<view class="dialog_btn dialog_confirm" @click="confirm">知道了</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script setup>
	
	import { ref,reactive } from "vue";
	import { onShow } from "@dcloudio/uni-app";
	import fetchWork from '@/services'

	const picture = ref([]);
	const status = ref("loading");
	const page = ref(1);
	const is_load = ref(false);
	const popup = ref(null);

	const contentText = reactive({
			contentdown: '上滑加载更多',
			contentrefresh: '加载中',
			contentnomore: '没有更多了'
		});

	
		
    const more = async ()=>{
		const res = await fetchWork('/v1.user/get_wallpaper_make_record',{page:page.value});
	
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
	onShow(()=>{
		picture.value = [];
        page.value = 1;
		is_load.value = false;
		status.value = "loading";
		more();
	})
	const confirm = ()=>{
		popup.value.close();
	}
	const handlerItem = function(item){
		if(item.is_expire == 1){
			popup.value.open();
		}else{
			uni.navigateTo({
				url:"/pages/make/make?make_id=" + item.id + "&tempImage=" +  item.preview_img_url + "&record=1&title=" + item.title
			})
		}
	}
	
</script>

<style scoped>
	.box{
		padding: 45rpx;
	}
	.desc_box{
		padding: 30rpx;
		background-color: #262626;
		border-radius: 32rpx;
		font-size: 28rpx;
		color: #fff;
	}
	.item{
		display: flex;
		align-items: center;
		padding: 40rpx;
		background-color: #262626;margin-top: 40rpx;
		border-radius: 32rpx;
	}
	.item .img{
		width: 200rpx;height: 200rpx;
		border-radius: 16rpx;
	}
	.item .name{
		font-size: 32rpx;color: #fff;font-weight: bold;
	}
	.item .time{
		color: #909090;font-size: 24rpx;margin-top: 16rpx;
	}
	.item .aside{
		margin-left: 20rpx;
	}
	.item .btn{
		background-color: #FD2C55;
		border-radius: 16rpx;
		width: 240rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 26rpx;
		font-size: 28rpx;
		margin-left: 120rpx;
	}
	.item .btn_disabled{
		background-color: #383838;
	}
</style> 
