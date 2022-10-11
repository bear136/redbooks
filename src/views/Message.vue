<template>
  <div v-show="msgShow">
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

            <van-col @click="skipToLike()">
              <van-badge :content="notifyCount.giveLike"
                         v-show="notifyCount.giveLike" />
              <van-icon name="like"
                        size="24px"
                        color="rgb(252,94,91)"
                        style="background-color:rgb(255,237,235);" />

              <span>赞和收藏</span>
            </van-col>

            <van-col @click="skipToFocus()">
              <van-badge :content="notifyCount.follow"
                         v-show="notifyCount.follow!==0" />
              <van-icon name="friends"
                        size="24px"
                        color="rgb(54,134,255)"
                        style="background-color:rgb(231,240,255);" />

              <span>新增关注</span>

            </van-col>
            <van-col @click="skipToComment()">
              <van-badge :content="notifyCount.comment"
                         v-show="notifyCount.comment!==0" />
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
                  <div class="unreadChat"
                       v-show="unreadChatNum(item.unreadInfo)!=0">{{unreadChatNum(item.unreadInfo)}}</div>
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
      msglist: {},
      notifyCount: {},
      msgShow: false
    }
  },
  methods: {
    // 实现下拉刷新
    onRefresh (delay = 1000) {
      setTimeout(() => {
        this.isLoading = false
        this.msglist = forrmatFileUrl(this.$store.getters['messInfo/getAllMsg'])
        console.log('刷新成功')
      }, delay)
    },
    // 点击后进行跳转到聊天界面(查看聊天信息)
    skipChat (res) {
      // 把user的id传过去
      this.$router.push({ name: 'Chatpage', query: { userId: res } })
    },
    skipToLike () {
      this.$router.push('/likeNotify')
    },
    skipToFocus () {
      this.$router.push('/focusNotify')
    },
    skipToComment () {
      this.$router.push('/commentNotify')
    },
    async getNotifyCount () {
      const { data: res } = await this.$http.get('/notify/getUnreadNotify')
      if (res.status === 'success') {
        this.notifyCount = res.unreadNotify
      }
    },
    async getUnreadChat () {
      const { data: res } = await this.$http.get('/notify/getUnreadChat')
      if (res.status === 'success') {
      
        if (res.unreadChatList != null && res.unreadChatList.length !== 0) {
          res.unreadChatList.map(item => {
            if (item.unread_num != 0) {
              this.$set(this.msglist.data[item.chat_userid], 'unreadInfo', item)
            }
          })
        }
      }
      this.msgShow = true
    }
  },
  mounted () {
  
    this.onRefresh(0)
  },
  created () {
    try {
      this.msglist = forrmatFileUrl(this.$store.getters['messInfo/getAllMsg'])
    } catch (error) {
      console.log(error)
    }
    this.getNotifyCount()
    this.getUnreadChat()
  },
  computed: {
    showMsg () {
      return item => {
        const n = item.length
        const arr = item[n - 1].split('+')
        arr[0] = arr[0].slice(5, 19)
        return arr
      }
    },
    unreadChatNum () {
      return item => {
        if (item === undefined) return 0
        else {
          return item.unread_num
        }
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
    position: relative;

    .van-badge {
      position: absolute;
      right: 15px;
      top: 5px;
      z-index: 20;
    }

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
    position: relative;
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
      margin-left: 40px;
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

    .unreadChat {
      position: absolute;
      right: 5px;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background-color: #ee0a24;
      color: #fff;
      top: 50%;
      transform: translateY(-50%);
      line-height: 20px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>