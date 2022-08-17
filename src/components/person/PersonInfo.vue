
<template>
  <div>
    <InfoView v-bind:info="info" />
    <!-- 点赞展示/关注/粉丝 编辑资料 -->
    <div class='attentionInfo'>
      <div @click="gotoFans(0)">
        <p>{{follow_count}}</p>
        <p>关注</p>
      </div>
      <div @click="gotoFans(1)">
        <p>{{fans_count}}</p>
        <p>粉丝</p>
      </div>
      <div>
        <p>0</p>
        <p>获赞与收藏</p>
      </div>
      <van-button size="small"
                  round
                  @click="editUserInfo"
                  hairline>编辑资料</van-button>
      <van-button size="small"
                  round
                  hairline>
        <van-icon name="setting-o"
                  size="20" />
      </van-button>
    </div>
  </div>

</template>

<script>
import InfoView from './InfoView.vue'
import { forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      // 伪代码
      info: {},
      follow_count: 0,
      fans_count: 0
    }
  },
  components: {
    InfoView
  },
  methods: {
    editUserInfo () {
      this.$router.push('/editInfo')
    },
    gotoFans (index) {
      this.$router.push('/fans')
    }
  },
  mounted () {
    this.$http.get('/userInfo/getUserInfo').then((res, err) => {
      res = res.data
      if (res.status === 'success') {
        this.info = forrmatFileUrl(res.data)
        window.sessionStorage.setItem('userid', this.info.userid)
      }
    })
    this.$http
      .get('/relationInfo/getFollowAndFansCount', {
        params: {
          userid: ''
        }
      })
      .then((res, err) => {
        const { follow_fans_count } = res.data
        this.follow_count = follow_fans_count.follow_count
        this.fans_count = follow_fans_count.fans_count
      })
  }
}
</script>

<style lang='less'>
.attentionInfo {
    width: 100%;
    position: absolute;
    top: 11rem;
    // background-color: #fff;
    display: flex;
    font-size: 14px;
    text-align: center;
    padding: 10px 10px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    // mix-blend-mode: difference;
    height: 3rem;
    .van-button {
        box-sizing: border-box;
        text-align: center;
        color: #fff;
        // mix-blend-mode: difference;
        background-color: rgba(255, 255, 255, 0);
    }
}
</style>