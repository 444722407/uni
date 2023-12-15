<template>
    <view class="box">
        <view class="list" v-if="list.length">
            <view v-for="(item,index) in list" :key="item.id" class="item">
                <picture-item :item="item" :type="props.type" :jumpType="props.jumpType"></picture-item>
            </view>
        </view>
        <!-- 加载完成才显示有没有数据 -->
        <no-data v-else-if="status != 'loading'" :marginTop="100" :text=text></no-data>
        
        <uni-load-more :status="status" :contentText="contentText" v-if="status"/>    
    </view>
    
</template>

<script setup >
    import { reactive } from "vue";
	
    const props = defineProps({
        type:String,
		list:{
            type:Array,
            default:[]
        },
		status:{
			type:String,
            default:"loading"
		},
		size:{
			type:String,
			default:'324'
		},
        text:{
            type:String,
			default:'没有相关结果'
        },
        jumpType:{
            type:String,
            default:"navigate"
        }
    })

	const contentText = reactive({
		contentdown: '上滑加载更多',
		contentrefresh: '加载中',
		contentnomore: '没有更多了'
	});
	

</script>

<style scoped>
    .box{
		padding: 45rpx 0;
	}
	.list{
        display: flex;
        flex-wrap: wrap;
        padding: 0 18rpx;
    }
    .item{
        margin: 0 14rpx;
        width: v-bind("props.size + 'rpx'");
        overflow: hidden;
    }
</style>