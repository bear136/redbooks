<template>
  <div class="putContent">
    <van-field v-model="content"
               id="reviewInput"
               rows="1"
               autosize
               type="textarea"
               placeholder="请输入留言" />
    <van-button icon='guide-o'
                @click="sendVomment()"></van-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: ''
    }
  },
  mounted () {
    this.$bus.$on('getFocus', this.getFocus)
  },
  props: ['reviewObj'],
  methods: {
    getFocus () {
      this.$nextTick(() => {
        document.getElementById('reviewInput').focus()
      })
    },
    async sendVomment () {
      if (this.content === '') return
      this.$store.dispatch('reviewInfo/addReviewInfo', { content: this.content })
      const reviewInfo = this.$store.getters['reviewInfo/getAllInfo']
      if (reviewInfo !== null) {
        const { data: res } = await this.$http({
          method: 'POST',
          url: '/comment/addComment',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify(reviewInfo)
        })
        if (res.status === 'success') {
          this.$bus.$emit('refreshReviewList')
          this.content = ''
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.putContent {
    position: fixed;
    background-color: #fff;
    bottom: 0px;
    min-height: 60px;
    box-sizing: border-box;
    border-top: 1px solid #ccc;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .van-field {
        height: 100%;
        width: 80%;
        border-radius: 10px;
        margin-top: 10px;
        overflow-x: hidden;
        background-color: #f0f0f0;
    }
    .van-button {
        color: #fff;
        margin-top: 10px;
        background-color: #f40;
        font-size: 22px;
        border-radius: 50%;
        height: 44px;
        width: 44px;
    }
}
</style>