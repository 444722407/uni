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

		<view class="list" v-if="list.length">
			<view v-for="(item,index) in list" :key="index" class="item" @click="handlerItem(item)">
				<image :src="item.imgUrl" class="img"></image>
				<view class="aside">
					<view class="name">{{ item.name }}</view>
					<view class="time">{{ item.time }}</view>
					<view class="btn" v-if="item.status == 1">前往下载</view>
					<view class="btn btn_disabled" v-if="item.status == 2">前往下载</view>
				</view>
			</view>
		</view>
		
		<no-data v-else-if="status != 'loading'"></no-data>
		<uni-load-more :status="status" :contentText="contentText" v-else-if="status != 'no-more'"/>  

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog  content="过期作品无法查看" title="" cancelText="" confirmText="知道了" :duration="2000" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>

	</view>
</template>

<script setup>
	
	import { ref,reactive } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	const status = ref("");
	const page = ref(1);
	const popup = ref(null);

	const contentText = reactive({
							contentdown: '上滑加载更多',
							contentrefresh: '加载中',
							contentnomore: '没有更多了'
						});
	
	const list = ref([]);

	onLoad(()=>{
		const res = [{
				imgUrl:"https://fakeimg.pl/200x200/ffffff/",
				name:"人生靠自己",
				time:"2023-11-10 19:45:20",
				status:1
			},
			{
				imgUrl:"https://fakeimg.pl/200x200/ffffff/",
				name:"人生靠自己",
				time:"2023-11-10 19:45:20", 
				status:2
			}];
		
		status.value = "loading";	

		setTimeout(() => {
			list.value = page.value == 1 ? res:[...list.value,...res];
			status.value = res.length < 10? 'no-more':'more';
			page.value ++;
		}, 200);
	})
	
	const handlerItem = function(item){
		if(item.status == 2){
			popup.value.open();
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
