<template>
  <div class="detialBox"
       v-if="detialShow">
    <!-- 导航栏部分 -->
    <van-nav-bar :title="author_info?author_info.username:''"
                 left-text="返回"
                 fixed
                 style="border-bottom:1px solid #ccc;"
                 @click-left="turnBack"
                 left-arrow>

      <!-- 分享按钮 -->
      <template #right>
        <van-icon name="share"
                  @click="shareInfo.showShare = !shareInfo.showShare"
                  size="18" />
      </template>
    </van-nav-bar>
    <!-- 分享面板 -->
    <van-share-sheet v-model="shareInfo.showShare"
                     title="立即分享给好友"
                     :options="shareInfo.options" />
    <div style="margin-top:46px;">
      <!-- 图片滑动轮播 -->
      <div class="swipbox">
        <van-swipe>
          <van-swipe-item v-for=" (item,index) in msgInfo.resource_url"
                          :key="index">
            <img :src="item"
                 alt="">
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 简介文章部分 -->
      <div class="articleInfo">
        <h4 class="title">{{msgInfo.title}}</h4>
        <div class="articleContext">
          {{msgInfo.content}}
          <span class="article_type">{{'#'+ msgInfo.article_type}}</span>
        </div>
        <div class="creatInfo">
          <span class="creatTime">编辑于 {{msgInfo.release_time}}</span>
          <div class="underbox">
            <div class="funbox">
              <ShowInfoAction v-bind:msgItem="msgInfo"
                              v-bind:likeCount="likeCount" />
            </div>
            <div class="funbox">
              <van-icon name="chat-o"
                        size="20" />
              <span>{{msgInfo.comment_count}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价部分 -->
    <Review :msgCount='msgInfo.comment_count' />
    <!-- 底部 -->

  </div>

</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'
import Review from '../toolAction/Review.vue'
import ShowInfoAction from '../toolAction/ShowInfoAction.vue'
export default {
  data () {
    return {
      detialShow: false,
      msgInfo: {},
      msgId: undefined,
      author_info: {},
      likeCount: 0,
      bottomShow: true,
      userId: 0,
      shareInfo: {
        showShare: false,
        options: [
          [
            { name: '微信', icon: 'wechat' },
            { name: '朋友圈', icon: 'wechat-moments' },
            { name: '微博', icon: 'weibo' },
            { name: 'QQ', icon: 'qq' }
          ],
          [
            { name: '复制链接', icon: 'link' },
            { name: '分享海报', icon: 'poster' },
            { name: '二维码', icon: 'qrcode' },
            { name: '小程序码', icon: 'weapp-qrcode' }
          ]
        ]
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
    Review,
    ShowInfoAction
  },
  methods: {
    turnBack () {
      this.$router.back()
    },
    async getMsgInfo () {
      const { data: res } = await this.$http.get('/article/getArticleById', {
        params: {
          article_id: this.msgId
        }
      })
      if (res.status === 'success') {
        this.msgInfo = forrmatFileUrl(res.articleInfo)
        this.likeCount = res.articleInfo.give_like_count
        this.author_info = this.msgInfo.author_info
        this.reviewObj.reply_user_id = res.articleInfo.author_id
        this.detialShow = true
        this.$store.dispatch('reviewInfo/addReviewInfo', this.reviewObj)
        this.$store.dispatch('reviewInfo/changeUserId', { id: res.articleInfo.author_id })
      }
    }
  },
  created () {
    this.msgId = this.$route.query.messageId
    this.reviewObj.article_id = Number(this.msgId)
    this.reviewObj.comment_group = Number(this.msgId)
    this.getMsgInfo()
  },
  mounted () { }
}
</script>

<style lang='less' scoped>
.detialBox {
  overflow: auto;
}

.swipbox {
  .van-swipe-item {
    width: 100%;
    max-height: 500px; 
    background-color: #ccc;

    img {
      width: 100%;
      height: 100%;
      object-fit: none;
    }
  }
}

.articleInfo {
  border-top: 1px solid #f0f0f0;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  .title {
    margin-top: 10px;
    font-size: 18.5px;
    color: rgb(57, 57, 57);
  }

  .articleContext {
    margin-top: 8px;
    font-weight: 330;
    font-size: 16px;
    font-family: 微软雅黑;

    .article_type {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .creatInfo {
    margin-top: 15px;
    height: 30px;
    width: 100%;
    border-bottom: 1px solid rgb(232, 232, 232);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .creatTime {
      color: #ccc;
      font-size: 14px;
    }

    .notLike {
      height: 20px;
      width: 60px;
      border-radius: 20px;
      border: 1px solid #ccc;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      color: #ccc;
    }
  }
}

.underbox {
  width: 130px;
  background-color: #fff;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .funbox {
    text-align: center;
    font-size: 17px;

    /deep/ span {
      text-align: center;
      display: inline-block;
      height: 100%;
      width: 30px;
    }
  }
}
</style>