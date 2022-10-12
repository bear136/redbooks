<template>
  <div>
    <van-nav-bar title="新增关注"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />

    <div class="showlist">
      <van-list v-model="loading"
                :finished="finished"
                :immediate-check='false'
                @load='onload'
                finished-text="没有更多了">
        <div class="item"
             v-for="(item, index) in focusArr"
             :key="index">
          <div>
            <van-image width="40"
                       height="40"
                       fit="cover"
                       round
                       :src="userInfo(item).head_photo" />
          </div>
          <div class="info">
            <div>{{userInfo(item).username}}</div>
            <p>开始关注你了 {{sendTime(item.send_time)}}</p>
          </div>
          <RelationStatus :userId='userInfo(item).userid' />
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'
import RelationStatus from '../../components/person/RelationStatus.vue'
export default {
  data () {
    return {
      focusArr: [],
      loading: false,
      finished: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  components: {
    RelationStatus
  },
  computed: {
    sendTime () {
      return time => time.slice(0, 11)
    },
    userInfo () {
      return info => info.notify.form_user_info
    }
  },
  methods: {
    onload () {
      this.pageInfo.pageIndex++
      this.initFocusArr()
      this.loading = false
    },
    onClickLeft () {
      this.$router.back()
    },
    async initFocusArr () {
      const { data: res } = await this.$http.get('/notify/getNotifyHistory', {
        params: {
          notifyType: 'follow',
          ...this.pageInfo
        }
      })
      if (res.status === 'success') {
        if (res.notifyHistory_follow === null) {
          this.finished = true
          return
        }
        this.focusArr.push(...forrmatFileUrl(res.notifyHistory_follow))
      }
    },
    async resetNotify () {
      const { data: res } = await this.$http.put('/notify/resetUnreadNotify?notifyType=follow')
      console.log(res)
      if (res.status !== 'success') {
        throw new Error('重置失败')
      }
    }
  },
  async mounted () {
    this.initFocusArr()
  },

  beforeDestroy () {
    this.resetNotify()
  }
}
</script>

<style lang='less' scoped>
.showlist {
    .item {
        height: 60px;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 1px solid #f0f0f0;
        box-sizing: border-box;
        .info {
            height: 40px;
            width: 250px;
            background-color: #fff;
            box-sizing: border-box;
            padding: 5px;
            div {
                font-size: 13px;
            }
            p {
                font-size: 12px;
                color: #ccc;
                overflow: hidden; //超出部分隐藏
                text-overflow: ellipsis; //超出部分显示...
                white-space: nowrap; //文本强制一行显示
            }
        }
    }
}
</style>
