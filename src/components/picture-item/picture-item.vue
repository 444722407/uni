<template>
    <navigator class="box" :url="'/pages/draw/draw?id=' + props.item.id" open-type="navigate" hover-class="navigator-hover"
        v-if="type == 'picture'">
        <view class="img_box">

            <view class="lazy_img" v-if="is_load"></view>
            <image :src="props.item.preview_img_url" class="item item_h" mode="widthFix" @load="load"
                :style="{ opacity: is_load ? '0' : '1' }"></image>
        </view>
        <view class="bottom">
            <view class="status">
                <image src="@/static/tag_hot@2x.png" class="icon" v-if="props.item.tag == '爆款'" mode="widthFix"></image>
                <image src="@/static/tag_new@2x.png" class="icon" v-if="props.item.tag == '免费'" mode="widthFix"></image>
            </view>
            <view class="name">{{ props.item.title }}</view>
        </view>
    </navigator>

    <navigator class="box"
        :url="url == 'detail' ? '/pages/avatar/detail?id=' + props.item.id + '&title=' + props.item.avatar_name : '/pages/avatar/sets?seriesId=' + props.item.series_id + '&title=' + props.item.series_name"
        :open-type="props.jumpType" hover-class="navigator-hover" v-if="type == 'avatar'" style="margin-bottom: 40rpx;">
        <view class="lazy_img" v-if="is_load" :style="{height:size + 'rpx'}"></view>
        <image :src="props.item.avatar_thumb" class="item" mode="widthFix" @load="load" :style="{ opacity: is_load ? '0' : '1' }">
        </image>
    </navigator>
</template>

<script setup>
import { ref } from 'vue';

const is_load = ref(true);
const props = defineProps({
    item: Object,
    type: String,
    jumpType: String,
    url:String,
    size:String
});
const load = () => {
    is_load.value = false;
}

</script>

<style scoped>
.box {
    width: 100%;
    margin-bottom: 20rpx;
}

.img_box {
    position: relative;
    overflow: hidden;
}

.item {
    display: block;
    width: 100%;
    height: 0;
    border-radius: 20rpx;
}

.lazy_img {
    width: 100%;
    height: 700rpx;
    background-color: #262626;
    border-radius: 20rpx;
}

.bottom {
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 50rpx;
}

.icon {
    width: 64rpx;
    display: block;
    margin-right: 8rpx;
}

.name {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 26rpx;
    color: #fff;
}</style>