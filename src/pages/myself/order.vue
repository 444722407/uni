<template>
	<view class="box">

		<view class="list" v-if="list.length">
			<view v-for="(item,index) in list" :key="item.id" class="item" >
				<view class="title">
					<view class="count">{{item.subject}}</view>
					<view class="status status2" v-if="item.status == 1">
						<image src="@/static/order_fail@2x.png" class="icon"></image>
						{{item.status_label}}
					</view>
					<view class="status status1" v-if="item.status == 2">
						<image src="@/static/order_paid@2x.png" class="icon"></image>
						{{item.status_label}}
					</view>
					<view class="status status3" v-if="item.status == 3">
						<image src="@/static/order_refund@2x.png" class="icon"></image>
						{{item.status_label}}
					</view>
					
				</view>
				<view class="desc_box">
				<view class="desc">支付金额：{{item.actual_amount_format}}</view>
				<view class="desc">支付方式：{{item.payment_type_label}}</view>
				<view class="desc">订单编号：{{item.order_no}}</view>
				<view class="desc">订单时间：{{item.created_at}}</view>
				</view>
			</view>
		</view>
		<no-data v-else-if="status != 'loading'" :marginTop="200"></no-data>
		<uni-load-more :status="status" :contentText="contentText" v-else-if="status != 'no-more'"/>  
	</view>
</template>

<script setup>
	
	import { ref,reactive } from "vue";
	import { onLoad,onReachBottom} from "@dcloudio/uni-app";
	import fetchWork from '@/services'

	const status = ref("loading");
	const page = ref(1);
	const contentText = reactive({
		contentdown: '上滑加载更多',
		contentrefresh: '加载中',
		contentnomore: '没有更多了'
	});
	const is_load = ref(false);
	const list = ref([]);
	const getList = async ()=>{
		const res = await fetchWork('/v1.user/get_order_list',{page:page.value});
	
		if(res && res.list.length!= 0){
			list.value = page.value == 1 ? res.list:[...list.value,...res.list];
			status.value = res.list.length < 10? 'no-more':'more';
			page.value ++;
			is_load.value = res.list.length == 10;
		}else{
			status.value= "";
			return;
		}
	}					
	onLoad(()=>{
		getList()
	})
	onReachBottom(()=>{
		if(is_load.value){
			getList()
		}
		
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
