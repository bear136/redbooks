
<template>
  <div>
    <van-nav-bar title="列表"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <!-- 导航标签 -->
    <van-tabs v-model="active"
              animated
              @change='changeList'
              swipeable>
      <van-tab title="关注">
        <!-- 展示列表 -->
        <FansItems v-bind:list='list' />
      </van-tab>
      <!-- 粉丝参数 -->
      <van-tab title="粉丝">
        <FansItems v-bind:list='fanslist' />
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import FansItems from './FansItems.vue'
import {  forrmatFileUrl } from '../../utils/utils'
export default {
  data () {
    return {
      active: 0,
      list: [],
      fanslist: []
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    changeList () {
      this.getList()
    },
    async getList () {
      if (this.active === 0) {
        let res = await this.$http.get('/relationInfo/getFollowList')
        res = res.data
        if (res.status === 'success') {
          this.list = forrmatFileUrl(res.followList)
        }
      } else if (this.active == 1) {
        let result = await this.$http.get('/relationInfo/getFansList')
        result = result.data
        if (result.status === 'success') {
          this.fanslist = forrmatFileUrl(result.followList)
        }
      }
    }
  },
  components: {
    FansItems
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang='less' scoped>
</style>