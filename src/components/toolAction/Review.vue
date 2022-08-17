<template>
  <div class="reviewBox">
    <van-list :finished="finished"
              finished-text="没有更多了">
      <div v-for="item in firstInfo"
           :key="item.comment_id">
        <van-swipe-cell>
          <van-cell>
            <div class="reviewBigbox">
              <div class="first_level_review">
                <img :src="item.user_info.head_photo"
                     @click="goToPersonInfo(item.user_info.userid)"
                     alt="">
                <div class="info_box">
                  <div class="author_name">{{item.user_info.username}}</div>
                  <div class="review_info">
                    {{item.content}}
                  </div>
                  <div class='actionPart'
                       @click="takeReview(item.comment_id,item.userid)">
                    <span>{{item.comment_time}}</span>
                    <span style="color:#727272;">回复</span>
                    <div class="likedAction">
                      <van-icon :name="likedName"
                                size="20px"
                                :color="likedcolor" />
                      <span>{{item.give_like_count}}</span>
                    </div>
                  </div>
                  <div class="showSecondReview"
                       @click="showSecondReview(item.comment_id,item.article_id)"
                       v-show="item.second_comments_count">
                    <span>------ 展开{{item.second_comments_count}}条回复 </span>
                    <van-icon name="arrow-down" />
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
          <template #right>
            <van-button square
                        style="height:100%"
                        type="danger"
                        text="删除" />
          </template>
        </van-swipe-cell>

        <div>

          <div v-show="secondListShow"
               class="reviewBigbox"
               v-for="seconditem in item.children"
               :key="seconditem.comment_id"
               :style="chileStyle">
            <van-swipe-cell>
              <van-cell>
                <div class="first_level_review">
                  <img :src="seconditem.user_info.head_photo"
                       style="height:30px;width:30px;"
                       alt="">
                  <div class="info_box">
                    <div class="author_name">
                      {{seconditem.user_info.username}}
                      <span v-show="seconditem.reply_user_id!==item.userid">
                        <van-icon name="play" />
                        {{seconditem.reply_user_name}}
                      </span>
                    </div>
                    <div class="review_info">
                      {{seconditem.content}}
                    </div>
                    <div class='actionPart'
                         @click="takeReview(seconditem.comment_id,seconditem.userid)">
                      <span>{{seconditem.comment_time}}</span>
                      <span style="color:#727272;">回复</span>
                      <div class="likedAction">
                        <van-icon :name="likedName"
                                  size="20px"
                                  :color="likedcolor" />
                        <span>{{seconditem.give_like_count}}</span>
                      </div>

                    </div>
                    <div class="showSecondReview"
                         v-show="item.children.length%10===0">
                      <span>------ 展开剩余回复 </span>
                      <van-icon name="arrow-down" />
                    </div>
                  </div>
                </div>
              </van-cell>
              <template #right>
                <van-button square
                            @click="removeReview(seconditem.comment_id,seconditem.userid)"
                            style="height:100%"
                            type="danger"
                            text="删除" />
              </template>
            </van-swipe-cell>
          </div>
        </div>
      </div>
    </van-list>
    <PutReview />

  </div>
</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'
import PutReview from '../toolAction/PutReview.vue'
export default {
  components: {
    PutReview
  },
  data () {
    return {
      finished: false,
      likedName: 'like-o',
      likedcolor: 'red',
      chileStyle: 'width:85%;margin-left:45px;',
      firstInfo: [],
      secondListShow: false,
      firstContentCutObj: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    firstInfo (newVal, oldVal) {
      if (newVal.length === 10) {
        this.firstContentCutObj.pageIndex++
        this.getReviewInfo()
      }
    }
  },
  mounted () {
    this.getReviewInfo()
    this.$bus.$on('refreshReviewList', this.refreshReviewList)
  },
  methods: {
    refreshReviewList () {
      this.getReviewInfo()
    },
    takeReview (reply_comment_id, reply_user_id) {
      this.$store.dispatch('reviewInfo/addReviewInfo', {
        level: 2,
        reply_comment_id,
        reply_user_id
      })
      this.$bus.$emit('getFocus')
    },
    async getReviewInfo () {
      const { data: res } = await this.$http.get('/comment/getCommentByHeat', {
        params: {
          article_id: this.$route.query.messageId,
          ...this.firstContentCutObj
        }
      })
      if (res.status === 'success') {
        if (!res.commentList) {
          this.finished = true
          return
        }
        res.commentList = forrmatFileUrl(res.commentList)
        if (this.firstInfo.length === 0) {
          this.firstInfo.push(...res.commentList)
        } else {
          const arr = this.firstInfo.map(item => {
            return item.comment_id
          })
          res.commentList.map(item => {
            if (!arr.includes(item.comment_id)) {
              this.firstInfo.push(item)
            }
          })
        }
      }
    },
    async showSecondReview (comment_id, article_id) {
      const { data: res } = await this.$http.get('/comment/getReplyCommentByHeat', {
        params: {
          article_id,
          comment_id,
          pageIndex: 1,
          pageSize: 10
        }
      })
      this.firstInfo.map(item => {
        if (item.comment_id === comment_id) {
          this.$set(item, 'children', forrmatFileUrl(res.commentList))
          this.$set(item, 'second_comments_count', 0)
        }
      })
      this.secondListShow = true
    },
    goToPersonInfo (id) {
      this.$router.push({ name: 'otherPerson', query: { userId: id } })
    },
    removeReview (comment_id, userid) {}
  }
}
</script>

<style lang='less' scoped>
.reviewBox {
    margin-bottom: 46px;
}
.reviewBigbox {
    box-sizing: border-box;
    div {
        box-sizing: border-box;
    }
    .first_level_review {
        position: relative;
        // padding: 10px 10px 0px 10px;
        padding-bottom: 0;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        // background-color: #ccc;
        font-size: 16px;
        color: #1d1c24;
        img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }
        .info_box {
            width: 85%;
            box-sizing: border-box;
            .author_name {
                margin-top: 5px;
                margin-left: 10px;
                color: #787878;
            }
            .review_info {
                width: 100%;
                margin-left: 10px;
                margin-top: 5px;
                line-height: 25px;
            }
            .showSecondReview {
                box-sizing: border-box;
                color: #6f6f6f;
                // padding: 10px;
                text-align: left;
            }
        }
        .actionPart {
            display: flex;
            align-items: center;
            // padding: 10px;
            justify-content: space-between;
            height: 30px;
            width: 100%;
            margin-top: 5px;
            color: #b1b0b5;
            text-align: center;
            box-sizing: border-box;
            .likedAction {
                height: 30px;
                line-height: 30px;
                span {
                    display: inline-block;
                    height: 30px;
                    line-height: 30px;
                    margin-left: 5px;
                    color: #767676;
                }
            }
        }
    }
}
</style>