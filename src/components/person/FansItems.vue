<template>
  <div class="showlist"
       v-if="personList!==null">
    <div class="item"
         @click="goTodetailInfo(String(item.user_info.userid))"
         v-for="(item,index) in personList"
         :key="index">
      <div>
        <van-image width="40"
                   height="40"
                   fit="cover"
                   round
                   :src="item.user_info.head_photo" />
      </div>
      <div class="info">
        <div>{{item.user_info.username}}</div>
        <p>{{item.user_info.info}}</p>
      </div>
      <van-button size="small"
                  round
                  hairline>{{personStatus(item)}}</van-button>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    list: {
      type: Array,
      required: false
    }
  },
  computed: {
    personList () {
      if (this.list !== null) {
        return this.list.filter(item => {
          return item.user_info !== null
        })
      }
    }
  },
  mounted () {},
  methods: {
    goTodetailInfo (id) {
      this.$router.push({ name: 'otherPerson', query: { userId: id } })
    },
    personStatus (item) {
      if (item.status === 1) {
        return '已关注'
      } else if (item.status === 3) {
        return '互相关注'
      } else {
        return '回关'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.showlist {
    margin-top: 20px;
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