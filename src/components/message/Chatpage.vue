<template>
  <div>
    <van-nav-bar :title="userInfo.username"
                 fixed
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <!-- 聊天信息 -->
    <div class="chattingRecords"
         ref="chattingRecords">

      <div :class=" item[0] === 'send' ? 'message2' : 'message1'"
           v-for="(item, index) in messageList"
           :key="index"
           ref="msgItem">
        <van-image round
                   width="40px"
                   height="40px"
                   :src=" item[0] === 'send' ? proFilePhoto : userInfo.head_photo " />
        <p>
          {{item[1]}}
        </p>
      </div>

    </div>
    <div class="inputbox">
      <div class="saybox">
        <van-icon name="volume-o" />
      </div>

      <van-field v-model="sendInfo.content"
                 class="inputdiv"
                 rows="1"
                 autosize
                 type="textarea"
                 placeholder="请输入..." />
      <van-button color="linear-gradient(to right, #ff6034, #ee0a24)"
                  @click="sendMessage"
                  size="small">
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
        send_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        client_ids: []
      },
      // 获取到对方用户的信息
      userId: '',
      messageList: [],
      userInfo: {},
      proFilePhoto: ''
    }
  },
  computed: {
    msgarr () {
      return this.$store.getters['messInfo/getMsg'](this.userId)
    }
  },
  watch: {
    msgarr: {
      handler (newVal, oldVal) {
        if (newVal !== null) {
          console.log(newVal)
          this.userInfo = forrmatFileUrl(newVal.user_info)
          const historyMsg = newVal.history_data
          historyMsg.forEach(i => {
            const arr = i.split('+')
            this.messageList.push([arr[1], arr[2]])
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    sendMessage () {
      console.log('点击发送了')
      if (!this.sendInfo.client_ids.includes(`${this.userId}`)) {
        this.sendInfo.client_ids.push(`${this.userId}`)
      } else {
        this.$ws.sendSock(this.sendInfo)
        this.messageList.push(['send', this.sendInfo.content])
        this.sendInfo.content = ''
      }
    },

    onClickLeft () {
      this.$router.push('/message')
    },
    async getMsg () {
      let { data: res } = await this.$http.get('/userInfo/getUserInfo')
      if (res.status === 'success') {
        res = forrmatFileUrl(res)
        this.proFilePhoto = res.data.head_photo
      }
    },
    onBottom () {
      const chattingRecords = this.$refs.chattingRecords
      var height = document.body.clientHeight
      window.scroll({ top: height, left: 0 })
      this.$nextTick(() => {
        chattingRecords.scrollTop = chattingRecords.scrollHeight
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
    this.onBottom()
  }
}
</script>

<style lang='less' scoped>
.chattingRecords {
    overflow: auto;
    margin-top: 46px;
    min-height: 100vh;
    height: 100%;
    margin-bottom: 75px;
    width: 100%;
    background-color: rgb(237, 238, 240);
    .message1::after {
        content: '';
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
        content: '';
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