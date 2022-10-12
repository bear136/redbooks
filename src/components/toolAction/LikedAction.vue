<template>
  <div class="toolList">
    <div class="head_photo">
      <img :src="actionInfo.userInfo.head_photo"
           alt="">
    </div>
    <div class="giveLikePart childPart"
         @click.stop="giveLike">
      <van-icon name="like"
                :color="likedcolor" />
      <span>{{actionInfo.give_like_count}}</span>
    </div>
    <div class="chatPart childPart">
      <van-icon name="chat"
                @click.stop="showReview"
                color="#fff" />
      <span>{{actionInfo.comment_count}}</span>
    </div>
    <div class="sharePart childPart">
      <van-icon name="share"
                color="#fff" />
      <span>0</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      likedcolor: '#fff'
    }
  },
  methods: {
    async getLiked () {
      const { data: res } = await this.$http.get('/article/isGiveLike', {
        params: {
          article_id: this.$route.query.messageId
        }
      })

      if (res.status === 'success') {
        this.likedcolor = res.isGiveLike ? '#f40' : '#fff'
      }
    },
    async giveLike () {
      let urlparams = ''
      if (this.likedcolor === '#fff') {
        urlparams = '/article/giveLike'
      } else {
        urlparams = '/article/delLike'
      }
      const { data: res } = await this.$http.put(`${urlparams}?article_id=${this.actionInfo.id}`)
      if (res.status === 'success') {
        this.$bus.$emit('getInfo')
        this.getLiked()
      }
    },
    showReview () {
      this.$bus.$emit('showReview')
    }
  },
  mounted () {
    this.getLiked()
    this.$bus.$on('doubleClick', this.giveLike)
    this.$bus.$on('getNewLikeInfo', this.getLiked)
  },
  props: ['actionInfo']
}
</script>

<style lang="less" scoped>
.toolList {
    height: 300px;
    width: 50px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    color: #fff;
    .head_photo {
        height: 50px;
        width: 50px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #ccc;
        background-color: #fff;
        border-radius: 50%;
        justify-content: center;

        img {
            height: 90%;
            width: 90%;
            border-radius: 50%;
            background-color: #ccc;
        }
    }
    .childPart {
        height: 50px;
        width: 50px;
        text-align: center;
        font-size: 14px;
        .van-icon {
            font-size: 38px;
        }
        span {
            width: 50px;
            text-align: center;
            display: block;
        }
    }
}
</style>
