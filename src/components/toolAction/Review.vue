<template>
  <div class="reviewBox">
    <van-list v-model="loading"
              :finished="finished"
              :immediate-check='false'
              @load='onload'
              finished-text="没有更多了">
      <div v-for="(item,index) in firstInfo"
           :key="index">
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
                       @click="takeReview(item.comment_id,item.userid,item.comment_id)">
                    <span>{{item.comment_time.slice(0,16)}}</span>
                    <span style="color:#727272;">回复</span>
                    <CommentLike :giveLikeInfo='{
                           commentId:item.comment_id,
                            isGiveLike:item.is_give_like,
                            count:item.give_like_count
                    }' />
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
                        @click="removeReview(item.userid,item.comment_id,item.level,item.article_id)"
                        style="height:100%"
                        type="danger"
                        text="删除" />
          </template>
        </van-swipe-cell>

        <div>
          <van-list v-show="secondListShow"
                    finished-text="没有更多了">
            <div class="reviewBigbox"
                 v-for="(seconditem,index) in item.children"
                 :key="seconditem.comment_id"
                 :style="chileStyle">
              <van-swipe-cell>
                <van-cell>
                  <div class="first_level_review">
                    <img :src="seconditem.user_info.head_photo"
                         @click="goToPersonInfo(seconditem.user_info.userid)"
                         style="height:30px;width:30px;"
                         alt="">
                    <div class="info_box">
                      <div class="author_name">
                        <span @click="goToPersonInfo(seconditem.userid)"
                              class="commentUserName">
                          {{seconditem.user_info.username}}
                        </span>
                        <span v-show="seconditem.user_info.username!==seconditem.reply_user_name">
                          <van-icon name="play" />
                          <span @click="goToPersonInfo(seconditem.reply_user_id)"
                                class="replyUsername"> {{seconditem.reply_user_name}}</span>
                        </span>
                      </div>
                      <div class="review_info">
                        {{seconditem.content}}
                      </div>
                      <div class='actionPart'
                           @click="takeReview(seconditem.comment_id,seconditem.userid,item.comment_id)">
                        <span>{{seconditem.comment_time.slice(0,16)}}</span>
                        <span style="color:#727272;">回复</span>
                        <CommentLike :giveLikeInfo='{
                            commentId:seconditem.comment_id,
                            isGiveLike:seconditem.is_give_like,
                            count:seconditem.give_like_count
                         } ' />
                      </div>
                      <div class="showOtherComment"
                           @click="lastComment(item.comment_id,item.article_id)"
                           v-if="item.children.length-1===index&&item.showLast">
                        <span>------ 展开剩余回复 </span>
                        <van-icon name="arrow-down" />
                      </div>
                    </div>
                  </div>

                </van-cell>
                <template #right>
                  <van-button square
                              @click="removeReview(seconditem.userid,seconditem.comment_id,seconditem.level,seconditem.article_id)"
                              style="height:100%"
                              type="danger"
                              text="删除" />
                </template>

              </van-swipe-cell>

            </div>

          </van-list>

        </div>

      </div>
    </van-list>
    <PutReview />

  </div>
</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'
import PutReview from '../toolAction/PutReview.vue'
import CommentLike from '../toolAction/CommentLike.vue'
export default {
  components: {
    PutReview,
    CommentLike
  },
  data () {
    return {
      finished: false,
      loading: false,
      likedName: 'like-o',
      likedcolor: 'red',
      chileStyle: 'width:85%;margin-left:45px;',
      firstInfo: [],
      secondListShow: false,
      firstContentCutObj: {
        pageIndex: 1,
        pageSize: 10
      },
      secondContentCutObj: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getReviewInfo()
    this.$bus.$on('refreshReviewList', this.refreshReviewList)
    this.$bus.$on('changeLikeStatus', this.getReviewInfo)
  },
  methods: {
    async lastComment (comment_id, article_id) {
      try {
        this.secondContentCutObj.pageIndex++
        const { data: res } = await this.$http.get('/comment/getReplyCommentByHeat', {
          params: {
            article_id,
            comment_id,
            ...this.secondContentCutObj
          }
        })
        if (res.status === 'success') {
          this.firstInfo.map(item => {
            if (item.comment_id === comment_id) {
              if (res.commentList === null) {
                this.$set(item, 'showLast', false)
                return
              } else if (res.commentList.length < 10) {
                this.$set(item, 'showLast', false)
              }
              const resList = forrmatFileUrl(res.commentList)
              item.children.push(...resList)
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onload () {
      try {
        this.firstContentCutObj.pageIndex++
        const { data: res } = await this.$http.get('/comment/getCommentByHeat', {
          params: {
            article_id: this.$route.query.messageId,
            ...this.firstContentCutObj
          }
        })
        this.loading = false
        if (res.commentList === null) {
          this.finished = true
        } else {
          this.firstInfo.push(...forrmatFileUrl(res.commentList))
        }
      } catch (error) {
        console.log(error)
        this.$Toast.fail('加载失败')
        this.finished = true
      }
    },
    refreshReviewList () {
      this.getReviewInfo()
    },
    takeReview (reply_comment_id, reply_user_id, comment_group) {
      this.$store.dispatch('reviewInfo/addReviewInfo', {
        level: 2,
        reply_comment_id,
        reply_user_id,
        comment_group
      })
      this.$bus.$emit('getFocus')
    },
    async getReviewInfo () {
      const { data: res } = await this.$http.get('/comment/getCommentByHeat', {
        params: {
          article_id: this.$route.query.messageId,
          pageIndex: 1,
          pageSize: 10
        }
      })
      if (res.status === 'success') {
        if (!res.commentList) {
          this.finished = true
          return
        }
        res.commentList = forrmatFileUrl(res.commentList)
        this.firstInfo = res.commentList
        this.finished = false
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
          if (res.commentList === null) {
            return
          }
          this.$set(item, 'showLast', true)
          this.$set(item, 'children', forrmatFileUrl(res.commentList))
          this.$set(item, 'second_comments_count', 0)
        }
      })
      this.secondListShow = true
    },
    goToPersonInfo (id) {
      this.$router.push({ name: 'otherPerson', query: { userId: id } })
    },
    async removeReview (userid, comment_id, level, article_id) {
      const author_id = this.$store.getters['reviewInfo/getUserId']
      const { data: res } = await this.$http.get('/comment/removePermission', {
        params: {
          userid,
          author_id
        }
      })
      if (res.status === 'success' && res.isMyComment === 'true') {
        const { data: result } = await this.$http.delete('/comment/deleteComment', {
          params: {
            comment_id,
            level,
            article_id
          }
        })
        if (result.status === 'success') {
          this.$Toast.success('删除成功')
          this.getReviewInfo()
          this.$bus.$on('getNewLikeInfo')
        } else {
          this.$Toast.fail('删除失败，请重试')
        }
      } else {
        this.$Toast.fail('您没有权限删除')
      }
    }
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
                .commentUserName {
                    &:active {
                        color: blue;
                    }
                }
                .replyUsername {
                    &:active {
                        color: blue;
                    }
                }
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
            .showOtherComment {
                font-size: 16px;
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