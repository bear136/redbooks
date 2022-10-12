<template>
  <div class="focusBox" v-show="focusObj">
    <div
      class="focus_status rightBox"
      v-show="focusObj && focusObj.show"
      @click="changFocusStatus(item.userid)"
    >
      {{ focusObj.value }}
    </div>
    <div v-show="focusObj && !focusObj.show" class="rightBox">
      {{ focusObj.value }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      focusObj: {}
    }
  },

  methods: {
    async getRelation () {
      const { data: res } = await this.$http.get('/relationInfo/getRelation', {
        params: {
          relation_id: this.item.userid
        }
      })
      if (this.item.userid === sessionStorage.getItem('userid')) {
        return (this.focusObj = {
          show: false,
          value: '本人'
        })
      }
      if (res.status === 'success') {
        const status = res.relationInfo.status
        let obj
        if (status === 0) {
          obj = {
            show: true,
            value: '关注'
          }
        } else if (status === 2) {
          obj = {
            show: true,
            value: '回关'
          }
        } else {
          obj = {
            show: false,
            value: '朋友'
          }
        }
        this.focusObj = obj
      }
    },
    async changFocusStatus (id) {
      const { data: res } = await this.$http.put(
        `/relationInfo/changeRelationStatus?relation_id=${id}`
      )
      if (res.status === 'success') {
        this.$Toast.success('关注成功')
      }
    }
  },
  mounted () {
    this.getRelation()
  }
}
</script>

<style scoped lang="less">
.focusBox {
  .rightBox {
    width: 80px;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-size: 15px;
    color: #7b7b7b;
  }

  .focus_status {
    background-color: rgb(252, 43, 85) !important;
    color: #fcfcfa !important;
  }
}
</style>
