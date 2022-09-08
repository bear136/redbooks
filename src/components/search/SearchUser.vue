<template>
  <div class="search_list">
    <van-list v-model="loading"
              :finished="finished"
              :immediate-check='false'
              @load='onload'
              finished-text="没有更多了">
      <div class="search_user_item"
           @click="goToUserInfo(item.userid)"
           v-for="item in userList"
           :key="item.userid">
        <div class="user_info">
          <img :src="item.head_photo"
               alt="头像">
          <div class="info_box">
            <h4 class="user_name">
              {{item.username}}
            </h4>
            <div class="fans_count">
              粉丝:{{item.fans_count}}
            </div>
            <div class="synopsis van-ellipsis">
              简介: {{item.info}}
            </div>
          </div>
        </div>
        <div class="focus_status rightBox"
             v-show="isFocus(item).show"
             @click="changFocusStatus(item.userid)">
          {{isFocus(item).value}}
        </div>
        <div v-show="!isFocus(item).show"
             class="rightBox">
          {{ isFocus(item).value}}
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      finished: false,
      loading: false
    }
  },
  props: {
    userList: {
      type: Array,
      default: () => []
    },
    userResIsAll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isFocus () {
      let res = {}
      return item => {
        const status = this.getRelation(item)
        if (status === '0') {
          res = {
            show: true,
            value: '关注'
          }
        } else if (status === '2') {
          res = {
            show: true,
            value: '回关'
          }
        } else {
          res = {
            show: false,
            value: '朋友'
          }
        }
        return res
      }
    }
  },
  methods: {
    onload () {
      if (!userResIsAll) {
        this.$bus.$emit('getMoreUser')
        this.loading = true 
      } else {
        this.finished = true
      }
    },
    async changFocusStatus (id) {
      const { data: res } = await this.$http.put(`/relationInfo/changeRelationStatus?relation_id=${id}`)
      if (res.status === 'success') {
        this.$Toast.success('关注成功')
      }
    },
    goToUserInfo (id) {
      this.$router.push({ name: 'otherPerson', query: { userId: id } })
    },

    async getRelation (item) {
      const { data: res } = await this.$http.get('/relationInfo/getRelation', {
        params: {
          relation_id: item.userid
        }
      })
      if (res.status === 'success') {
        return res.relationInfo.status
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search_list {
    width: 100%;
    .search_user_item {
        height: 100px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .user_info {
            width: 220px;
            height: 80px;
            display: flex;
            align-items: center;
            img {
                height: 70px;
                width: 70px;
                background-color: #ccc;
                border-radius: 50%;
            }
            .info_box {
                width: 130px;
                height: 75px;
                box-sizing: border-box;
                padding: 5px;
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                color: #7b7b7b;
                .user_name {
                    color: #1a1823;
                }
            }
        }
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
            background-color: rgb(252, 43, 85);
            color: #fcfcfa !important;
        }
    }
}
</style>