
<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="发布作品"
                 left-text="返回"
                 right-text="发布"
                 left-arrow
                 @click-right='upadteArticle'
                 @click-left="onClickLeft" />
    <!-- 上传图片 -->

    <div class="updataView">
      <van-uploader v-show="!video_show"
                    v-model="fileList"
                    :before-read="beforeRead"
                    multiple
                    :max-count="maxCount" />
      <UploadVideo v-show="video_show"
                   @uploadVideo='uploadVideo' />
    </div>

    <!-- 正文编写 -->
    <div class="article">
      <van-field v-model="articleInfo.title"
                 label="标题"
                 label-align='center'
                 input-align="left"
                 maxlength="10"
                 show-word-limit
                 placeholder="填写标题有更多赞哦！" />
      <van-field v-model="articleInfo.content"
                 rows="3"
                 autosize
                 label="正文"
                 label-align='center'
                 input-align="left"
                 type="textarea"
                 placeholder="添加正文" />
    </div>
    <van-action-sheet v-model="articleTypeShow"
                      :actions="articleType"
                      cancel-text="取消"
                      description="选择文章类型"
                      @select="onSelectType"
                      close-on-click-action />

    <van-overlay :show="overlayShow">
      <div class="wrapper">
        <div class="block">
          <van-loading size="50px"
                       vertical>文章上传中...</van-loading>
        </div>

      </div>
    </van-overlay>
  </div>
</template>

<script>
import moment from 'moment'
import UploadVideo from '../components/toolAction/UploadVideo.vue'

export default {
  data () {
    return {
      fileList: [],
      maxCount: 9,
      articleInfo: {
        title: '',
        content: '',
        is_video: 0,
        article_file: null,
        cover_file: null,
        release_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        article_type_id: 0,
        articleFileDir: '',
        coverFilePath: ''
      },
      articleType: [],
      articleTypeShow: false,
      video_show: false,
      overlayShow: false
    }
  },
  components: {
    UploadVideo
  },
  mounted () {
    this.getType()
    this.video_show = Number(this.$route.query.isVideo)
  },
  methods: {
    uploadVideo (info) {
      console.log(info)
      const { articleFileDir, coverFilePath, isVideo } = info
      this.articleInfo.articleFileDir = articleFileDir
      this.articleInfo.coverFilePath = coverFilePath
      this.articleInfo.is_video = isVideo
    },
    onClickLeft () {
      this.$router.push('/home')
    },
    // 前置处理
    beforeRead (file) {
      const imgType = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png']
      if (imgType.includes(file.type) === false) {
        this.$Toast('请上传.jpeg/.jpg/.webp/.png 格式的图片')
        return false
      }
      return true
    },
    forrmatArticInfo () {
      const formData = new FormData()
      // eslint-disable-next-line camelcase
      const { title, content, is_video, release_time, article_type_id, cover_file, articleFileDir, coverFilePath } =
        this.articleInfo
      formData.append('title', title)
      formData.append('content', content)
      formData.append('is_video', is_video)
      formData.append('release_time', release_time)
      formData.append('article_type_id', article_type_id)
      // eslint-disable-next-line camelcase
      if (is_video === 1) {
        formData.append('articleFileDir', articleFileDir)
        formData.append('coverFilePath', coverFilePath)
      } else {
        // eslint-disable-next-line camelcase
        formData.append('cover_file', cover_file || this.fileList[0].file)
        for (let i = 0; i < this.fileList.length; i++) {
          formData.append('article_file', this.fileList[i].file)
        }
      }
      return formData
    },
    async getType () {
      const { data: typeRes } = await this.$http.get('/article/getAllArticleType')
      if (typeRes.status === 'success') {
        typeRes.articleTypeList.map(item => {
          this.articleType.push({
            name: item.article_type,
            id: item.article_type_id
          })
        })
      } else {
        this.$Toast.fail('加载失败，请重试')
      }
    },
    // 上传文章的所有信息
    upadteArticle () {
      this.articleTypeShow = true
    },
    async onSelectType (item) {
      this.articleInfo.article_type_id = item.id
      const { title, content } = this.articleInfo

      if (this.fileList.length === 0 && this.is_video === 0) {
        this.$Toast.fail('请选择上传的图片')
        return
      } else if (title === '') {
        this.$Toast.fail('请输入文章标题')
        return
      } else if (content === '') {
        this.$Toast.fail('请输入文章内容')
        return
      }
      const data = this.forrmatArticInfo()
      this.overlayShow = true
      const { data: res } = await this.$http.post('/article/publishedArticle', data)
      if (res.status === 'success') {
        this.$Toast.success('发布成功！')
        this.overlayShow = false
        this.$router.push('/first')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.updataView {
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    .van-uploader {
        max-width: 270px;
    }
}
video {
    margin: 10px auto;
    width: 100%;
    height: 400px;
}
.article {
    padding: 10px;
}
.wrapper {
    height: 200px;
    width: 200px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 200px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
