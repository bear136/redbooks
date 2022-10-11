<template>
  <div>
    <router-view></router-view>
    <!-- 底部导航区 -->
    <van-tabbar active-color="#ee0a24"
                v-model="active"
                route
                fixed
                inactive-color="#000">
      <van-tabbar-item icon="home-o"
                       to="/first">首页</van-tabbar-item>
      <van-tabbar-item icon="bag-o"
                       to="/friends">朋友</van-tabbar-item>
      <van-tabbar-item color='#fff'
                       @click="addDynamicShow">

        <van-icon name="plus"
                  size="20"
                  class="addDyamic"
                  color="#fff" />
      </van-tabbar-item>
      <van-tabbar-item icon="comment-circle-o"
                       to="/message">消息
        <van-badge :content="msgCount"
                   v-show="msgCount!==0"
                   max="99"></van-badge>
      </van-tabbar-item>

      <van-tabbar-item icon="user-circle-o"
                       to="/user">我的</van-tabbar-item>
    </van-tabbar>
    <van-popup v-model="selectType"
               round
               closeable
               position="bottom"
               :style="{ height: '30%' }">
      <h4>选择发布类型</h4>
      <div class="selectList">
        <div @click="goToTakePhoto">
          <van-icon name="photo"
                    size="40px"
                    color="#ccc" />
          <span>发布图片</span>
        </div>
        <div @click="goToTakeVideo">
          <van-icon name="video"
                    color="#ccc"
                    size="40px" />
          <span>发布视频</span>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      msgCount: 0, // 消息数量,
      selectType: false
    }
  },
  mounted () { },
  methods: {
    addDynamicShow () {
      this.selectType = true
    },
    goToTakePhoto () {
      this.$router.push({
        name: 'AddDynamic',
        query: {
          isVideo: 0
        }
      })
    },
    goToTakeVideo () {
      this.$router.push({
        name: 'AddDynamic',
        query: {
          isVideo: 1
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.van-tabs {
  border-bottom: 1px solid #ccc;
}

.van-badge {
  position: absolute;
  top: 0px;
}

.addDyamic {
  background-color: #f40;
  height: 35px;
  width: 35px;
  text-align: center;
  line-height: 35px;
  border-radius: 50%;
}

.van-popup {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .selectList {
    height: 200px;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100px;
      width: 100px;
      font-size: 15px;
    }
  }
}
</style>