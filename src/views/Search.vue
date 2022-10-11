<template>
  <div>
    <header class="nav_bar">
      <div @click="goBack()">
        <van-icon name="arrow-left"
                  size="20" />
      </div>
      <van-search v-model="searchInfo.value"
                  placeholder="请输入搜索关键词" />
      <div class="searchBtn"
           @click="searchContent()">
        搜索
      </div>
    </header>
    <div class="router_view_part">
      <div>
        <div v-show="this.hisitoryShow">
          <div class="history_search"
               v-show="this.hisitoryShow&&this.historyInfo.hisList.length">
            <div class="history_item"
                 v-for="(item, index) in showHisArr"
                 @click.stop="geHisSearchRes(item)"
                 :key="index">
              <span>{{item}}</span>
              <van-icon name="cross"
                        @click="removeHistoryItem(item)"
                        size="14px"
                        color="#8e8e8e" />
            </div>
          </div>
          <van-divider @click="showAll()"
                       v-show="!this.showAllList&&this.historyInfo.hisList.length>4">全部搜索记录</van-divider>

          <van-divider @click="clearAll()"
                       v-show="this.showAllList">清除全部搜索记录</van-divider>
        </div>

      </div>
      <!-- 搜索页面 -->
      <div class="search_result_box"
           v-if="historyResShow">
        <van-tabs v-model="active"
                  @click="changeSearchTabs">
          <van-tab title="文章"
                   name="article">

            <div>
              <van-tabs v-model="activeNum"
                        @click="getArticleInfo"
                        v-show="showSearchList"
                        type="card">
                <van-tab :title="item.article_type"
                         v-for="(item, index) in article_type"
                         :key="index"
                         :name='item.article_type_id'>
                  <van-empty image="search"
                             description="未搜到相关内容"
                             v-show="!articleInfoList.length" />
                  <Browse :info='articleInfoList'
                          :isAll="articleIsAll"
                          v-show="articleInfoList.length" />
                </van-tab>
              </van-tabs>
            </div>

          </van-tab>
          <van-tab title="
                    用户"
                   name="user">
            <SearchUser :userList='searchUserInfo'
                        :userResIsAll='userResIsAll'
                        v-show="searchUserInfo.length" />
            <van-empty image="search"
                       description="未搜到相关内容"
                       v-show="!searchUserInfo.length" />
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import SearchUser from '../components/search/SearchUser.vue'
import Browse from '../components/show/Browse.vue'
import { forrmatFileUrl } from './../utils/utils'
export default {
  data () {
    return {
      userResIsAll: false,
      searchInfo: {
        value: ''
      },
      historyInfo: {
        hisList: []
      },
      showAllList: false,
      isAll: false,
      hisitoryShow: true,
      historyResShow: false,
      active: 'article',
      activeNum: 0,
      selecttypeStyle: 'isactive',
      userSearchPageInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      article_type: [
        {
          article_type_id: 0,
          article_type: '全部'
        }
      ],
      articleSearchPageInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      searchUserInfo: [],
      recordVal: '',
      articleInfoList: [],
      articleIsAll: false,
      showSearchList: false
    }
  },
  components: {
    SearchUser,
    Browse
  },
  computed: {
    showHisArr () {
      if (this.showAllList) {
        return this.historyInfo.hisList
      } else {
        return this.historyInfo.hisList.slice(0, Math.min(this.historyInfo.hisList.length, 4))
      }
    }
  },
  mounted () {
    this.getAllHistotyList()
    this.getartcleType()
    this.$bus.$on('getAllarticle', this.getAll)
    this.$bus.$on('getMoreUser', this.getMoreUser)
  },
  methods: {
    async getMoreUser () {
      this.userSearchPageInfo.pageIndex++
      const res = await this.getSearchUser()
      this.searchUserInfo.push(...res)
    },
    async searchContent () {
      if (this.searchInfo.value === '') {
        return this.$Toast('请输入搜索关键词')
      } else {
        this.hisitoryShow = false
        this.historyResShow = true
        this.articleInfoList = await this.getSearchArticle()
      }
    },
    async getAll () {
      if (this.activeNum === 0) {
        this.articleSearchPageInfo.pageIndex++
        const res = await this.getSearchArticle()
        this.articleInfoList.push(...res)
      } else {
        let i = 1
        const res = await this.getArticleByType(this.activeNum, ++i)
        this.articleInfoList.push(...res)
      }
    },
    /**
     * 获取历史消息
     */
    async getAllHistotyList () {
      const searchHistory = {
        pageIndex: 1,
        pageSize: 10
      }
      while (!this.isAll) {
        const { data: res } = await this.$http.get('/search/getAllSearchRecord', {
          params: {
            ...searchHistory
          }
        })

        if (res.status === 'success') {
          if (res.searchRecordList.length == 0) {
            this.isAll = true

            return
          }
          this.historyInfo.hisList.push(...res.searchRecordList)
        }
        searchHistory.pageIndex++
      }
    },
    async removeHistoryItem (item) {
      const { data: res } = await this.$http.delete('/search/delSearchRecord', {
        params: {
          searchString: item
        }
      })
      if (res.status === 'success') {
        const index = this.historyInfo.hisList.indexOf(item)
        this.historyInfo.hisList.splice(index, 1)
      }
    },
    async clearAll () {
      try {
        const dialogRes = await this.$dialog.confirm({
          message: '历史记录清楚后无法恢复，是否清楚全部记录'
        })
        if (dialogRes === 'confirm') {
          const { data: res } = await this.$http.delete('/search/delAllSearchRecord')
          if (res.status === 'success') {
            this.$Toast.success('清除成功！')
            this.historyInfo.hisList = []
          } else {
            this.$Toast.fail('请稍后重试')
          }
        }
      } catch (error) { }
    },
    goBack () {
      this.$router.push('/home')
    },
    showAll () {
      this.showAllList = true
    },
    async changeSearchTabs (name) {
      switch (name) {
        case 'article':
          break
        case 'user':
          this.searchUserInfo = await this.getSearchUser()
          break
      }
    },
    async getArticleInfo (name) {
      this.articleIsAll = false
      if (name === 0) {
        this.articleInfoList = await this.getSearchArticle()
      } else {
        this.articleInfoList = await this.getArticleByType(name)
      }
    },
    async getArticleByType (item, index = 1) {
      const { data: res } = await this.$http.get('/search/searchArticleByType', {
        params: {
          searchString: this.searchInfo.value,
          article_type_id: item,
          pageIndex: index,
          pageSize: 10
        }
      })

      if (res.status === 'success') {
        if (res.articleInfoList === null) {
          this.articleIsAll = true
          return []
        } else {
          return forrmatFileUrl(res.articleInfoList)
        }
      }
    },
    async getSearchArticle () {
      const { data: res } = await this.$http.get('/search/searchArticle', {
        params: {
          searchString: this.searchInfo.value,
          ...this.articleSearchPageInfo
        }
      })
      if (res.status === 'success') {
        if (res.articleInfoList === null) {
          this.articleIsAll = true
          return []
        } else {
          return forrmatFileUrl(res.articleInfoList)
        }
      }
    },
    async getSearchUser () {
      if (this.searchInfo.value === '') return
      const { data: res } = await this.$http.get('/search/searchUser', {
        params: {
          searchString: this.searchInfo.value,
          ...this.userSearchPageInfo
        }
      })
      if (res.userInfoList == null) {
        this.userResIsAll = true
        return []
      }
      return forrmatFileUrl(res.userInfoList)
    },
    async getartcleType () {
      const { data: res } = await this.$http.get('/article/getAllArticleType')
      if (res.status === 'success') {
        this.article_type.push(...res.articleTypeList)
        this.showSearchList = true
      }
    },
    geHisSearchRes (item) {
      this.searchInfo.value = item
      this.searchContent()
    }
  }
}
</script>
 
<style lang="less" scoped>
.nav_bar {
  height: 46px;
  width: 100%;
  top: 0;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .van-search__content {
    background-color: #f3f3f3;
  }

  .van-search {
    width: 80%;
    box-sizing: border-box;
  }

  .searchBtn {
    color: #f1355d;
  }
}

.router_view_part {
  margin-top: 50px;
  box-sizing: border-box;

  .van-divider {
    width: 100%;
    margin: 0;
  }

  .history_search {
    width: 100%;
    display: flex;

    box-sizing: border-box;
    padding: 15px;
    flex-wrap: wrap;
  }

  .history_item {
    height: 40px;
    width: 40%;
    color: #1b1a20;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;

    span {
      overflow: hidden;
      height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .search_result_box {
    width: 100%;
  }
}
</style>