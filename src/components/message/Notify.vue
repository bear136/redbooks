<template>
  <div>
    <transition name="bounce">
      <div class="notify_box"
           v-if="notifyShow">
        <div class="notify_photo">
          <img :src="notifyContent.form_user_info.head_photo"
               alt="">
        </div>
        <div class="content">
          <h4>{{notifyContent.form_user_info.username}}</h4>
          <div class="notify_content">
            <span>[{{notifyType}}]</span>
          </div>
        </div>
        <div class="reviewBtn"
             @click="goToNotify()">
          回 复
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      notifyShow: false,
      msg_type: 5,
      notifyContent: {}
    }
  },
  computed: {
    notifyType () {
      let type = ''
      switch (this.msg_type) {
        case 5:
          type = '关注了你'
          break
        case 6:
          type = '赞了你的作品'
          break
        case 7:
          if (this.notifyContent.content === '[#@give_like@#]') {
            type = '赞了你的评论'
            break
          }
          type = '回复了你'

          break
        default:
          type = '私信了你'
          break
      }
      return type
    }
  },
  mounted () {
    this.$bus.$on('showNotify', res => {
      this.initNotify(res)
    })
  },
  methods: {
    show () {
      this.notifyShow = true
      setTimeout(() => {
        this.notifyShow = false
      }, 2000)
    },
    initNotify (res) {
      this.msg_type = res.msg_type
      this.notifyContent = forrmatFileUrl(JSON.parse(res.content))
      this.show()
    },
    goToNotify () {
      switch (this.msg_type) {
        case 5:
          this.$router.push('/focusNotify')
          break
        case 6:
          this.$router.push('/likeNotify')
          break
        case 7:
          this.$router.push('/commentNotify')
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bounce-enter-active {
    transition: all 0.3s ease;
}
.bounce-leave-active {
    transition: all 0.5s ease;
}
.bounce-enter,
.bounce-leave-to {
    transform: translateY(30px);
    opacity: 0;
}
.notify_box {
    position: fixed;
    box-sizing: border-box;
    padding: 10px;
    width: 85vw;
    height: 90px;
    z-index: 200;
    left: 50%;
    border-radius: 10px;
    transform: translateX(-50%);
    top: 30px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    background-color: #fff;
    .notify_photo {
        height: 65px;
        width: 65px;
        border-radius: 50%;
        background-color: #fff;
        position: relative;
        box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 2px 2px;
        img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
        }
    }
    .content {
        height: 75px;
        width: 60%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-inline: 10px;
        overflow: hidden;
        h4 {
            height: 35px;
            line-height: 35px;
            color: #16151b;
        }
        .notify_content {
            height: 35px;
            line-height: 35px;
            color: #4f4d4e;
            overflow: hidden;
            span {
                color: #000;
                font-weight: 500;
            }
        }
    }
    .reviewBtn {
        width: 40px;
        height: 75px;
        line-height: 75px;
        color: #ee2a51;
        font-weight: 600;
    }
}
</style>
