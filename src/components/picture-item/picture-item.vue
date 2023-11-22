<template>
    <view class="box">
        <image :src="props.item.src" class="item" :class="[type == 'picture'?'item_h':'']"></image>
        <view class="bottom" v-if="type == 'picture'">
            <view class="status">
                <image src="@/static/tag_hot@2x.png" class="icon" v-if="props.item.status == 1"></image>
                <image src="@/static/tag_new@2x.png" class="icon" v-if="props.item.status == 2"></image>
            </view>
            <view class="name">{{ props.item.name }}</view>
        </view>
    </view>
</template>

<script setup>
    
    const props = defineProps({
        item:Object,
        type:String
    });
</script>

<style scoped>
    .box{
        width: 100%;
        margin-bottom: 15rpx;
    }
    .item{
        width: 100%;height: 324rpx;
        border-radius: 20rpx;
    }
    .item_h{
        height: 576rpx;
    }
    .bottom{
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-top: 15rpx;
    }
    .icon{
        width: 64rpx;height: 36rpx;
        margin-right: 8rpx;
    }
    .name{
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 26rpx;color: #fff;
    }
</style>