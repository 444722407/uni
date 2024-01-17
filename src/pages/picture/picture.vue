<template>
	<view class="picture">
		<view class="fixed">
			<navigator class="search_box" url="/pages/search/search">
				<image src="@/static/home_search@2x.png" class="icon"></image>
				<view type="text" class="input">请输入关键字搜索</view>
				<view class="btn" @click="search">搜索</view>
			</navigator>
			<view class="nav">
				<scroll-view class="scroll_box" scroll-x="true" :scroll-left="left" scroll-with-animation="true">
					<view v-for="(item,index) in navList" :key="item.id" class="item" :class="{active:navId == item.id}" @click="changNav(item.id,index)">{{ item.name }}</view>
				</scroll-view>
			</view>
		</view>
		<view style="height: 256rpx;"></view>

		<view class="picture_box" style="margin-top: -20rpx;">
			<swiper class="swiper" @change="changeSwiper" :current="current" :duration="100">
				<swiper-item v-for="(item,index) in navList" :key="item.id">
					<scroll-view scroll-y style="height: 100%;" @scrolltolower="onBottom" :scroll-top="scrollTop">
						<picture-list type="picture" :list="datas[index].list" :status="datas[index].status" v-if="datas[index] && datas[index].list.length"></picture-list>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	import { onLoad,onReady,onReachBottom} from "@dcloudio/uni-app";
	import fetchWork from '@/services'

	const navList = ref([]);
	const left = ref(0);
	const navId = ref(0);

	const datas = ref([]);
	const current = ref(0)
	const scrollTop  = ref(0);

	onLoad(async ()=>{
		const res = await fetchWork('/v1.wallpaper/get_category_list');
		
		navList.value = res.list;
	
		navList.value.unshift({id:0,name:"全部"},{id:-9527,name:"上新"});


		
		

		for(let i = 0;i<navList.value.length;i++){
			let page = 1;
			let res = [];
			let is_load = false;
			let status = "loading";

			if( i == 1){
				res = await fetchWork('/v1.wallpaper/get_new_list');
				status="no-more";
			}else{
				res =  await fetchWork('/v1.wallpaper/get_list',{page:1,category_id:navList.value[i].id});
				page ++ ;
				status = res.list.length < 10? 'no-more':'more';
				is_load = res.list.length == 10;
			}
			
			datas.value.push({
				list:res.list,
				page,
				status,
				is_load
			}) 
			
		}
	
		
	})
	
	// const pictureMore = async ()=>{
	// 	const res = await fetchWork('/v1.wallpaper/get_list',{page:page.value,category_id:navId.value});
		
    //     if(res && res.list.length!= 0){
	// 		picture.value = page.value == 1 ? res.list:[...picture.value,...res.list];
	// 		status.value = res.list.length < 10? 'no-more':'more';
	// 		page.value ++;
	// 		is_load.value = res.list.length == 10;
	// 	}else{
	// 		status.value= "";
	// 		return;
	// 	}

	// }

	const changNav = (id,index)=>{
		navId.value = id;
		left.value = index>3?index* 60:0;
		current.value = index;
	}

	const changeSwiper = (e)=>{
		const index = e.detail.current;
		const id = navList.value[index].id;
		changNav(id,index)
	}


	const onBottom = async ()=>{

		if(navId.value.id == '-9527'){
			return
		}
		const data = datas.value[current.value];
		
		if(data.is_load){
			const res =  await fetchWork('/v1.wallpaper/get_list',{page:data.page,category_id:navList.value[current.value].id});
			data.list = [...data.list,...res.list];
			data.status =  res.list.length < 10? 'no-more':'more';
			data.page++ ; 
			data.is_load = res.list.length == 10;
		}
	}
	
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
		display: flex;
		align-items: center;
		color: rgba(255,255,255,0.5);
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
		/* transition: 80ms color; */
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
		animation: ani_width 80ms;
	}
	@keyframes ani_width{
		0%{
			width: 0;
		}
		100%{
			width: 40rpx;
		}
	}
	.picture {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.picture_box{
		flex: 1;
	}
	.swiper{
		min-height: 100%;
	}
</style>
