<template>
  <div>
    <Browse :info='articleInfoListByFriends'
            :isAll="friendIsAll"
            v-show="articleInfoListByFriends" />
    <van-empty description="您的朋友还没有发布作品哦！"
               v-show="!articleInfoListByFriends" />
  </div>
</template>

<script>
import Browse from '../components/show/Browse.vue'
import { forrmatFileUrl } from '../utils/utils'
export default {
  components: {
    Browse
  },
  data () {
    return {
      pageFriendInfo: {
        pageIndex: 1,
        pageSize: 8
      },
      articleInfoListByFriends: null,
      friendIsAll: false
    }
  },
  methods: {
    async getArticleFromFriend () {
      const { data: res } = await this.$http.get('/article/getArticleFromFriend', {
        params: this.pageFriendInfo
      })
      if (res.status === 'success') {
        return res.articleInfoList ? forrmatFileUrl(res.articleInfoList) : null
      }
    },
    async getAll () {
      this.pageFriendInfo.pageIndex++
      const res = await this.getArticleFromFriend()
      if (res !== null) {
        this.pageFriendInfo.push(...res)
      } else {
        this.friendIsAll = true
      }
    }
  },
  mounted () {
    this.getArticleFromFriend().then(res => {
      this.articleInfoListByFriends = res
    })

    this.$bus.$on('getAllarticle', this.getAll)
  }
}
</script>
