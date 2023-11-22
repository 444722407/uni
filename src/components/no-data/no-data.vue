<template>
    <view class="box">
        <image src="@/static/default_pic@2x.png" mode="" class="img"></image>
		<text class="t">暂无记录</text>
    </view>
</template>

<script setup>
    
</script>

<style scoped>
	.box{ 
        display: flex;
		flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 400rpx auto 0;
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