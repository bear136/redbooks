
<template>
  <div>
    <van-nav-bar left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <div>
      <div class="showpart">
        <div class="userInfo">
          <div class="infoView">
            <InfoView v-bind:info='userInfo' />
          </div>
          <!-- 点赞展示/关注/粉丝 编辑资料 -->
          <div class='attentionInfo'>
            <div>
              <p>{{follow_count}}</p>
              <p>关注</p>
            </div>
            <div>
              <p>{{fans_count}}</p>
              <p>粉丝</p>
            </div>
            <div>
              <p>0</p>
              <p>获赞与收藏</p>
            </div>
            <div class="focuspart">
              <!-- 关注 发信息 取消关注 模块-->
              <div v-show="isNotSelf">
                <van-button class="focus"
                            v-show="!ifFocus"
                            round
                            @click="focus"
                            hairline>关注</van-button>
                <van-button v-show="ifFocus"
                            round
                            @click="gotoMessage"
                            hairline>发消息</van-button>
                <van-button size="small"
                            @click="gotoMessage()"
                            v-show="!ifFocus"
                            round
                            hairline>
                  <van-icon name="comment-o"
                            size="20" />
                </van-button>
                <van-button size="small"
                            @click="removeFocus"
                            v-show="ifFocus"
                            round
                            hairline>
                  <van-icon name="passed"
                            size="20" />
                </van-button>
              </div>

            </div>
          </div>
          <PersonWork v-bind:id='userid' />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import InfoView from './InfoView.vue'
import PersonWork from './PersonWork.vue'
import { forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      userInfo: {},
      isNotSelf: true,
      ifFocus: false,
      userid: this.$route.query.userId,
      follow_count: 0,
      fans_count: 0
    }
  },
  components: {
    InfoView,
    PersonWork
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    getRelation () {
      const params = {
        relation_id: this.userid
      }

      this.$http.get('/relationInfo/getRelation', { params }).then(
        res => {
          res = res.data
          if (res.status === 'success') {
            const relationInfo = res.relationInfo
            this.userInfo = forrmatFileUrl(relationInfo.user_info)
            if (this.userid == window.sessionStorage.getItem('userid')) {
              this.isNotSelf = false
            } else {
              this.ifFocus = relationInfo.status === 1 || relationInfo.status === 3
            }
          }
        },
        err => {
          console.log(err)
        }
      )


    },
    getCount () {
      this.$http
        .get('/relationInfo/getFollowAndFansCount', {
          params: {
            userid: String(this.userid)
          }
        })
        .then((res, err) => {
          const { follow_fans_count } = res.data
        
          this.follow_count = follow_fans_count.follow_count
          this.fans_count = follow_fans_count.fans_count
        })
        .catch(err => {
          console.log(err)
        })
    },
    focus () {
      this.$http.put(`/relationInfo/changeRelationStatus?relation_id=${this.userid}`).then(
        res => {
          if (res.data.status === 'success') {
            this.getRelation()
            this.getCount()
            this.$Toast.success('关注成功')
          }
        },
        err => {
          console.log(err)
        }
      )
    },

    gotoMessage () {
      this.$router.push({ name: 'Chatpage', query: { userId: this.userid } })
    },
    removeFocus () {
      this.$dialog
        .confirm({
          title: '取消关注',
          message: '确定要取消关注吗？'
        })
        .then(() => {
          this.$http.put(`/relationInfo/changeRelationStatus?relation_id=${this.userid}`).then(
            res => {
              if (res.data.status === 'success') {
                this.$Toast.success('取关成功')
                this.getRelation()
                this.getCount()
              }
            },
            err => {
              console.log(err)
            }
          )
        })
    }
  },
  mounted () {
    this.userid = this.$route.query.userId
    this.getRelation()
    this.getCount()
  }
}
</script>

<style lang='less' scoped>
.userInfo {
  height: 15rem;
  width: 100%;

  .bgImg {
    height: 100%;
    width: 100%;
  }

  ::v-deep .perInfo {
    width: 100%;
    position: absolute;
    top: 46px !important;
    display: flex;
    align-items: center;
    height: 6rem;

    .perfile {
      height: 80px;
      width: 80px;
      border-radius: 50%;
      border: none;
      margin-left: 2rem;
    }

    .userName {
      font-size: 17px;
      text-align: center;
      margin-left: 10px;
      box-sizing: border-box;
      width: 7rem;

      font-weight: 500;
    }
  }

  ::v-deep .signature {
    position: absolute;
    font-size: 14px;
    width: 100%;
    top: 9rem;
    padding: 14px 2rem;
    box-sizing: border-box;
  }

  .attentionInfo {
    width: 100%;
    position: absolute;
    top: 14rem;

    display: flex;
    font-size: 14px;
    text-align: center;
    padding: 10px 10px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;

    color: #fff;

    height: 3rem;
  }
}

.focuspart {
  width: 150px;

  .focus {
    height: 30px;
    width: 80px;
    background-color: rgba(255, 46, 68);
    color: aliceblue;
  }

  .van-button {
    margin-left: 10px;
    box-sizing: border-box;
    text-align: center;
  }
}
</style>