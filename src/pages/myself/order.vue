<template>
	<view class="box">

		<view class="list" v-if="list.length">
			<view v-for="(item,index) in list" :key="index" class="item" >
				<view class="title">
					<view class="count">制作{{item.count}}次 </view>
					<view class="status status1" v-if="item.status == 1">
						<image src="@/static/order_paid@2x.png" class="icon"></image>
						支付成功
					</view>
					<view class="status status2" v-if="item.status == 2">
						<image src="@/static/order_fail@2x.png" class="icon"></image>
						支付失败
					</view>
					<view class="status status3" v-if="item.status == 3">
						<image src="@/static/order_refund@2x.png" class="icon"></image>
						已退款
					</view>
				</view>
				<view class="desc_box">
				<view class="desc">支付金额：{{item.price}}</view>
				<view class="desc">支付方式：{{item.pay}}</view>
				<view class="desc">订单编号：{{item.no}}</view>
				<view class="desc">订单时间：{{item.time}}</view>
				</view>
			</view>
		</view>
		<no-data v-else-if="status != 'loading'"></no-data>
		<uni-load-more :status="status" :contentText="contentText" v-else-if="status != 'no-more'"/>  
	</view>
</template>

<script setup>
	
	import { ref,reactive } from "vue";
	import { onLoad } from "@dcloudio/uni-app";
	const status = ref("");
	const page = ref(1);
	const contentText = reactive({
							contentdown: '上滑加载更多',
							contentrefresh: '加载中',
							contentnomore: '没有更多了'
						});
	
	const list = ref([]);

	onLoad(()=>{
		const res = [{
				count:"3",
        status:1,
        no:"DY2023111019452065577689",
        price:"12.8元",
        pay:"支付宝支付",
				time:"2023-11-10 19:45:20",
			
			},
			{
        count:"3",
        status:2,
        no:"DY2023111019452065577689",
        price:"12.8元",
        pay:"支付宝支付",
				time:"2023-11-10 19:45:20",
			},
      {
        count:"3",
        status:3,
        no:"DY2023111019452065577689",
        price:"12.8元",
        pay:"支付宝支付",
				time:"2023-11-10 19:45:20",
			}];
		
		status.value = "loading";	

		setTimeout(() => {
			list.value = page.value == 1 ? res:[...list.value,...res];
			status.value = res.length < 10? 'no-more':'more';
			page.value ++;
		}, 200);
	})
	

</script>

<style scoped>
	.box{
		padding: 45rpx;
	}
	
	.item{
		padding:30rpx 40rpx;
		background-color: #262626;margin-top: 40rpx;
		border-radius: 32rpx;
	}
	.item .title{
		display: flex;
		align-items: center;
		padding-bottom: 28rpx;
	}
	.item .count{
		font-size: 32rpx;color: #fff;font-weight: bold;
	}
	.item .icon{
		width: 32rpx;height: 32rpx;
		margin-right: 5rpx;
	}
	.item .status{
		display: flex;
		align-items: center;
		font-size: 28rpx;
		margin-left: auto;
	}
	.item .status1{
		color: #00FF37;
	}
	.item .status2{
		color: #FF4545;
	}
	.item .status3{
		color: #ACACAC;
	}
	.item .desc_box{
		border-top: 1px solid #424242;
		padding-top: 40rpx;
	}
	.item .desc{
		color: #ACACAC;
		font-size: 24rpx;
		margin-bottom: 5rpx;
	}
</style> 
