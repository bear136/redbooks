<template>
  <div class="likePart">
    <van-icon :name="isLike ? 'like-o' :'like'"
              :color="isLike ? '#000' : '#f40'"
              @click="takeLike(msgItem)" />
    <span>{{give_like_count||0}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLike: true,
      give_like_count: 0,
      color: '#000',
      article_id: 0,
      msgInfo: {}
    }
  },
  mounted () {
    this.getLike(this.msgItem)
    this.give_like_count = this.likeCount
  },
  props: ['msgItem', 'likeCount'],
  watch: {
    msgItem (newVal, oldVal) {
      this.msgInfo = newVal
      this.getLike(newVal)
    },
    likeCount (newVal) {
      this.give_like_count = newVal
    }
  },
  methods: {
    async getLike (msgItem) {
      const { data: result } = await this.$http.get('/article/isGiveLike', {
        params: {
          article_id: msgItem.article_id
        }
      })
      this.isLike = result.isGiveLike === 0
    },
    async takeLike (item) {
   
      const urlparams = this.isLike ? '/article/giveLike' : '/article/delLike'
      const count = this.isLike ? 1 : -1
      const { data: res } = await this.$http.put(`${urlparams}?article_id=${item.article_id}`)
      if (res.status === 'success') {
        this.getLike(item)
        this.give_like_count += count
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>