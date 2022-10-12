<template>
  <div>
    <van-nav-bar title="收到的赞和收藏"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <div class="like_notify_list"
         v-show="likeArr!==[]">
      <van-list v-model="loading"
                :finished="finished"
                :immediate-check='false'
                @load='onload'
                finished-text="没有更多了">
        <div class="like_notify_item"
             v-for="(item,index) in likeArr"
             :key="index">
          <div class="author_info">
            <img :src="item.notify.form_user_info.head_photo"
                 class="author_photo"
                 alt="">
            <div class="likeInfo">
              <div class="author_name">{{item.notify.form_user_info.username}}</div>
              <div class="like_time">{{item.send_time}}</div>
              <div class="like_content">赞了你的文章</div>
            </div>
          </div>
          <div class="article_info">
            <img :src="item.notify.article_info.cover_url || item.notify.article_info.resource_dir"
                 alt="">
          </div>
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
      likeArr: [],
      loading: false,
      finished: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getHistoryGiveLikeNotify()
  },
  methods: {
    onload () {
      this.pageInfo.pageIndex++
      this.getHistoryGiveLikeNotify()
      this.loading = false
    },
    onClickLeft () {
      this.$router.back()
    },
    async getHistoryGiveLikeNotify () {
      const { data: res } = await this.$http.get('/notify/getNotifyHistory', {
        params: {
          notifyType: 'giveLike',
          ...this.pageInfo
        }
      })
      if (res.status === 'success') {
        if (res.notifyHistory_giveLike === null) {
          this.finished = true
          return
        }
        this.likeArr.push(...forrmatFileUrl(res.notifyHistory_giveLike))
      }
    },
    async resetNotify () {
      const { data: res } = await this.$http.put('/notify/resetUnreadNotify?notifyType=giveLike')
      console.log(res)
      if (res.status !== 'success') {
        throw new Error('重置失败')
      }
    }
  },
  beforeDestroy () {
    if (this.likeArr.length !== 0) {
      this.resetNotify()
    }
  }
}
</script>

<style scoped lang='less'>
.like_notify_list {
    width: 100%;
    margin-top: 10px;
    .like_notify_item {
        height: 120px;
        display: flex;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        align-items: center;
        justify-content: space-around;
        .author_info {
            width: 240px;
            height: 120px;
            box-sizing: border-box;
            padding: 10px;
            display: flex;

            .author_photo {
                height: 50px;
                width: 50px;
                border-radius: 50%;
                // background-color: #000;
            }
            .likeInfo {
                box-sizing: border-box;
                padding: 5px;
                height: 100%;
                width: 150px;
                margin-left: 20px;
                // background-color: #ccc;
                .author_name {
                    width: 100%;
                    font-size: 17px;
                    color: #323232;
                    font-weight: 650;
                }
                .like_time {
                    width: 100%;
                    font-size: 15px;
                    margin-top: 10px;
                    color: #636162;
                }
                .like_content {
                    width: 100%;
                    overflow: hidden;
                    color: #636162;
                    margin-top: 10px;
                }
            }
        }
        .article_info {
            width: 85px;
            height: 85px;
            background-color: #000;
            border-radius: 10px;
            img {
                height: 100%;
                width: 100%;
                border-radius: 10px;
            }
        }
    }
}
</style>
