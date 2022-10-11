<template>
  <div class="search_list">
    <van-list
      v-model="loading"
      :finished="finished"
      :immediate-check="false"
      @load="onload"
      finished-text="没有更多了"
    >
      <div
        class="search_user_item"
        @click="goToUserInfo(item.userid)"
        v-for="item in userList"
        :key="item.userid"
      >
        <div class="user_info">
          <img :src="item.head_photo" alt="头像" />
          <div class="info_box">
            <h4 class="user_name">
              {{ item.username }}
            </h4>
            <div class="fans_count">粉丝:{{ item.fans_count }}</div>
            <div class="synopsis van-ellipsis">简介: {{ item.info }}</div>
          </div>
        </div>
        <IsFocus :item="item" class="isfocus" />
      </div>
    </van-list>
  </div>
</template>

<script>
import IsFocus from './IsFocus.vue'
export default {
  data () {
    return {
      finished: false,
      loading: false
    }
  },
  components: {
    IsFocus
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
  methods: {
    onload () {
      // eslint-disable-next-line no-undef
      if (!userResIsAll) {
        this.$bus.$emit('getMoreUser')
        this.loading = true
      } else {
        this.finished = true
      }
    },

    goToUserInfo (id) {
      this.$router.push({ name: 'otherPerson', query: { userId: id } })
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
  }
}
</style>
