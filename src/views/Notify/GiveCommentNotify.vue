<template>
  <div v-show="commentNotifyShow">
    <van-nav-bar title="收到的评论和@"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <div class="comment_notify_list">
      <van-list v-model="loading"
                :finished="finished"
                :immediate-check='false'
                @load='onload'
                finished-text="没有更多了">
        <div class="comment_notify"
             v-for="(item, index) in commentArr"
             :key="index"
             @click="gotoDetial(item.notify.article_info)">
          <img :src="item.notify.form_user_info.head_photo"
               class="author_photo"
               alt="">
          <div class="comment_info">
            <h4 class="send_name">{{item.notify.form_user_info.username}}</h4>
            <div class="comment_time">{{item.notify.content === '[#@give_like@#]' ? '赞了你' : '评论了你'}}
              {{item.send_time.slice(0,10)}}
            </div>
            <div class="comment_content">
              <div class="comment_icon" />
              <div class="content">{{item.notify.content==='[#@give_like@#]'?'点赞了你的评论':item.notify.content}}</div>
            </div>

          </div>
          <img :src="item.notify.article_info.cover_url || item.notify.article_info.resource_dir"
               alt=""
               class="artical_photo">
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'

export default {
  data () {
    return {
      commentArr: [],
      commentNotifyShow: false,
      loading: false,
      finished: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },

  created () {
    this.getHistoryCommentNotify()
  },
  methods: {
    onload () {
      this.pageInfo.pageIndex++
      this.getHistoryCommentNotify()
      this.loading = false
    },
    onClickLeft () {
      this.$router.back()
    },
    async getHistoryCommentNotify () {
      const { data: res } = await this.$http.get('/notify/getNotifyHistory', {
        params: {
          notifyType: 'comment',
          ...this.pageInfo
        }
      })
      if (res.status === 'success') {
        if (res.notifyHistory_comment === null) {
          this.finished = true
          return
        }
        this.commentArr.push(...forrmatFileUrl(res.notifyHistory_comment))
        this.commentNotifyShow = true
      }
    },
    gotoDetial (item) {
      if (item.is_video === 0) {
        this.$router.push({ name: 'Detial', query: { messageId: item.article_id } })
      } else {
        this.$router.push({ name: 'video', query: { messageId: item.article_id } })
      }
    },
    async resetNotify () {
      const { data: res } = await this.$http.put('/notify/resetUnreadNotify?notifyType=comment')
      if (res.status !== 'success') {
        throw new Error('重置失败')
      }
    }
  },
  beforeDestroy () {
    if (this.commentArr.length !== 0) this.resetNotify()
  }
}
</script>
<style lang="less" scoped>
.comment_notify_list {
    width: 100%;
    margin-top: 10px;
    .comment_notify {
        // background-color: #f0f0f0;
        height: 100px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .author_photo {
            height: 45px;
            width: 45px;
            border-radius: 50%;
        }
        .comment_info {
            width: 50%;
            height: 80%;
            // background-color: #ccc;
            padding: 10px;
            box-sizing: border-box;
            .send_name {
                width: 100%;
                font-size: 17px;
                color: #323232;
                font-weight: 650;
            }
            .comment_time {
                width: 100%;
                font-size: 15px;
                margin-top: 5px;
                color: #636162;
            }
            .comment_content {
                width: 100%;
                overflow: hidden;
                color: #636162;
                margin-top: 8px;
                height: 20px;
                line-height: 20px;
                display: flex;
                align-items: center;

                .comment_icon {
                    height: 20px;
                    width: 4px;
                    background-color: #ccc;
                    border-radius: 2px;
                }
                .content {
                    height: 20px;
                    line-height: 20px;
                    margin-left: 10px;
                    color: #686868;
                }
            }
        }
        .artical_photo {
            height: 70px;
            width: 70px;
            border-radius: 10px;
        }
    }
}
</style>