<template>
    <view class="box">
        <view class="nav_box">
            <view class="nav" :class="{active:navId == 0}" @click="changeNav(0)">壁纸</view>
            <view class="nav" :class="{active:navId == 1}" @click="changeNav(1)">头像</view>
        </view>
        <picture-list type="picture" v-show="navId == 0" :list="picture" :status="status1" text="暂无记录"></picture-list>
        <picture-list type="avatar"  v-show="navId == 1" :list="avatar"  :status="status2" text="暂无记录"></picture-list>
    </view>
    
</template>

<script setup >
    import {ref} from "vue";
    import { onLoad,onReachBottom } from "@dcloudio/uni-app";
	import fetchWork from '@/services'
    const navId = ref(0)

    const picture = ref([]);
    const avatar = ref([]);

    const status1 = ref("loading");
    const page1 = ref(1);
    const is_load1 = ref(false);

    const status2 = ref("loading");
    const page2 = ref(1);
    const is_load2 = ref(false);



    const pictureMore = async ()=>{
        const res = await fetchWork('/v1.user/get_wallpaper_browse_record',{page:page1.value});
        if(res && res.list.length!= 0){
            res.list.map((item)=>item.id = item.wallpaper_id)
			picture.value = page1.value == 1 ? res.list:[...picture.value,...res.list];
			status1.value = res.list.length < 10? 'no-more':'more';
			page1.value ++;
			is_load1.value = res.list.length == 10;
		}else{
			status1.value= "";
			return;
		}
    }

    const avatarMore = async ()=>{

        const res = await fetchWork('/v1.avatar/browse',{page:page2.value,limit:10},'POST');

        if(res && res.list.length!= 0){
            
            avatar.value = page2.value == 1 ? res.list:[...avatar.value,...res.list];
            status2.value = res.list.length < 10? 'no-more':'more';
            page2.value ++;
            is_load2.value = res.list.length == 10;
        }else{
            status2.value= "";
            return;
        }
    }
    onLoad(()=>{
        pictureMore();
        avatarMore();
	})

    onReachBottom(()=>{
  
        if(is_load1.value && navId.value == 0){
            pictureMore();
        }
        if(is_load2.value && navId.value == 1){
            avatarMore();
        }
  
        
    })
    const changeNav = (id)=>{
        navId.value = id;
    } 
</script>

<style scoped>
    .box{
		padding: 45rpx 0;
	}
    .nav_box{
        display: flex;
        align-items: center;
        padding: 0 45rpx;
    }
    .nav{
        border: 1px solid #505050;
        color: #fff;
        border-radius: 16rpx;
        margin-right: 24rpx;
        width: 200rpx;
        height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32rpx;
        background-color: #161616;
    }
    .active{
        border: 1px solid #FFD717;
        color: #FFD717;
        background-color: #37300F;
    }
</style>