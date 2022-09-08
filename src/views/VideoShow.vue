<template>
  <div class="videoBox">
    <img :src="bgImg"
         class="filterImg"
         alt="">
    <van-nav-bar left-arrow
                 fixed
                 @click-left="backBtn" />
    <div @click="giveClick">
      <video ref="showVideo"
             muted="muted"
             :src="videoPath">
      </video>
      <van-icon name="play-circle"
                size="50px"
                color='#4c4c4c'
                v-show="overlayShow" />
      <div class="toolList">
        <LikedAction v-bind:actionInfo='actionInfo' />
      </div>
    </div>
    <div class="author_info">
      <h4>@{{username}}</h4>
      <div class="vedioContent">
        {{vedioContent}}
        <h5 class="expandContent"
            @click="detailContentShow = true"
            v-show="isExpend">展开</h5>
      </div>
    </div>
    <van-action-sheet v-model="detailContentShow"
                      :title="'@'+username">
      <div class="content">
        {{content}}
      </div>
    </van-action-sheet>
    <van-action-sheet v-model="reviewShow">
      <div class="reviewBox">
        <Review />
      </div>
    </van-action-sheet>

  </div>
</template>

<script>
import LikedAction from '../components/toolAction/LikedAction.vue'
import { forrmatFileUrl } from '../utils/utils'
import Review from '../components/toolAction/Review.vue'
export default {
  data () {
    return {
      videoDom: null,
      overlayShow: true,
      content: '',
      isExpend: false,
      reviewShow: false,
      detailContentShow: false,
      clickTimes: 0, // 控制单击和双击事件,
      msgId: 0,
      bgImg: '',
      username: '',
      videoPath: '',
      actionInfo: {
        give_like_count: 0,
        comment_count: 0,
        userInfo: '',
        id: 0
      },
      reviewObj: {
        article_id: 0,
        level: 1,
        reply_comment_id: 0,
        reply_user_id: 0,
        comment_group: 0
      }
    }
  },
  components: {
    LikedAction,
    Review
  },
  mounted () {
    this.videoDom = this.$refs.showVideo
    this.msgId = this.$route.query.messageId
    this.actionInfo.id = this.msgId
    this.getMsgInfo()
    this.videoDom.onended = () => {
      this.overlayShow = true
    }
    this.$bus.$on('getInfo', this.getMsgInfo)
    this.$bus.$on('showReview', this.showReview)
  },
  computed: {
    vedioContent () {
      if (this.content.length > 30) {
        this.content = this.content.slice(0, 30) + '...'
        this.isExpend = true
      }
      return this.content
    }
  },
  methods: {
    backBtn () {
      this.$router.back()
    },
    showReview () {
      this.reviewShow = true
    },
    // 暂停
    takePause () {
      if (this.videoDom.paused) {
        this.overlayShow = false
        this.videoDom.play()
      } else {
        this.overlayShow = true
        this.videoDom.pause()
      }
    },
    // 双击或者单击事件
    giveClick () {
      this.clickTimes++
      if (this.clickTimes === 2) {
        this.clickTimes = 0
        this.$bus.$emit('doubleClick')
      }
      setTimeout(() => {
        if (this.clickTimes === 1) {
          this.clickTimes = 0
          console.log('单击事件')
          this.takePause()
        }
      }, 300)
    },
    async getMsgInfo () {
      const { data: res } = await this.$http.get('/article/getArticleById', {
        params: {
          article_id: this.msgId
        }
      })

      if (res.status === 'success') {
        const result = forrmatFileUrl(res.articleInfo)
        this.content = result.content
        this.bgImg = result.cover_url
          ? result.cover_url
          : 'https://www4.bing.com//th?id=OHR.CostadaMorte_ZH-CN5219249535_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=240&h=135'
        this.username = result.author_info.username
        this.videoPath = result.resource_url ? result.resource_url[0] : ''
        this.actionInfo.give_like_count = result.give_like_count
        this.actionInfo.comment_count = result.comment_count
        this.actionInfo.userInfo = result.author_info
        this.reviewObj.reply_user_id = result.author_info.userid
        this.reviewObj.article_id = Number(this.msgId)
        this.reviewObj.comment_group = Number(this.msgId)
        this.$store.dispatch('reviewInfo/addReviewInfo', this.reviewObj)
        this.$store.dispatch('reviewInfo/changeUserId', { id: result.author_info.userid })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@screenHeight: 100vh;
.videoBox {
    box-sizing: border-box;
    overflow: hidden;
    min-height: 100vh;
    min-width: 100vw;
    .filterImg {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: -100;
        filter: blur(50px);
    }

    video {
        width: 100vw;
        height: @screenHeight;
    }
    .toolList {
        position: absolute;
        z-index: 10;
        right: 10px;
        top: 40%;
        opacity: 0.9;
    }
    .van-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .author_info {
        height: 150px;
        width: 70%;
        bottom: 20px;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;
        position: absolute;
        .vedioContent {
            margin-top: 10px;
            line-height: 22px;
            letter-spacing: 3px;
        }
        .expandContent {
            color: #fff;
            display: inline;
            font-size: 17px;
        }
    }
    .content {
        padding: 16px 16px 160px;
        font-size: 18px;
        line-height: 28px;
    }
    .van-action-sheet__header {
        font-size: 20px !important;
        font-weight: 800 !important;
    }
    .reviewBox {
        min-height: 500px;
        width: 100%;
    }
}
</style>