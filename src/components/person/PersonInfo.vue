
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
                  @click="setting()"
                  hairline>
        <van-icon name="setting-o"
                  size="20" />
      </van-button>
      <van-popup v-model="show"
                 position="right"
                 :style="{ width: '50%',height:'100%'}">
        <div class="popupBox">
          <div v-for="(item,index) in option"
               :key="index">
            <div class="popuItem"
                 @click="goToChangeAccount(item.value)">
              <van-icon :name="item.icon"
                        size="17px" />
              {{item.value}}
            </div>
          </div>
          <van-divider />
          <div class="loginOut">
            <div class="loginOutBtn"
                 @click="loginOut()">
              退出登录
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>

</template>

<script>
import InfoView from './InfoView.vue'
import { mapActions } from 'vuex'
import { forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      info: {},
      follow_count: 0,
      fans_count: 0,
      show: false,
      option: [
        {
          value: '账号与安全',
          icon: 'manager-o'
        },
        {
          value: '我的订单',
          icon: 'cart-o'
        },
        {
          value: '我的钱包',
          icon: 'balance-pay'
        },
        {
          value: '我的优惠卷',
          icon: 'coupon-o'
        },
        {
          value: '我的二维码',
          icon: 'qr'
        },
        {
          value: '观看历史',
          icon: 'underway-o'
        },

        {
          value: '创作者服务中心',
          icon: 'wap-home-o'
        }
      ]
    }
  },
  components: {
    InfoView
  },
  methods: {
    ...mapActions(['changeInfo']),
    goToChangeAccount (value) {
      if (value === '账号与安全') {
        this.$router.push('/editAccount')
      }
    },
    editUserInfo () {
      this.$router.push('/editInfo')
    },
    gotoFans (index) {
      this.$router.push('/fans')
    },
    setting () {
      this.show = true
    },
    loginOut () {
      window.localStorage.clear()
      this.$router.push('/login')
    }
  },
  mounted () {
    this.$http.get('/userInfo/getUserInfo').then((res, err) => {
      res = res.data
      if (res.status === 'success') {
        this.changeInfo(res.data.user)
        this.info = forrmatFileUrl(res.data.userinfo)
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
.popupBox {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: #000;
    .popuItem {
        padding-left: 20px;
        font-size: 17px;
        text-align: left;
    }
    .loginOut {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        .loginOutBtn {
            height: 40px;
            width: 80%;
            border: 1px solid #000;
            text-align: center;
            line-height: 40px;
            box-sizing: border-box;
            font-size: 17px;
        }
    }
}
</style>