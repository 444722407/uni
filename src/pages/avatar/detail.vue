<template>
    <view class="detail">
        <image :src="avatarInfo.avatar_thumb" class="detail_img"></image>
        <navigator :url="'/pages/avatar/sets?seriesId=' + avatarInfo.series_id + '&title=' + avatarInfo.series_name"
            open-type="redirect" hover-class="navigator-hover" class="jump">
            {{ avatarInfo.series_name }} <image src="@/static/avatar_arrow@2x.png" class="icon"></image>
        </navigator>
        <view class="down" @click="show">
            <image src="@/static/avatar_download@2x.png" class="icon"></image>下载高清无水印原图
        </view>
        <view class="picture_box">
            <view class="title">更多推荐</view>
            <picture-list type="avatar" :list="picture" :status="status" jumpType="redirect"></picture-list>
        </view>
        <button open-type="share" class="share">
            <image src="@/static/share@2x.png" class="icon_share"></image>
        </button>

        <uni-popup ref="save_mask" :mask-click="false">
			<view class="save_tips">
				<image src="@/static/works_saved.png" class="icon_success"></image>
				<view class="t">保存成功</view>
				<view class="s">请在手机相册或照片内查看，如果未找到，可尝试在手机文件内查找，部分机型需要等待3分钟才能找到！</view>
				<view class="confrim" @click="hideSave">知道了</view>
			</view>
		</uni-popup>

        <uni-popup ref="popup" :mask-click="false">
           

            <view class="down_tips" v-if="checkData.makeNum > 0">
                <image class="icon_close" src="@/static/avatar_popup_close@2x.png" @click="close"></image>
                <view class="tips_subtitle">剩余制作机会{{ checkData.makeNum }}次</view>
                <view class="tips_title">将消耗1次制作机会</view>
                <view class="btn" @click="down">确定下载</view>
            </view>

            <view class="down_tips" v-else-if="checkData.makeNum <= 0 && !is_ios">
                <image class="icon_close" src="@/static/avatar_popup_close@2x.png" @click="close"></image>
                <view class="tips_subtitle">下载高清无水印头像</view>
                <view class="tips_title" v-for="(item) in payList" :key="item.id">
                    {{ item.name }} {{ item.actual_price_format }}元
                </view>
                <view class="btn" @click="pay">立即支付</view>
                <view class="xy_box">支付前请阅读
                    <navigator url="/pages/web/web?url=https://tuwang.taihela.com/payterms.html" open-type="navigate" hover-class="navigator-hover" class="xy">《付费制作协议》
                    </navigator>
                </view>
            </view>

            <view class="down_tips" v-else>
                <image class="icon_close" src="@/static/avatar_popup_close@2x.png" @click="close"></image>
                <view class="tips_subtitle">苹果用户暂不支持购买</view>
                <view class="tips_title">请在安卓设备上使用</view>
                <view class="btn" @click="close">好的</view>
            </view>

          

        </uni-popup>
    </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onReady, onReachBottom } from "@dcloudio/uni-app";
import fetchWork from '@/services'
const app = getApp();

const avatarInfo = ref({});
const payList = ref([]);
const checkData = ref({});

const id = ref("");
const title = ref("")

const picture = ref([]);
const status = ref("loading");
const page = ref(1);
const is_load = ref(false);

const popup = ref(null);
const is_ios = ref(false);
const save_mask = ref(null);

// 头像详情
const getAvatarInfo = async () => {
    const res = await fetchWork('/v1.avatar/detail', { avatarId: id.value }, 'POST');
    avatarInfo.value = res;
}

// 推荐列表
const pictureMore = async () => {
    const res = await fetchWork('/v1.avatar/suggest', { page: page.value, limit: 10, avatarId: id.value }, 'POST');

    if (res && res.list.length != 0) {
        picture.value = page.value == 1 ? res.list : [...picture.value, ...res.list];
        status.value = res.list.length < 10 ? 'no-more' : 'more';
        page.value++;
        is_load.value = res.list.length == 10;
    } else {
        status.value = "";
        return;
    }

}
// 制作次数
const checkNumber = async () => {
    const res = await fetchWork('/v1.avatar/downCheck', {avatarId:id.value}, 'POST');
    checkData.value = res;
}

const getPayList = async () => {
    const res = await fetchWork('/v1.project/avatar_pay_list', {}, 'POST');
    payList.value = res;
}

onLoad(async (options) => {
    if (app.globalData.system.osName.indexOf('ios') != -1) {
        is_ios.value = true;
    }
    id.value = options.id;
    title.value = options.title;
    uni.setNavigationBarTitle({ title: title.value })
    
    pictureMore();
    checkNumber();
    getAvatarInfo();
    getPayList();

    
})
onReady(async () => {

  
})

onReachBottom(() => {
    if (is_load.value) {
        pictureMore();
    }
})
const down = async () => {

    uni.showLoading({
		title: '请稍等',
		mask: true
	})
   

    const imgData = await fetchWork('/v1.avatar/download', {avatarId:id.value}, 'POST');
    const url = imgData.avatarImage;
    
    uni.downloadFile({
        url,
        success:(res)=>{
            console.log(res.tempFilePath)
            uni.saveImageToPhotosAlbum({
				filePath:res.tempFilePath,
				success:()=>{
                    uni.hideLoading()
                    popup.value.close()
					save_mask.value.open();
                   
				},
				fail:(err)=>{
                    uni.hideLoading()
					if(err.errMsg.includes('saveImageToPhotosAlbum:fail auth deny')){
						uni.showModal({
							title:"提示",
							content:"没有权限",
							showCancel:false,
							confirmText:"打开权限",
							confirmColor:"#42b983",
							success:()=>{
								uni.openSetting()
							}
						})
					}else{
						uni.showToast({
							title:"保存失败",
							icon:"none"
						})
					}
				},
                complete:()=>{
                    checkNumber()
                }
			})
            
        }
    })
}
const hideSave = ()=>{
	save_mask.value.close();
}
const show = () => {
    // paid_state = 1是免费 0是付费
    if(checkData.value.paid_state == 1 || checkData.value.dawn7Day==1){
        down()
    }else{
        popup.value.open('center')
    }
    
}
const close = () => {
    popup.value.close()
}
const pay = async () => {
    uni.showLoading({
        title: '请稍等',
        mask: true
    })

    try {
        const result = await fetchWork("/v1.trade/create", { project_id: payList.value[0].id, avatar_id: id.value }, "POST");
        console.log(result)
        tt.requestOrder({
            data: result.tiktok_params.data,
            byteAuthorization: result.tiktok_params.byteAuthorization,
            success(order_res) {
                console.log(order_res)
                tt.getOrderPayment({
                    orderId: order_res.orderId,
                    logId: order_res.logId,
                    success: (pay_res) => {
                        console.log(pay_res)
                        uni.hideLoading();
                        popup.value.close();
                        // 重新获取次数
                        getNumber()
                    },
                    fail(err) {
                        console.log(err)
                        uni.hideLoading();
                        uni.showToast({
                            title: "取消支付",
                            icon: 'none',
                            duration: 1500
                        });
                    }
                })
            },
            fail(err) {
                console.log(err)
                uni.hideLoading();
                uni.showToast({
                    title: "暂时不可支付",
                    icon: 'none',
                    duration: 1500
                });
            },
        });
    } catch (err) {
        console.log(err)
        uni.hideLoading();
        uni.showToast({
            title: "暂时不可支付",
            icon: 'none',
            duration: 1500
        });
    }
}

</script>

<style scoped>
.detail_img {
    width: 324rpx;
    height: 324rpx;
    border-radius: 20rpx;
    margin: 36rpx auto;
    display: block;
}

.jump {
    display: flex;
    align-items: center;
    justify-content: center;
}

.jump .icon {
    width: 32rpx;
    height: 32rpx;
    margin-left: 6rpx;
    margin-top: 3rpx;
}

.down {
    width: 680rpx;
    height: 136rpx;
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

.down .icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 6rpx;
}

.title {
    font-size: 32rpx;
    padding: 0 34rpx;
    margin-top: 60rpx;
}

.share {
    position: fixed;
    top: 36rpx;
    left: 0;
}

.share .icon_share {
    width: 132rpx;
    height: 70rpx;
}

.down_tips {
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

.down_tips .tips_subtitle {
    font-size: 32rpx;
    color: #FA3FA3;
}

.down_tips .tips_title {
    font-size: 48rpx;
    color: #000;
    font-weight: bold;
    margin-top: 32rpx;
}

.down_tips .icon_close {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    right: 30rpx;
    top: 30rpx;
}

.down_tips .btn {
    font-size: 36rpx;
    color: #fff;
    width: 536rpx;
    height: 108rpx;
    background-color: #6C3FFF;
    border-radius: 24rpx;
    margin-top: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.down_tips .xy_box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #909090;
    margin-top: 32rpx;
}

.down_tips .xy {
    color: #6C3FFF;

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
