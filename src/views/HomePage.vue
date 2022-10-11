<template>
    <div>
        <Browse :info='articleInfo'
                :key="handleDate()"
                :isAll="articleIsAll"
                v-show="articleInfo" />
        <van-empty :description="articleTips"
                   v-show="!articleInfo" />
    </div>
</template>

<script>
import Browse from '../components/show/Browse.vue'
import { forrmatFileUrl } from '../utils/utils'
export default {
    data () {
        return {
            articleInfo: null,
            articleIsAll: false,
            articleTips: '暂无内容',
            pageInfo: {
                pageIndex: 1,
                pageSize: 8
            }

        }
    },
    created () {
        let path = this.$route.path
        let type = path.slice(7, path.length)
        switch (type) {
            case 'recommended':
                this.articleTips = '暂无推荐！'
                this.getArticleInfo('/article/pushArticleFeed')
                break
            case 'focuse':
                this.articleTips = '您的关注列表还没有发布作品哦！'
                this.getArticleInfo('/article/getArticleFromFollow')
                break
            case 'discover':
                this.articleTips = '暂时还没有此类作品！'
                this.getArticleInfoByType('/article/pushArticleByType', this.$route.query.type)
                break
            default:

                break
        }
    },
    computed: {

    },
    methods: {
        async getArticleInfo (url) {
            const { data: res } = await this.$http.get(url, {
                params: this.pageInfo
            })
            this.articleInfo = forrmatFileUrl(res.articleInfoList)
        },
        async getArticleInfoByType (url, type) {
            const { data: res } = await this.$http.get(url, {

                params: {
                    ...this.pageInfo,
                    article_type_id: type,
                }
            })
           
            this.articleInfo = forrmatFileUrl(res.articleInfoList)
        },
        handleDate () {
            return new Date().getTime()
        }
    },
    components: {
        Browse
    }
}
</script>

<style lang="less" scoped>

</style>