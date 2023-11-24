<template>
    <view class="box" :style="{'marginTop':props.marginTop + 'px'}">
        <image src="@/static/default_pic@2x.png" mode="" class="img"></image>
		<text class="t">{{text}}</text>
    </view>
</template>

<script setup>
   const props = defineProps({
        marginTop:{
            type:Number,
            default:400
        },
        text:{
            type:String,
            default:"暂无记录"
        }
    })
</script>

<style scoped>
	.box{ 
        display: flex;
		flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 0;
    }
    .img{
        width: 384rpx; 
        height: 256rpx;
    }
    .t{
        font-size: 28rpx;
        color: #808080;
    }

</style>