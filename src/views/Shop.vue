<template>
  <div>
    <div v-for="item in firstInfo"
         :key="item.comment_id">
      <van-swipe-cell>
        <van-cell>
          <div class="reviewBigbox">
            <div class="first_level_review">
              <img src="../assets/1.jpeg"
                   @click="goToPersonInfo(item.user_info.userid)"
                   alt="">
              <div class="info_box">
                <div class="author_name">{{item.user_info.username}}</div>
                <div class="review_info">
                  {{item.content}}
                </div>
                <div class='actionPart'>
                  <span>{{item.comment_time}}</span>
                  <span style="color:#727272;"
                        @click="reviewContent()">回复</span>
                  <div class="likedAction">
                    <van-icon :name="likedName"
                              size="20px"
                              :color="likedcolor" />
                    <span>{{item.give_like_count}}</span>
                  </div>
                </div>
                <div class="showSecondReview"
                     @click="showSecondReview(item.comment_id)"
                     v-show="item.second_comments_count&&dividerShow">
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
                <img src="../assets/1.jpeg"
                     style="height:30px;width:30px;"
                     alt="">
                <div class="info_box">
                  <div class="author_name">
                    {{seconditem.user_info.username}}
                    <span v-show="seconditem.reply_user_id!==item.user_info.userid">
                      <van-icon name="play" />
                      {{seconditem.reply_user_name}}
                    </span>
                  </div>
                  <div class="review_info">
                    {{seconditem.content}}
                  </div>
                  <div class='actionPart'
                       @click="putReview()">
                    <span>{{seconditem.comment_time}}</span>
                    <span style="color:#727272;">回复</span>
                    <div class="likedAction">
                      <van-icon :name="likedName"
                                size="20px"
                                :color="likedcolor" />
                      <span>{{seconditem.give_like_count}}</span>
                    </div>
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
    <PutReview v-bind:putReviewShow="putReviewShow" />
  </div>
</template>

<script>
import PutReview from '../components/toolAction/PutReview.vue'
export default {
  data () {
    return {
      likedName: 'like-o',
      likedcolor: 'red',
      comment_time: '2022/7/25 20:28',
      chileStyle: 'width:85%;margin-left:45px;',
      firstInfo: [],
      secondListShow: false,
      dividerShow: true,
      putReviewShow: true
    }
  },
  components: {
    PutReview
  },
  mounted () {
    this.getReviewInfo()
  },
  methods: {
    reviewContent () {
      this.$bus.$emit('getFocus')
    },
    async getReviewInfo () {
      const { data: res } = await this.$http.get('/comment/getCommentByHeat', {
        params: {
          article_id: 1,
          pageIndex: 1,
          pageSize: 10
        }
      })
      this.firstInfo.push(...res.commentList)
    },
    async showSecondReview (comment_id) {
      const { data: res } = await this.$http.get('/comment/getReplyCommentByHeat', {
        params: {
          article_id: 1,
          comment_id,
          pageIndex: 1,
          pageSize: 10
        }
      })
      this.firstInfo.map(item => {
        if (item.comment_id === comment_id) {
          this.$set(item, 'children', res.commentList)
        }
      })
      this.secondListShow = true
      this.dividerShow = false
    },
    goToPersonInfo (id) {
      this.$router.push({ name: 'otherPerson', query: { userId: id } })
    },
    removeReview (comment_id, userid) {}
  }
}
</script>

<style lang='less' scoped>
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