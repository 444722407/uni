<template>
	<view class="detail">
		<image :src="avatarInfo.avatar_thumb" class="detail_img"></image>
        <navigator  :url="'/pages/avatar/sets?seriesId=' + avatarInfo.series_id + '&title=' + avatarInfo.series_name " open-type="redirect" hover-class="navigator-hover" class="jump">
            {{avatarInfo.series_name}} <image src="@/static/avatar_arrow@2x.png" class="icon"></image>
        </navigator>
        <view class="down" @click="show"><image src="@/static/avatar_download@2x.png" class="icon"></image>下载高清无水印原图</view>
		<view class="picture_box">
			<view class="title">更多推荐</view>
			<picture-list type="avatar" :list="picture" :status="status"></picture-list>
		</view>
        <button open-type="share" class="share"><image src="@/static/share@2x.png" class="icon_share"></image></button>

        <uni-popup ref="popup" :mask-click="false">
            <view class="down_tips" v-if="is_ios">
                <image class="icon_close" src="@/static/avatar_popup_close@2x.png" @click="close"></image>
                <view class="tips_subtitle">苹果用户暂不支持购买</view>
                <view class="tips_title">请在安卓设备上使用</view>
                <view class="btn">好的</view>
            </view>

            
           <template v-else>
            <view class="down_tips" v-if="is_number != 0">
                <image class="icon_close" src="@/static/avatar_popup_close@2x.png" @click="close"></image>
                <view class="tips_subtitle">剩余制作机会2次</view>
                <view class="tips_title">将消耗1次制作机会</view>
                <view class="btn">确定下载</view>
            </view>

            <view class="down_tips" v-if="is_number == 0">
                <image class="icon_close" src="@/static/avatar_popup_close@2x.png" @click="close"></image>
                <view class="tips_subtitle">下载高清无水印头像</view>
                <view class="tips_title">单次下载 2.8元</view>
                <view class="btn">立即支付</view>
                <view class="xy_box">支付前请阅读 
                    <navigator  url="/pages/" open-type="navigate" hover-class="navigator-hover" class="xy">《付费制作协议》</navigator>
                </view>
            </view>

           </template>

        </uni-popup>
	</view>
</template>

<script setup>
	import {ref} from "vue";
    import { onLoad,onReady, onReachBottom} from "@dcloudio/uni-app";
    import fetchWork from '@/services'
    const avatarInfo = ref({});
    const id = ref("");
    const title = ref("")
    const picture = ref([]);
    const status = ref("loading");
    const page = ref(1);
    const is_load = ref(false);

    const popup = ref(null);
    const is_ios = ref(false);
    const is_number = ref(0);
    const app = getApp();

    const pictureMore = async ()=>{
		const res = await fetchWork('/v1.avatar/suggest',{page:page.value,limit:10,avatarId:id.value},'POST');
		
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
    
    onLoad(async (options)=>{
        if(app.globalData.system.osName.indexOf('ios') != -1){
            is_ios.value = true;
        }
        id.value = options.id;
        title.value = options.title;

        pictureMore();
        const res = await fetchWork('/v1.avatar/detail',{avatarId:id.value},'POST');
        avatarInfo.value = res;
        uni.setNavigationBarTitle({title:title.value})
    })
    onReady(async ()=>{
       
   
    })

    onReachBottom(()=>{
        if(is_load.value){
            pictureMore();
        }
    })
    const show = ()=>{
        popup.value.open('center')
    }
	const close = ()=>{
        popup.value.close()
    }
</script>

<style scoped>
    .detail_img{
        width: 324rpx;
        height: 324rpx;
        border-radius: 20rpx;
        margin: 36rpx auto;
        display: block;
    }
    .jump{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .jump .icon{
        width: 32rpx;height: 32rpx;margin-left: 6rpx;
        margin-top: 3rpx;
    }
    .down{
        width: 680rpx;height: 136rpx;
        margin: 46rpx auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        background-color: #6C3FFF;
        border-radius: 40rpx;
    }
    .down .icon{
        width: 40rpx;height: 40rpx;margin-right: 6rpx;
    }
    .title{
		font-size: 32rpx;padding: 0 34rpx;
        margin-top: 60rpx;
	}
    .share{
        position: fixed;
        top: 36rpx;left: 0;
    }
    .share .icon_share{
        width: 132rpx;height: 70rpx;
    }
    .down_tips{
        width: 640rpx;
        background-color: #fff;
        border-radius: 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 100rpx 0 60rpx;
    }
    .down_tips .tips_subtitle{
        font-size: 32rpx;color: #FA3FA3;
    }
    .down_tips .tips_title{
        font-size: 48rpx;color: #000;font-weight: bold;margin-top: 32rpx;
    }
    .down_tips .icon_close{
        width: 48rpx;height: 48rpx;
        position: absolute;
        right: 30rpx;top: 30rpx;
    }
    .down_tips .btn{
        font-size: 36rpx;color: #fff;
        width: 536rpx;height: 108rpx;
        background-color: #6C3FFF;
        border-radius: 24rpx;
        margin-top: 70rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .down_tips .xy_box{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #909090;
        margin-top: 32rpx;
    }
    .down_tips .xy{
        color: #6C3FFF;
  
    }
</style>
