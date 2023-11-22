<template>
    <view class="box">
        <view class="list" v-if="list.length">
            <view v-for="(item,index) in list" :key="index" class="item">
                <picture-item :item="item" :type="props.type"></picture-item>
            </view>
        </view>
        <!-- 加载完成才显示有没有数据 -->
        <no-data v-else-if="status != 'loading'"></no-data>
        
        <uni-load-more :status="status" :contentText="contentText" v-if="status"/>    
    </view>
    
</template>

<script setup >
    import { ref,reactive,onMounted } from "vue";
	
    const props = defineProps({
        type:String
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

	const more = ()=>{
		status.value = "loading"
		const res = [{
				src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己",
				status:1
			},
			{
                src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己",
				status:2
			},{
				src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己",
				status:1
			},
			{
                src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己",
				status:2
			},{
				src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己",
				status:1
			},
			{
                src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己",
				status:2
			},{
				src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己",
				status:1
			},
			{
                src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己",
				status:2
			},{
				src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己人生靠自己",
				status:1
			},
			{
                src:props.type == 'picture'?"https://fakeimg.pl/324x576/ffffff/":"https://fakeimg.pl/324x324/ffffff/",
				name:"人生靠自己",
				status:2
			}];	

		setTimeout(() => {
			if(res.length == 0){
				status.value= "";
				return;
			}
			list.value = page.value == 1 ? res:[...list.value,...res];
			status.value = res.length < 10? 'no-more':'more';
			page.value ++;
			is_load.value = res.length == 10;
		}, 1000);
	}
	onMounted(()=>{
		more()
	})
	
	defineExpose({
		more,
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
        width: 324rpx;
        overflow: hidden;
    }
</style>