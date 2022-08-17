<template>
  <div>
    <!-- 实现下拉刷新 -->
    <van-nav-bar title="消息"
                 fixed />
    <van-pull-refresh v-model="isLoading"
                      style="min-height:100vh;"
                      success-text="刷新成功"
                      @refresh="onRefresh">
      <div class="msgBox">
        <div class="topnav">
          <van-row type="flex"
                   justify="space-around">
            <van-col>
              <van-icon name="like"
                        size="24px"
                        color="rgb(252,94,91)"
                        style="background-color:rgb(255,237,235);" />
              <span>赞和收藏</span>
            </van-col>
            <van-col>
              <van-icon name="friends"
                        size="24px"
                        color="rgb(54,134,255)"
                        style="background-color:rgb(231,240,255);" />
              <span>新增关注</span>
            </van-col>
            <van-col>
              <van-icon name="comment"
                        size="24px"
                        color="rgb(52,216,153)"
                        style="background-color:rgb(231,252,242);" />
              <span>评论和@</span>
            </van-col>
          </van-row>
        </div>
        <!-- 消息列表 -->
        <div class="bigmsg">
          <div>
            <div v-for="(item,index) in msglist.data"
                 :key="index"
                 @click="skipChat(item.user_info.userid)">
              <div class="msg">
                <van-image round
                           width="50px"
                           height="50px"
                           :src="item.user_info.head_photo" />
                <div class="rightbox">
                  <div class="infomsf">
                    <span class="title">{{item.user_info.username}}</span>
                    <span class="timer">{{showMsg(item.history_data)[0]}}</span>
                  </div>
                  <p>{{showMsg(item.history_data)[2]}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { forrmatFileUrl } from '../utils/utils'
export default {
  data () {
    return {
      isLoading: false,
      msglist: {}
    }
  },
  mounted () {
    this.msglist = forrmatFileUrl(this.$store.getters['messInfo/getAllMsg'])
  },
  methods: {
    // 实现下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false
        this.msglist = forrmatFileUrl(this.$store.getters['messInfo/getAllMsg'])
        console.log('刷新成功')
      }, 1000)
    },
    // 点击后进行跳转到聊天界面(查看聊天信息)
    skipChat (res) {
      // 把user的id传过去
      this.$router.push({ name: 'Chatpage', query: { userId: res } })
    }
  },
  computed: {
    showMsg () {
      return item => {
        const n = item.length
        const arr = item[n - 1].split('+')
        arr[0] = arr[0].slice(5, 19)
        return arr
      }
    }
  }
}
</script>

<style lang='less' scoped>
.topnav {
    border-bottom: 1px solid #f0f0f0;
    margin-top: 46px;
    .van-col {
        height: 80px;
        width: 80px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .van-icon {
            height: 35px;
            width: 35px;
            line-height: 35px;
            text-align: center;
            background-color: #ccc;
            border-radius: 10px;
        }
        span {
            font-size: 12px;
            margin-top: 4px;
        }
    }
}

//消息列表
.bigmsg {
    padding-bottom: 50px;
}
.msg {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .van-image {
        margin-left: 5px;
    }
    .rightbox {
        width: 70%;
        background-color: #fff;
        padding: 2px;
        box-sizing: border-box;
        height: 50px;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        .title {
            font-size: 16px;
        }
        .timer {
            float: right;
            color: #ccc;
            font-size: 14px;
        }
        p {
            color: #ccc;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-top: 4px;
            font-size: 14px;
        }
    }
}
</style>