<template>
  <div class="perWord">
    <van-tabs v-model="active"
              @click="changeBrow"
              animated
              sticky>
      <van-tab title="作品">
        <Browse v-bind:info='allMsgInfo'
                v-show="allMsgInfo" />
        <van-empty description="您还没有作品哦,快来发布！"
                   v-show="!allMsgInfo" />
      </van-tab>
      <van-tab title="收藏">
        <van-empty description="您还没有收藏的哦" />
      </van-tab>
      <van-tab title="点赞">
        <Browse v-show="likeMsgInfo"
                v-bind:info='likeMsgInfo' />
        <van-empty description="您还没有喜欢的哦"
                   v-show="!likeMsgInfo" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Browse from '../show/Browse.vue'
import { forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      active: 0,
      msg: null,
      likeMsg: null,
      allMsgInfo: null,
      likeMsgInfo: null
    }
  },
  components: {
    Browse
  },
  props: {
    id: {
      required: false
    }
  },
  mounted () {
    this.getMsgInfo()
  },
  methods: {
    changeBrow (title) {
      switch (title) {
        case 0:
          this.getMsgInfo()
          break
        case 1:
          break
        case 2:
          this.getGiveLike()
          break
      }
    },
    async getMsgInfo () {
      const id = window.sessionStorage.getItem('userid')
      const { data: res } = await this.$http.get('/article/getAllArticle', {
        params: {
          userid: this.id ? this.id : id
        }
      })
      if (res.status === 'success') {
        this.msg = res.articleInfoList ? forrmatFileUrl(res.articleInfoList) : res.articleInfoList
      }
      this.allMsgInfo = this.msg
    },
    async getGiveLike () {
      const id = window.sessionStorage.getItem('userid')
      const { data: res } = await this.$http.get('/article/getGiveLikeArticle', {
        params: {
          userid: this.id ? this.id : id
        }
      })
      if (res.status === 'success') {
        this.likeMsg = res.giveLikeArticleList ? forrmatFileUrl(res.giveLikeArticleList) : res.giveLikeArticleList
        this.likeMsg = this.likeMsg.filter(item => {
          return item !== null
        })
        if (this.likeMsg.length === 0 || this.likeMsg === null) {
          this.likeMsg = null
        }
        this.likeMsgInfo = this.likeMsg
      }
    }
  }
}
</script>
