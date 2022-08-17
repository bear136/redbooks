
<template>
  <div>
    <!-- 顶部导航区 -->
    <van-tabs v-model="active"
              @click="changeBrow"
              animated>
      <van-tab title="关注">
        <Browse v-bind:info='articleFromFollow'
                v-show="articleFromFollow" />
        <van-empty description="您的关注列表还没有发布作品哦！"
                   v-show="!articleFromFollow" />
      </van-tab>
      <van-tab title="发现">
        <van-tabs v-model="chiledActive"
                  title-inactive-color='#ccc'
                  title-active-color='#000'
                  @click="getTypesArticle">
          <van-tab v-for="item in typeList"
                   :name="item.name"
                   :key="item.name">
            <template #title>
              <div class="typeTabs">
                {{item.title}}
              </div>
            </template>
            <Browse v-bind:info='articleFromType'
                    v-show="articleFromType" />
            <van-empty description="还没有人发布此类型的作品哦！"
                       v-show="!articleFromType" />
          </van-tab>
        </van-tabs>
      </van-tab>
      <van-tab title="朋友">
        <Browse v-bind:info='articleFromFriends'
                v-show="articleFromFriends" />
        <van-empty description="您的朋友还没有发布作品哦！"
                   v-show="!articleFromFriends" />
      </van-tab>

    </van-tabs>
  </div>
</template>

<script>
import Browse from '../components/show/Browse.vue'
import { forrmatFileUrl } from '../utils/utils'
export default {
  data () {
    return {
      active: 1,
      chiledActive: 0,
      msgInfo: [],
      pageFollowInfo: {
        pageIndex: 1,
        pageSize: 8
      },
      pageFriendInfo: {
        pageIndex: 1,
        pageSize: 8
      },
      articleFromFollow: null,
      articleFromFriends: null,
      typeList: [],
      articleFromType: null
    }
  },
  components: {
    Browse
  },
  methods: {
    async getType () {
      const { data: res } = await this.$http.get('/article/getAllArticleType')
      if (res.status === 'success') {
        res.articleTypeList.map(item => {
          this.typeList.push({
            name: item.article_type_id,
            title: item.article_type
          })
        })
      }
    },
    changeBrow (native) {
      switch (native) {
        case 0:
          this.getArticleFromFollow()
          break
        case 1:
          break
        case 2:
          this.getArticleFromFriend()
          break
      }
    },
    getTypesArticle (name = 1) {
      this.getArticleByType(name)
    },
    async getArticleByType (item) {
      const { data: res } = await this.$http.get('/article/pushArticleByType', {
        params: {
          article_type_id: item
        }
      })
      console.log(res)
      if (res.status === 'success') {
        this.articleFromType = forrmatFileUrl(res.articleInfoList)
      }
    },
    async getArticleFromFollow () {
      const { data: res } = await this.$http.get('/article/getArticleFromFollow', {
        params: this.pageFollowInfo
      })
      if (res.status === 'success') {
        this.articleFromFollow = res.articleInfoList ? forrmatFileUrl(res.articleInfoList) : null
      }
    },
    async getArticleFromFriend () {
      const { data: res } = await this.$http.get('/article/getArticleFromFriend', {
        params: this.pageFriendInfo
      })
      console.log(res)
      if (res.status === 'success') {
        this.articleFromFriends = res.articleInfoList ? forrmatFileUrl(res.articleInfoList) : null
      }
    }
  },
  mounted () {
    this.getType()
    this.getTypesArticle()
  }
}
</script>

<style lang='less' scoped>
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