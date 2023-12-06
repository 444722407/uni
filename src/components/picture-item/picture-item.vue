<template>
    <navigator class="box" :url="type == 'picture'?'/pages/draw/draw?id=' + props.item.id :'/pages/avatar/detail'" open-type="navigate" hover-class="navigator-hover">
        <image :src="props.item.preview_img_url" class="item" :class="[type == 'picture'?'item_h':'']" mode="widthFix"></image>
        <view class="bottom" v-if="type == 'picture'">
            <view class="status">
                <image src="@/static/tag_hot@2x.png" class="icon" v-if="props.item.tag == '爆款'"></image>
                <image src="@/static/tag_new@2x.png" class="icon" v-if="props.item.tag == '免费'"></image>
            </view>
            <view class="name">{{ props.item.title }}</view>
        </view>
    </navigator>
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
        width: 100%;
        border-radius: 20rpx;
    }
    .item_h{
      
    }
    .bottom{
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-top: 15rpx;
        height: 60rpx;
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