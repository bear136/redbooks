<template>
  <div>
    <van-nav-bar
      :title="userInfo.username"
      fixed
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 聊天信息 -->
    <div class="chattingRecords" ref="chattingRecords">
      <div ref="msgBox" class=''>
        <div
          :class="item[0] == 'send' ? 'message2 messageItem' : 'message1 messageItem'"
          v-for="(item, index) in messageList"
          :key="index"
        >
          <van-image
            round
            width="40px"
            height="40px"
            :src="item[0] == 'send' ? proFilePhoto : userInfo.head_photo"
          />
          <p>
            {{ item[1] }}
          </p>
        </div>
      </div>
    </div>
    <div class="inputbox">
      <div class="saybox">
        <van-icon name="volume-o" />
      </div>

      <van-field
        v-model="sendInfo.content"
        class="inputdiv"
        rows="1"
        autosize
        type="textarea"
        placeholder="请输入..."
      />
      <van-button
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="sendMessage"
        size="small"
      >
        发送
      </van-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      sendInfo: {
        type: 1,
        content: '',
        client_ids: [],
        send_time: ''
      },
      // 获取到对方用户的信息
      userId: '',
      messageList: [],
      userInfo: {},
      proFilePhoto: ''
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    msgarr () {
      try {
        return this.$store.getters['messInfo/getMsg'](Number(this.$route.query.userId))
      } catch (error) {
        console.log('computed', error)
      }
    }
  },
  watch: {
    msgarr: {
      handler (newVal, oldVal) {
        try {
          if (newVal != null) {
            this.userInfo = forrmatFileUrl(newVal.user_info)
            const historyMsg = newVal.history_data
            this.messageList = []
            historyMsg.forEach((i) => {
              const arr = i.split('+')
              this.messageList.push([arr[1], arr[2]])
            })
          }
        } catch (error) {
          console.log(error)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    sendMessage () {
      if (!this.sendInfo.content) return
      this.sendInfo.client_ids = [`${this.userId}`]
      this.sendInfo.send_time = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      this.$ws.sendSock(this.sendInfo)
      this.$store.dispatch('messInfo/addUserMsg', {
        ...this.sendInfo,
        from_user: this.userId,
        msgType: 'send'
      })
      this.sendInfo.content = ''
    },

    onClickLeft () {
      this.$router.push('/message')
    },
    async getMsg () {
      let { data: res } = await this.$http.get('/userInfo/getUserInfo')
      if (res.status === 'success') {
        res = forrmatFileUrl(res)
        this.proFilePhoto = res.data.userinfo.head_photo
      }
    },
    onBottom () {
      this.$nextTick(() => {
        const msgBox = this.$refs.msgBox
        if (this.messageList.length > 5) {
          window.scrollTo(0, msgBox.offsetHeight)
        }
      })
    }
  },
  updated () {
    this.onBottom()
  },
  mounted () {
    // 获取用msgarr户之间的聊天记录
    this.userId = Number(this.$route.query.userId)
    this.getMsg()
    // 到达最后一个消息的地方
    this.$nextTick(() => {
      this.onBottom()
    })
  },
  async beforeDestroy () {
    const { data: res } = await this.$http.put(
      `/notify/resetUnreadChat?chat_userid=${this.userId}`
    )
    if (res.status !== 'success') {
      throw new Error('重置聊天失败')
    }
  }
}
</script>

<style lang="less" scoped>
.chattingRecords {
  overflow: auto;
  box-sizing: border-box;
  margin-top: 46px;
  min-height: calc(100vh - 121px);
  height: 100%;
  margin-bottom: 75px;
  width: 100%;
  background-color: rgb(237, 238, 240);

  .message1::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  //对方发发消息
  .message1 {
    margin-top: 20px;
    margin-bottom: 10px; //会产生margin合并的情况

    p {
      float: left;
      max-width: 50%;
      min-height: 40px;
      margin-left: 15px;
      overflow-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      padding: 8px;
      box-sizing: border-box;
      min-width: 100px;
      background-color: #fff;
      border-radius: 10px;
    }

    .van-image {
      float: left;
      margin-left: 10px;
    }
  }

  .message1::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  //本人发的消息
  .message2 {
    margin-top: 20px;
    overflow: hidden;
    margin-bottom: 10px;

    p {
      float: right;
      max-width: 50%;
      min-height: 40px;
      margin-right: 15px;
      overflow-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      padding: 8px;
      box-sizing: border-box;
      min-width: 100px;
      background-color: #fff;
      border-radius: 10px;
    }

    .van-image {
      float: right;
      margin-right: 20px;
    }
  }
}

.inputbox {
  position: fixed;
  bottom: 0;
  min-height: 75px;
  padding: 10px;
  max-height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: rgb(247, 247, 247);

  .saybox {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    color: #000;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    text-align: center;
    line-height: 32px;
  }

  .inputdiv {
    min-height: 32px;
    max-height: 94px;
    width: 180px;
    line-height: 16px;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    outline: none;
    background-color: #fff;
    border-radius: 10px;
    // border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    //隐藏滚动条
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }

  //隐藏滚动条
  .inputdiv::-webkit-scrollbar {
    width: 0 !important;
  }
}
</style>
