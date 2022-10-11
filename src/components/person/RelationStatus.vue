<template>
  <div>
    <van-button size="small"
                @click="changeStatus(userId)"
                round
                hairline>{{relationStatus}}</van-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      relationStatus: ''
    }
  },
  props: ['userId'],
  methods: {
    getStatue (id) {
      this.$http
        .get('/relationInfo/getRelation', {
          params: { relation_id: id }
        })
        .then(res => {
          res = res.data

          if (res.status === 'success') {
            const typeStatus = res.relationInfo.status
            if (typeStatus === 1) {
              this.relationStatus = '已关注'
            } else if (typeStatus === 3) {
              this.relationStatus = '互相关注'
            } else {
              this.relationStatus = '回关'
            }
          }
        })
    },
    async changeStatus (id) {
      const { data: res } = await this.$http.put(`/relationInfo/changeRelationStatus?relation_id=${id}`)
      if (res.status === 'success') {
        this.getStatue(this.userId)
      }
    }
  },
  created () {
    this.getStatue(this.userId)
  }
}
</script>

<style>

</style>