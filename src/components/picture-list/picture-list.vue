<template>
    <view class="box">
        <view class="list" v-if="list.length">
            <view v-for="(item,index) in list" :key="index" class="item">
                <picture-item :item="item" :type="props.type"></picture-item>
            </view>
        </view>
        <!-- 加载完成才显示有没有数据 -->
        <no-data v-else-if="status != 'loading'" :marginTop="100" text="没有相关结果"></no-data>
        
        <uni-load-more :status="status" :contentText="contentText" v-if="status"/>    
    </view>
    
</template>

<script setup >
    import { ref,reactive,onMounted } from "vue";
	
    const props = defineProps({
        type:String,
		size:{
			type:String,
			default:'324'
		}
    })
	const status = ref("loading");
	const page = ref(1);
	const is_load = ref(false)
	const contentText = reactive({
							contentdown: '上滑加载更多',
							contentrefresh: '加载中',
							contentnomore: '没有更多了'
						});
	
	const list = ref([]);
	onMounted(()=>{
		
	})
	const more = (res)=>{
	
		if(res && res.length!= 0){
			list.value = page.value == 1 ? res:[...list.value,...res];
			status.value = res.length < 10? 'no-more':'more';
			page.value ++;
			is_load.value = res.length == 10;
		}else{
			status.value= "";
			return;
		}
	
	}
	
	const search = ()=>{
		list.value = [];
		status.value = "";
		is_load.value = false;
	}
	defineExpose({
		more,
		search,
		is_load
	})
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
        margin: 0 16rpx;
        width: v-bind("props.size + 'rpx'");
        overflow: hidden;
    }
</style>