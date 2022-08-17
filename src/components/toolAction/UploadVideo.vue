<template>
  <div>
    <van-uploader v-model="fileList"
                  :before-read="beforeRead"
                  :after-read="afterRead"
                  :max-count="1"
                  :deletable='showDeletable'
                  @delete='removeFile'
                  accept="avi,flv,mpg,mpeg,mpe,mp4">
      <van-icon name="video"
                size="50px"
                color="#dcdee0" />

    </van-uploader>
    <van-button plain
                v-show="showBtn"
                size="small"
                type="info"
                @click="uploadVideo">确定上传</van-button>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { calculateHashSample, createFileChunk, formatterChunkList } from '../../utils/videoHash'
export default {
  data () {
    return {
      fileList: [],
      currentRate: 0,
      rate: 30,
      hashPath: '',
      curtSize: 5 * 1024 * 1024,
      chunkList: [],
      info: {
        articleFileDir: '',
        coverFilePath: '',
        isVideo: 1
      },
      showDeletable: true,
      showBtn: true
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  computed: {
    text () {
      return this.currentRate.toFixed(0) + '%'
    }
  },
  methods: {
    beforeRead (file) {
      const imgType = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png']
      if (imgType.includes(file.type) === true) {
        this.$Toast('请上传视频文件')
        return false
      }
      return true
    },
    async afterRead (file) {
      this.hashPath = await calculateHashSample(file.file)
      console.log(this.hashPath)
    },
    removeFile () {
      this.hashPath = ''
    },
    async uploadChunks (requestList) {
      const file = this.fileList[0].file
      const updateVideoList = requestList.map(async item => {
        return this.$http.post('/article/chunkUpload', item)
      })
      const res = await Promise.all(updateVideoList)
      res.map(item => {
        if (item.data.status !== 'success') {
          return this.$Toast.fail('上传失败，请重试')
        }
      })
      const formData = new FormData()
      formData.append('chunkTotal', this.chunkList.length)
      formData.append('fileSize', file.size)
      formData.append('hashPath', this.hashPath)
      formData.append('fileExt', '.' + file.type.slice(6, file.type.length))
      const { data: result } = await this.$http.post('/article/mergeChunk', formData)
      const { articleFileDir, coverFilePath } = result
      this.info.articleFileDir = articleFileDir
      this.info.coverFilePath = coverFilePath
      this.showDeletable = false
      this.showBtn = false
      this.$emit('uploadVideo', this.info)
    },
    async checkUpdateList () {
      const { data: res } = await this.$http.get('/article/articleExist', {
        params: {
          hashPath: this.hashPath
        }
      })
      if (res.status === 'success') {
        if (res.articleFileDir !== '') {
          this.info.articleFileDir = res.articleFileDir
          this.$emit('uploadVideo', this.info)
          return 'success'
        } else {
          return res.chunkIndexList
        }
      }
    },
    async uploadVideo () {
      if (this.fileList.length === 0) {
        return this.$Toast.fail('请选择视频文件')
      } else {
        const file = this.fileList[0].file
        const updatedList = await this.checkUpdateList()
        console.log(updatedList)
        if (updatedList === 'success') {
          this.showDeletable = false
          this.showBtn = false
          return this.$Toast.success('上传成功')
        } else {
          const fileChunkList = createFileChunk(file, this.curtSize)
          fileChunkList.map(({ chunkFile }, index) => {
            if (!updatedList) {
              this.chunkList.push({ hashPath: this.hashPath, chunkFile, chunkIndex: index })
            } else {
              if (!updatedList.includes(index + '')) {
                this.chunkList.push({ hashPath: this.hashPath, chunkFile, chunkIndex: index })
              }
            }
          })
          const requestList = formatterChunkList(this.chunkList)
          this.uploadChunks(requestList)
        }
      }
    },
    cancelUploader () {
      console.log('hello')
    }
  }
}
</script>
<style lang="less" scoped>
.van-uploader {
    box-sizing: border-box;
    height: 80px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(247, 248, 250);
}
.van-button {
    margin-top: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
.box {
    border-radius: 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.videoUpdateBox {
    height: 300px;
    width: 300px;
}
</style>