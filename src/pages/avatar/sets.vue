<template>
	<view class="avatar">
		<view class="search_box">
			<image src="@/static/home_search@2x.png" class="icon"></image>
			<input type="text" class="input" placeholder="输入您的姓氏" v-model="value">
			<image src="@/static/avatar_search_clear@2x.png" class="clear" @click="clear" v-if="value"></image>
			<view class="btn" @click="search">搜索</view>
		</view>
		<view class="picture_box">
			<picture-list type="avatar" ref="picture" size="208" @search="search"></picture-list>
		</view>
	</view>
</template>

<script setup>
	import {ref,watch } from "vue";
    import { onReachBottom} from "@dcloudio/uni-app";
	const value = ref("")
    const picture = ref(null);
	const is_search = ref(false);

	watch(is_search,()=>{
		// 没有搜索就还原数组
		if(!is_search.value){
			picture.value.more();
		}
		// 搜索过不能下拉加载
		picture.value.is_load = !is_search.value;
	})
    onReachBottom(()=>{
        if(picture.value.is_load){
            picture.value.more();
        }
    })
	const search = ()=>{
		picture.value.search()
		is_search.value = true;
	}
	const clear = ()=>{
		value.value = "";
		is_search.value = false;
	}
</script>

<style scoped>
.logo{
		width: 500rpx;height: 136rpx;
		margin: 54rpx auto 0;
		display: block;
	}
	.search_box{
		width: 680rpx;height: 96rpx;
		margin: 70rpx auto 0;
		border: 1rpx solid #6C3FFF;
		background-color: rgba(108,63,255,0.2);
		border-radius: 48rpx;
		box-shadow: 0px 20rpx 24rpx 0px rgba(0,0,0,0.2);
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
		width: 160rpx;
		height: 84rpx;
		background: #6C3FFF;
		border-radius: 62rpx;
		color: #fff;
		font-size: 32rpx;
		margin-right: 8rpx;
		text-align: center;
		line-height: 84rpx;
	}
	.picture_box{
		margin-top: 30rpx;
	}
	.title{
		font-size: 32rpx;padding: 0 34rpx;
	}
	.clear{
		width: 32rpx;height: 32rpx;
		margin-right: 32rpx;
	}
</style>
