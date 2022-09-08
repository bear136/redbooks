<template>
  <div>
    <div class="likedAction">
      <van-icon :name="likeIcon"
                @click="giveLike(giveLikeInfo.isGiveLike,giveLikeInfo.commentId)"
                size="20px"
                :color="likedcolor" />
      <span>{{giveLikeInfo.count}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['giveLikeInfo'],
  data () {
    return {
      likedName: 'like-o',
      likedcolor: 'red'
    }
  },
  computed: {
    likeIcon () {
      if (this.giveLikeInfo.isGiveLike) {
        return 'like'
      } else {
        return 'like-o'
      }
    }
  },
  methods: {
    async giveLike (isGiveLike, commentid) {
      const putUrl = isGiveLike ? '/comment/decrCommentGiveLike' : '/comment/incrCommentGiveLike'
      const { data: res } = await this.$http.put(`${putUrl}?comment_id=${commentid}`)
      if (res.status === 'success') {
        this.$bus.$emit('changeLikeStatus')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.likedAction {
    display: flex;

    height: 20px;
    line-height: 20px;
    span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-left: 5px;
        color: #767676;
    }
}
</style>