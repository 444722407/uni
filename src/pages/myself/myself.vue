<template>
	<view class="myself">
		<view class="user_box">
			<image :src="userInfo.avatarUrl?userInfo.avatarUrl:'/static/me_avatar@2x.png'" mode="" class="avatar"></image>
			<view class="aside">
				<view class="name">
					{{userInfo.nickName?userInfo.nickName:'匿名用户'}}
				</view>	
				<view class="desc">
					剩余制作机会：{{userInfo.make_num}}次
				</view>	
			</view>
			

			<view class="badge" @click="logout"  v-if="userInfo.avatarUrl">
				<image src="@/static/me_refresh@2x.png" mode="" class="icon_refresh"></image>
				退出登录
			</view>

			<view class="badge" @click="updateUserInfo" data-eventsync="true" v-else>
				<image src="@/static/me_refresh@2x.png" mode="" class="icon_refresh"></image>
				更新信息
			</view>
		</view>	
		
		<view class="jump_list">
			<navigator url="/pages/myself/record" class="item">
				<image src="@/static/me_make@2x.png" class="icon_head"></image>
				制作记录
				<image src="@/static/me_arrow@2x.png" class="icon_arrow"></image>
			</navigator>
			<navigator url="/pages/myself/order" class="item">
				<image src="@/static/me_order@2x.png" class="icon_head"></image>
				消费订单
				<image src="@/static/me_arrow@2x.png" class="icon_arrow"></image>
			</navigator>
			<navigator url="/pages/myself/history" class="item">
				<image src="@/static/me_view@2x.png" class="icon_head"></image>
				浏览记录
				<image src="@/static/me_arrow@2x.png" class="icon_arrow"></image>
			</navigator>
			<navigator url="/pages/myself/help" class="item">
				<image src="@/static/me_menu_help@2x.png" class="icon_head"></image>
				联系客服
				<image src="@/static/me_arrow@2x.png" class="icon_arrow"></image>
			</navigator>
			<navigator url="" class="item">
				<image src="@/static/me_join@2x.png" class="icon_head"></image>
				创作者入驻
				<image src="@/static/me_arrow@2x.png" class="icon_arrow"></image>
			</navigator>
		</view>	

		<uni-popup ref="popup_logout" type="dialog">
			<view class="dialog">
				<view class="dialog_title">是否要退出登录</view>
				<view class="dialog_btn_box">
					<view class="dialog_btn dialog_cencel" @click="cencel">取消</view>
					<view class="dialog_btn dialog_confirm" @click="confirm">知道了</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import fetchWork from "../../services";
	import {ref } from "vue";
    import { onShow,onReady } from "@dcloudio/uni-app";
	const userInfo = ref({});
	const popup_logout = ref(null)
	const getUserInfo = async ()=>{
		try{
			const res = await fetchWork('/v1.user/get_info',{},'POST');
			userInfo.value.production_num = res.production_num;
		}catch(err){
			console.log(err)
		}
	}
	const updateUserInfo = async ()=>{
		tt.getUserProfile({
			success:async (res)=>{
				try{
					await fetchWork('/v1.auth/login',res.userInfo,'POST');
					userInfo.value.nickName = res.userInfo.nickName;
					userInfo.value.avatarUrl =  res.userInfo.avatarUrl;
					uni.setStorageSync('userInfo',userInfo.value)

				}catch(err){
					console.log(err)
				}
			},
			fail:(err)=>{
				console.log(err)
			}
		})
	}
	const logout = ()=>{
		popup_logout.value.open()
	}
	const cencel = ()=>{
		popup_logout.value.close ()
	}
	const confirm =  ()=>{
		popup_logout.value.close ()
		uni.removeStorageSync('userInfo');
		userInfo.value.nickName = "";
		userInfo.value.avatarUrl = "";
	}
	onShow(()=>{
		const userInfo_data = uni.getStorageSync('userInfo');
		userInfo.value.nickName = userInfo_data && userInfo_data.nickName;
		userInfo.value.avatarUrl =  userInfo_data && userInfo_data.avatarUrl;
		getUserInfo()
		
	})
	
</script>
 
<style scoped>
	
	.myself{
		padding: 45rpx;
	}
	.user_box{
		height: 240rpx;
		border-radius:40rpx;
		display: flex;
		align-items: center;
		position: relative;
		background: linear-gradient(135deg, #5A44FF 0%, #9E34FF 100%);
		box-sizing:border-box;
		padding: 45rpx;
	}
	.user_box .avatar{
		width: 140rpx;height: 140rpx;border-radius:50%;
		flex-shrink:0;
	}
	.user_box .aside{
		margin-left: 32rpx;
	}
	.user_box .name{
		font-size: 36rpx;
	}
	.user_box .desc{
		font-size: 24rpx;
		margin-top: 10rpx;
	}
	.user_box .badge{
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 20rpx;
		right: 20rpx;
		top: 20rpx;
		background: rgba(0,0,0,0.2);
		border-radius: 16rpx;
		font-size: 24rpx;
	}
	.user_box .icon_refresh{
		width: 32rpx;height: 32rpx;
		margin-right: 5rpx;
	}
	.jump_list .item{
		display: flex;
		align-items: center;
		height: 120rpx;
		border-radius:32rpx;
		margin-top: 38rpx;
		background-color: #262626;
		font-size:36rpx;
		color: #fff;
		padding: 0 50rpx;
	}
	.icon_arrow{
		width: 24rpx;height: 24rpx;
		margin-left: auto;
	}
	.icon_head{
		width: 48rpx;height: 48rpx;
		margin-right: 20rpx;
	}
</style>
