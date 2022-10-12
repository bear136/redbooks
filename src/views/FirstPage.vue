<!-- eslint-disable vue/no-unused-components -->
<template>
  <div>
    <!-- 顶部导航区 -->
    <van-tabs v-model="active" @disabled="gotoSearch" animated>
      <van-tab title="关注" to="/first/focuse">
        <router-view></router-view>
      </van-tab>

      <van-tab title="推荐" to="/first/recommended">
        <router-view></router-view>
      </van-tab>
      <van-tab title="发现" to="/first/discover">
        <van-tabs
          v-model="chiledActive"
          title-inactive-color="#ccc"
          title-active-color="#000"
        >
          <van-tab
            v-for="item in typeList"
            :name="item.name"
            :to="path + item.name"
            :key="item.name"
          >
            <template #title>
              <div class="typeTabs">
                {{ item.title }}
              </div>
            </template>
            <router-view></router-view>
          </van-tab>
        </van-tabs>
      </van-tab>
      <van-tab disabled>
        <template #title>
          <van-icon name="search" size="20" />
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 1,
      chiledActive: 0,
      path: '/first/discover?type=',
      typeList: [],
      type: 'recommended'
    }
  },
  components: {
  },
  methods: {
    async getType () {
      const { data: res } = await this.$http.get('/article/getAllArticleType')
      if (res.status === 'success') {
        res.articleTypeList.map((item) => {
          this.typeList.push({
            name: item.article_type_id,
            title: item.article_type
          })
        })
      }
    },
    async getAll () {
      if (this.active === 0) {
        this.pageFollowInfo.pageIndex++
        const res = await this.getArticleFromFollow()
        if (res !== null) {
          this.articleFromFollow.push(...res)
        } else {
          this.FocusIsAll = true
        }
      } else if (this.active === 2) {
        this.pageFriendInfo.pageIndex++
        const res = await this.getArticleFromFriend()
        if (res !== null) {
          this.articleFromFriends.push(...res)
        } else {
          this.friendIsAll = true
        }
      }
    },
    gotoSearch () {
      this.$router.push('/search')
    }
  },
  mounted () {
    this.getType()
    const path = this.$route.path
    this.type = path.slice(7, path.length)
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    routerTo () {
      switch (this.type) {
        case 'recommended':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.active = 1
          break
        case 'focuse':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.active = 0
          break
        case 'discover':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.active = 2
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  width: 100%;
}

.typeTabs {
  box-sizing: border-box;
  line-height: 26px;
  height: 26px;
  width: 20vw;
  border-radius: 10px;
  text-align: center;
}
</style>
