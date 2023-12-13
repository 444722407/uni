<template>
    <navigator class="box" :url="type == 'picture'?'/pages/draw/draw?id=' + props.item.id :'/pages/avatar/detail'" open-type="navigate" hover-class="navigator-hover">
        <image :src="props.item.preview_img_url" class="item" :class="[type == 'picture'?'item_h':'']" mode="widthFix"></image>
        <view class="bottom" v-if="type == 'picture'">
            <view class="status">
                <image src="@/static/tag_hot@2x.png" class="icon" v-if="props.item.tag == '爆款'" mode="widthFix"></image>
                <image src="@/static/tag_new@2x.png" class="icon" v-if="props.item.tag == '免费'" mode="widthFix"></image>
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
        margin-bottom: 20rpx;
    }
    .item{
        width: 100%;
        height: 0;
        border-radius: 20rpx;
    }
    .item_h{
      
    }
    .bottom{
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 50rpx;
    }
    .icon{
        width: 64rpx;
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