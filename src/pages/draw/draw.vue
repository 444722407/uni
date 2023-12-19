<template>
	<view class="draw">
		<view class="canvas_box">
			<canvas-drag id="canvas-drag" :dx="dx" :width="width" :height="height" :enableUndo="true" ref="canvas"
				@getData="getData" @changeImg="changeImg" @selectImgId="selectImgId"></canvas-drag>
		</view>
		<view class="menu_nav">
			<view class="item" :class="{ active: navId == 0 }" @click="changeNav(0)">换图片</view>
			<view class="item" :class="{ active: navId == 1 }" @click="changeNav(1)">换文字</view>
			<view class="help" @click="showTips">
				<image src="@/static/icon_when.png" class="icon_help"></image> 操作说明
			</view>
		</view>
		<view class="menu_img" v-show="navId == 0">
			<template v-for="(item,index) in temp_theme" :key="index">
				<view class="item" v-if="item.type == 'image'" :key="item.id" @click.stop="selectImg(item.id)">
					<view class="mask" v-if="item.selected" @click.stop="changeImg(item.id, item.type)">
						<image src="@/static/make_pic_mask.png" class="mask_img"></image>
					</view>
					<image :src="item.url" class="item_img"></image>
				</view>
			</template>
		</view>

		<view class="menu_text" v-show="navId == 1">
			<scroll-view scroll-x="true" class="scroll_w">
				<template v-for="(item,index) in temp_theme" :key="index">
					<view class="input_box" :class="{ active: item.selected }" v-if="item.type == 'text'" :key="item.id"
						@click.stop="selectImg(item.id)">{{ item.text }}</view>
				</template>
			</scroll-view>
		</view>

		<view class="btn_box">
			<view class="btn" @click="toImage">立即制作</view>
			<navigator class="jump" url="/pages/myself/record">
				<image src="@/static/make_history.png" class="icon_hisory"></image>
				制作记录
			</navigator>
		</view>

		<uni-popup ref="popup_img" :safe-area="false" @change="changePopupImg" >
			<view class="preview_box">
				<view class="t">请预览制作效果</view>

				<view class="img_box" :style="{ width: width - 20 + 'px' }">
					<image :src="tempImage" class="tempImage" mode="widthFix"></image>
					<image src="@/static/wallpaper_watermark.png" class="tempImage_sy" mode="widthFix"
						:style="{ width: width - 20 + 'px' }"></image>
				</view>

				<view class="s">点击【确认提交】可保存高清无水印作品</view>
				<view class="preview_btn_box">
					<view class="goback" @click="toBack">
						<image src="@/static/make_back.png" class="icon_back"></image> 返回修改
					</view>
					<view class="confrim" @click="toPay">确认提交</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="popup_pay">
			<view class="popup_pay">
				<view class="t">编辑完成</view>
				<view class="s">只差一步就可以生成啦</view>

				<view class="cell" :class="{ active: item.check }" @click="changePay(index)"
					v-for="(item, index) in payList" :key="item.id">
					<image :src="item.check ? '/static/icon_radio_check.png' : '/static/icon_radio_default.png'"
						class="icon_radio"></image>
					<view class="name">{{ item.name }}</view>
					<view class="symbol">￥</view>
					<view class="price">{{ item.actual_price_format }}</view>
				</view>

				<view class="btn" @click="goMake">立即制作</view>
				<view class="tips">
					支付前请阅读 
					<navigator url="/pages/web/web?url=https://tuwang.taihela.com/payterms.html" open-type="navigate" class="xy">《付费制作协议》</navigator>
					支付后不支持退款
				</view>
			</view>
		</uni-popup>


		<uni-popup ref="popup_text" :mask-click="false">

			<view class="dialog" style="margin-top: -30vh;">
				<view class="dialog_title">修改内容</view>
				<input class="dialog_input" v-model="font_item.text" placeholder="输入文本" :maxlength="18"/>
				<view class="dialog_btn_box">
					<view class="dialog_btn dialog_cancel" @click="dialogClose">取消</view>
					<view class="dialog_btn dialog_confirm" @click="dialogConfirm">确定</view>
				</view>
			</view>
		
		</uni-popup>

		<uni-popup ref="popup_tips" :mask-click="false">
			<view class="dialog">
				<view class="dialog_title">操作说明</view>
				<view class="dialog_tips">
					<view class="cell">1. 按住<image src="@/static/scale.png" style="width: 48rpx;height: 48rpx;" class="icon_cell_tips"></image>可缩放、可旋转</view>
					<view class="cell">2. 点击<image src="@/static/replace.png" style="width: 80rpx;height: 52rpx;" class="icon_cell_tips"></image>可更换照片</view>
					<view class="cell">3. 点击<image src="@/static/replace2.png" style="width: 80rpx;height: 52rpx;" class="icon_cell_tips"></image>可更换文字</view>
					<view class="cell">4. 编辑状态下按住可移动位置</view>
					<view class="cell">5. 制作完成可保存高清无水印图片</view>
				</view>
				<view class="dialog_btn_box">
					<view class="dialog_btn dialog_confirm" @click="hideTips">知道了</view>
				</view>
			</view>
		</uni-popup>


		<uni-popup ref="popup_error" :mask-click="false">
			<view class="dialog">
				<view class="dialog_title">安全提示</view>
				<view class="dialog_tips">
					<view class="cell" style="text-align: center;">
						{{ error_text }}
					</view>
				</view>
				<view class="dialog_btn_box">
					<view class="dialog_btn dialog_confirm" @click="hideError">知道了</view>
				</view>
			</view>
		</uni-popup>


	</view>
</template>

<script setup>
import { ref, getCurrentInstance, toRaw } from "vue";
import fetchWork,{fetchWorkImage} from '@/services'
import { onLoad, onReady } from "@dcloudio/uni-app";
const app = getApp();
const id = ref("");
const make_id = ref("");

const width = ref(0);
const height = ref(0);
const ratio = ref(0);

const graph = ref({})
const tempImage = ref("");
const canvas = ref(null)

const navId = ref(0);


const popup_text = ref(null);
const popup_img = ref(null);
const popup_pay = ref(null);
const popup_tips = ref(null);
const popup_error = ref(null);
const error_text = ref("")

const font_item = ref({});


const temp_theme = ref([]);
const charge_status = ref(1);
const title = ref("")
const payList = ref([]);
const project_id = ref(-1);

const sy = ref({});
const dx = ref(0);


onLoad((options) => {
	tt.setSwipeBackMode(0);
	id.value = options.id;
	make_id.value = options.make_id;

	getPayList()

})
const getPayList = async () => {
	const res = await fetchWork('/v1.project/wallpaper_pay_list', {}, 'POST');
	res.map((item) => item.check = false);
	res[0].check = true;
	payList.value = res;
	project_id.value = res[0].id;
}


const scaleCanvas = () => {

	const query = uni.createSelectorQuery().in(getCurrentInstance());
	query.select('.canvas_box').boundingClientRect(async data => {
	
		const this_height = data.height;
		const this_width = data.width;

		// 按比例缩放canvas
		ratio.value = 2336 / this_height;

		height.value = this_height;

		width.value = 1080 / ratio.value;

		// 计算偏移量
		dx.value = this_width / 2 - width.value/2;
	

		
		var res = {};

		if (id.value) {
			res = await fetchWork('/v1.wallpaper/get_detail', { id: id.value }, 'POST');
		}
		if (make_id.value) {
			res = await fetchWork('/v1.wallpaper/get_user_make_wallpaper', { make_id: make_id.value }, 'POST');
		}
		title.value = res.title;
		charge_status.value = res.charge_status ? res.charge_status : -1;
		
		uni.setNavigationBarTitle({ title: res.title })
		temp_theme.value = res.picture_info;

		temp_theme.value.map((item) => {

			item.w = parseFloat((item.w / ratio.value).toFixed(2));
			item.h = parseFloat((item.h / ratio.value).toFixed(2));
			item.x = parseFloat((item.x / ratio.value).toFixed(2));
			item.y = parseFloat((item.y / ratio.value).toFixed(2));

		})

		temp_theme.value.sort((a, b) => a.index - b.index);

		sy.value = {
			"type": "bg",
			"url": "../../static/wallpaper_watermark.png",
			"y": 0, "x": 0,
			"w": parseFloat((1080 / ratio.value).toFixed(2)),
			"h": parseFloat((2336 / ratio.value).toFixed(2)),
			"rotate": 0,
			"index": 9999,
			"id": -9527
		};
		canvas.value.initByArr(temp_theme.value, sy.value)

	}).exec();

}
onReady(async () => {
	if (id.value || make_id.value) {
		scaleCanvas()
	}
	
})

const selectImg = (id, type) => {

	temp_theme.value.map((item) => item.selected = false);
	temp_theme.value.map((item) => item.selected = item.id == id);


	canvas.value.selectImg(id)


}
// canvas选中元素后 同桌父组件更新按钮
const selectImgId = (id, type) => {
	
	if (type == 'image') {
		navId.value = 0;
	} else {
		navId.value = 1;
	}
	temp_theme.value.map((item) => item.selected = false);
	temp_theme.value.map((item) => item.selected = item.id == id)

}
const changeImg = (id, type) => {
	// 点击了左上角 换图 换字
	
	if (type == "image") {
		
		navId.value = 0;
		uni.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			camera: 'back',
			success: (res) => {
				uni.showLoading({
					title:"图片安全检测中",
					icon:"none",
					mask:true
				})
				const url = res.tempFiles[0].tempFilePath;
				uni.getImageInfo({
					src: url,
					success: (image) => {
						// uni.compressImage({
						// 	src:url,
						// 	quality:50,
						// 	success: minData => {
						// 		console.log(minData)
								fetchWorkImage('/v1.upload/image',url,(result)=>{
						
								const imgData = JSON.parse(result.data);
							
								if(imgData.code == -1){
									popup_error.value.open();
									error_text.value = imgData.msg;
									uni.hideLoading();
									// canvas.value.initByArr(temp_theme.value, sy.value);
									return;
								} 
								
								// 绘制用本地图片绘制 速度快
								temp_theme.value.map((item) => {
										if (item.id == id) {
											item.h = parseFloat((image.height * (item.w /image.width) ).toFixed(2));
											item.url = url;
											item.path =url;
										}
									})
								
								canvas.value.initByArr(temp_theme.value, sy.value);
								// 绘制完后换成网络图片
								temp_theme.value.map((item) => {
									if (item.id == id) {
											item.h = parseFloat((image.height * (item.w /image.width) ).toFixed(2));
											item.url = imgData.data.url;
											item.path = imgData.data.path;
										}
									})


								uni.hideLoading()
							})
						// 	}
						// })
						// uni.saveFile({
						// 	tempFilePath: url,
						// 	success: function (sava_img) {
						// 		temp_theme.value.map((item) => {
						// 			if (item.id == id) {
						// 				item.h = parseFloat((image.height * (item.w /image.width) ).toFixed(2));
						// 				item.url = sava_img.savedFilePath;
						// 			}
						// 		})
						// 		canvas.value.initByArr(temp_theme.value, sy.value)
						// 	}
						// });
						
					}
				})

			},
			fail:(err)=>{
				console.log(err)
				uni.hideLoading()
			}
		})
	} else {
		navId.value = 1;
		const fliterArr = temp_theme.value.filter((item) => item.id == id);
		font_item.value = JSON.parse(JSON.stringify(toRaw(fliterArr[0])));
		popup_text.value.open();

	}

}
const getData = (item) => {
	const { id, x, y, w, h, rotate } = item;

	temp_theme.value.map((t) => {
		if (t.id == id) {
			if (t.type == 'image') {
				t.x = x;
				t.y = y;
				t.w = w;
				t.h = h;
				t.rotate = rotate;
			} else {
				t.font_size = t.font_size * (w / t.w)
				t.x = x;
				t.y = y;
				t.w = w;
				t.h = h;
				t.rotate = rotate;

			}
		}
	})




}
const changeNav = (id) => {
	navId.value = id;
}
const toImage = () => {
	canvas.value.export().then((res) => {
		tempImage.value = res;
		popup_img.value.open('bottom')
	})
}
const toPay = async () => {
	// charge_status:1 收费  -1编辑进来
	if(charge_status.value == 1){
	
		const res = await fetchWork('/v1.trade/check');
		if (res.make_num == 0) {
			popup_img.value.close('bottom')
			popup_pay.value.open('center')
		} 
		else {
			successJump()
		}
	}else{
		successJump()
	}
	
}

const toBack = () => {
	canvas.value.initByArr(temp_theme.value, sy.value);
	popup_img.value.close('bottom')
}
const changePopupImg = (e) => {
	if (!e.show) {
		canvas.value.initByArr(temp_theme.value, sy.value);
	}
}
const changePay = (index) => {
	payList.value.map((item) => item.check = false);
	payList.value[index].check = true;
	project_id.value = payList.value[index].id;
}
const goMake = async () => {
	if (app.globalData.system.osName.indexOf('ios') != -1) {
		uni.showToast({
			title:"IOS 暂不支持购买",
			icon:"none"
		})
		return;
	}
	uni.showLoading({
		title: '请稍等',
		mask: true
	})
	
	try {
		const result = await fetchWork("/v1.trade/create", { project_id: project_id.value,wallpaper_id:id.value }, "POST");
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
						popup_img.value.close('bottom');
						popup_pay.value.close();
						setTimeout(() => {
							successJump()
						}, 1000);
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
const successJump = () => {
	console.log(JSON.parse(JSON.stringify(toRaw(temp_theme.value))))
	uni.redirectTo({
		url: id.value ? `/pages/make/make?tempImage=${tempImage.value}&id=${id.value}&title=${title.value}` : `/pages/make/make?tempImage=${tempImage.value}&make_id=${make_id.value}&title=${title.value}`,
		success: () => {
			const data = JSON.parse(JSON.stringify(toRaw(temp_theme.value)));

			data.map((item) => {
				item.w = Math.round(item.w * ratio.value);
				item.h = Math.round(item.h * ratio.value);
				item.x = Math.round(item.x * ratio.value);
				item.y = Math.round(item.y * ratio.value);
			})

			data.sort((a, b) => a.index - b.index);

			app.globalData.temp_theme = data;
		}
	})
}
const dialogConfirm = async () => {

	if (font_item.value.text) {
		try{
			const res = await fetchWork('/v1.font/render_text', {
				font_id: font_item.value.font_id,
				text: font_item.value.text,
				font_color: font_item.value.font_color,
				font_size: Math.round(font_item.value.font_size),
				shadow_color:font_item.value.shadow_color?font_item.value.shadow_color:""
			}, 'POST');
				
			temp_theme.value.map((item) => {
				if (item.id == font_item.value.id) {
					item.url = res.base64;
					item.w = res.weight / ratio.value;
					item.h = res.height / ratio.value;
					item.text = font_item.value.text;
				}
			})

			canvas.value.initByArr(temp_theme.value, sy.value)
			popup_text.value.close()

		}catch(err){
			popup_error.value.open();
			error_text.value = err;
		}

	
	}else{
		uni.showToast({
			title:"文字不能为空",
			mask:true,
			icon:'none'
		})
	}

}
const dialogClose = () => {
	popup_text.value.close()
}
const showTips = () => {
	popup_tips.value.open()

}
const hideTips = ()=>{
	popup_tips.value.close()
}
const hideError = ()=>{
	popup_error.value.close()
}
</script>

<style scoped>

.draw {
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	box-sizing: border-box;
}

.canvas_box {
	flex: 1;
}

.menu_nav {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	height: 80rpx;
	padding: 0 16rpx 0 30rpx;
	background-color: #232323;
	margin-top: auto;
}

.menu_nav .item {
	color: #fff;
	font-size: 28rpx;
	line-height: 80rpx;
	margin: 0 30rpx;
	position: relative;
}

.menu_nav .active {
	color: #FFD717;
}

.menu_nav .active::after {
	content: "";
	width: 100%;
	height: 4rpx;
	border-radius: 4rpx;
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: #FFD717;
}

.menu_nav .help {
	margin-left: auto;
	color: #909090;
	font-size: 24rpx;
	display: flex;
	align-items: center;
}

.icon_help {
	width: 32rpx;
	height: 32rpx;
	margin-right: 4rpx;
}

.menu_img {
	display: flex;
	padding: 0 60rpx;
	align-items: center;
	height: 200rpx;
}

.menu_img .item {
	position: relative;
	width: 120rpx;
	height: 120rpx;
	border: 1px solid #FFD717;
	border-radius: 16rpx;
	overflow: hidden;
	margin-right: 24rpx;
}

.menu_img .mask_img {
	position: absolute;
	z-index: 2;
	width: 100%;
	height: 100%;
	border-radius: 16rpx;
}

.item_img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 16rpx;
	display: block;
}

.btn_box {
	padding: 0 60rpx 0;
	display: flex;
	align-items: center;
	padding-bottom: v-bind("app.globalData.system.safeAreaInsets.bottom + 10 + 'px'");
}

.btn {
	width: 500rpx;
	height: 92rpx;
	border-radius: 24rpx;
	background-color: #FD2C55;
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}

.jump {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
	margin-left: auto;
}

.jump .icon_hisory {
	width: 48rpx;
	height: 48rpx;
}

.menu_text {
	display: flex;
	padding: 0 60rpx;
	align-items: center;
	height: 200rpx;
}

.scroll_w {
	white-space: nowrap;

}

.input_box {
	display: inline-block;
	width: 300rpx;
	height: 100rpx;
	border-radius: 16rpx;
	border: 1px solid #fff;
	margin-right: 24rpx;
	color: #fff;
	font-size: 32rpx;
	line-height: 100rpx;
	box-sizing: border-box;
	padding: 0 16rpx;
}

.menu_text .active {
	color: #FFD717;
	border: 1px solid #FFD717;
}

.preview_box {
	padding: 40rpx 108rpx;
	background-color: #383838;
	border-top-right-radius: 40rpx;
	border-top-left-radius: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.preview_box .img_box {
	position: relative;
	margin-top: 40rpx;
}

.preview_box .tempImage {
	width: 100%;
	display: block;

}

.preview_box .tempImage_sy {
	width: 100%;
	display: block;
	position: absolute;
	z-index: 9;
	left: 0;
	top: 0;
}

.preview_box .t {
	font-size: 40rpx;
	font-weight: bold;
}

.preview_box .s {
	color: #FFD717;
	font-size: 24rpx;
	margin-top: 40rpx;
}

.preview_box .preview_btn_box {
	display: flex;
	align-items: center;
	font-size: 32rpx;
	color: #fff;
	margin-top: 45rpx;
}

.preview_box .goback {
	background-color: #494949;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 24rpx;
	width: 240rpx;
	height: 92rpx;
	margin-right: 20rpx;
}

.preview_box .icon_back {
	width: 32rpx;
	height: 32rpx;
	margin-right: 5rpx;
	margin-top: 3rpx;
}

.preview_box .confrim {
	background-color: #FD2C55;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 24rpx;
	width: 310rpx;
	height: 92rpx;
}

.popup_pay {
	padding: 60rpx 50rpx;
	background-color: #383838;
	border-radius: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.popup_pay .t {
	font-size: 48rpx;
	color: #fff;
	font-weight: bold;
}

.popup_pay .s {
	color: #909090;
	font-size: 28rpx;
}

.popup_pay .cell {
	display: flex;
	align-items: center;
	height: 108rpx;
	width: 536rpx;
	box-sizing: border-box;
	padding: 0 34rpx;
	border: 1px solid #8D8D8D;
	color: #fff;
	margin-top: 24rpx;
	border-radius: 32rpx;
}

.popup_pay .cell .name {
	font-size: 32rpx;
	font-weight: bold;
}

.popup_pay .cell .symbol {
	font-size: 28rpx;
	margin-left: auto;
	position: relative;
	top: -5rpx;
}

.popup_pay .cell .price {
	font-size: 48rpx;
}

.popup_pay .active {
	border: 1px solid #FFD717;
	color: #FFD717;
}

.popup_pay .cell .icon_radio {
	width: 38rpx;
	height: 38rpx;
	margin-right: 20rpx;
}

.popup_pay .btn {
	width: 100%;
	height: 108rpx;
	color: #fff;
	background-color: #FD2C55;
	font-size: 36rpx;
	font-weight: bold;
	margin-top: 60rpx;
}

.popup_pay .tips {
	color: #7A7A7A;
	font-size: 20rpx;
	margin-top: 32rpx;
}

.popup_pay .xy {
	color: #fff;
	display: inline-block;
}
.dialog_tips{
	margin-top: -30rpx;
	margin-bottom: 40rpx;
}
.dialog_tips .cell{
	display: flex;
	align-items: center;
	color: #000;
	font-size: 28rpx;
	padding: 15rpx 50rpx;
	
}
.dialog_tips .icon_cell_tips{
	margin: 0 12rpx;
}

</style>
