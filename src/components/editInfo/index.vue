<template>
  <div>
    <van-nav-bar title="编辑资料"
                 left-text="返回"
                 right-text="保存"
                 left-arrow
                 @click-left="onClickLeft"
                 @click-right='saveInfo' />
    <!-- 上传头像 -->
    <van-uploader class="head_photo"
                  :after-read="afterAsyncRead"
                  :before-read="beforeRead"
                  :max-count="1">
      <van-image height="100"
                 width="100"
                 round
                 fit="cover"
                 :src="head_photo"
                 alt="" />
    </van-uploader>
    <!-- 编辑资料 -->
    <van-cell-group inset>

      <van-field v-model="editObj.name"
                 label="昵称"
                 input-align="right"
                 maxlength="10"
                 show-word-limit
                 placeholder="请输入用户名" />
      <van-cell is-link
                title="性别"
                :value="editObj.sex"
                @click="sexObj.show = true" />
      <van-action-sheet v-model="sexObj.show"
                        :actions="sexObj.actions"
                        @select="onSelect" />

      <van-cell title="选择生日"
                :value="editObj.date"
                @click="dateObj.show = true" />
      <van-calendar v-model="dateObj.show"
                    @confirm="onConfirm"
                    :show-confirm="false"
                    :min-date="dateObj.minDate"
                    :max-date="dateObj.maxDate" />

      <van-cell title="地区"
                is-link
                :value="editObj.address"
                @click="addressObj.show = true" />
      <van-action-sheet v-model='addressObj.show'>
        <van-area title="标题"
                  :value="editObj.address"
                  @confirm='confirmAddress'
                  :area-list="addressObj.areaList" />
      </van-action-sheet>
      <van-cell title="背景图"
                is-link
                @click="bgObj.show = !bgObj.show"
                value="上传背景图" />
      <van-field v-model="editObj.intro"
                 label="简介"
                 maxlength="30"
                 rows="2"
                 type="textarea"
                 autosize
                 show-word-limit
                 input-align="right"
                 placeholder="介绍自己" />
    </van-cell-group>
    <van-action-sheet v-model="bgObj.show"
                      title="背景图">
      <van-uploader class="head_photo"
                    :after-read="afterbgPhotoRead"
                    :before-read="beforeRead"
                    :max-count="1"
                    multiple>
        <van-image height="100"
                   width="100"
                   round
                   fit="cover"
                   :src="bgObj.photoList"
                   alt="" />
      </van-uploader>
    </van-action-sheet>

  </div>

</template>

<script>
import { forrmatFileUrl } from '../../utils/utils'
import { areaList } from '@vant/area-data'
export default {
  data () {
    return {
      editObj: {
        date: '',
        sex: '',
        address: '',
        name: '',
        intro: ''
      },
      dateObj: {
        show: false,
        minDate: new Date(1980, 0, 1),
        maxDate: new Date(2010, 0, 1)
      },
      sexObj: {
        show: false,
        actions: [{ name: '男' }, { name: '女' }]
      },
      addressObj: {
        show: false,
        areaList
      },

      head_photo: '',
      bgObj: {
        show: false,
        photoList: ''
      }
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/user')
    },
    // 上传前判断格式
    beforeRead (file) {
      const imgType = ['image/jpeg', 'image/png', 'image/webp']
      if (imgType.includes(file.type)) {
        return true
      }
      this.$Toast.fail('请上传jpg或者png或者格式的图片')
      return false
    },
    async afterAsyncRead (fileData) {
      const formData = new FormData()
   
      formData.append('head_photo_file', fileData.file)
      const { data: res } = await this.$http.post('/userInfo/headPhotoUpload', formData, {
        headers: {
          // 添加请求头
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.status === 'success') {
        this.head_photo = `${this.defalutUrl}${res.head_photo.slice(1, res.length)}`
      } else {
        this.$Toast.fail('上传失败，请稍后上传')
      }
    },
    async afterbgPhotoRead (fileData) {
      const formData = new FormData()
    
      formData.append('back_photo_file', fileData.file)
      const { data: res } = await this.$http.post('/userInfo/backPhotoUpload', formData, {
        headers: {
          // 添加请求头
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.status === 'success') {
        this.bgObj.photoList = `${this.defalutUrl}${res.back_photo.slice(1, res.length)}`
        this.$Toast.success('上传成功！')
        this.bgObj.show = false
      } else {
        this.$Toast.fail('上传失败，请稍后上传')
      }
    },
    formatDate (date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    onConfirm (date) {
      this.dateObj.show = false
      this.editObj.date = this.formatDate(date)
    },
    onSelect (item) {
      this.sexObj.show = false
      this.editObj.sex = item.name
    },
    // 选则地区
    confirmAddress (address) {
      this.addressObj.show = false
      if (address[0].name === address[1].name) {
        address.shift()
      }
      this.editObj.address = ''
      address.forEach(element => {
        this.editObj.address += `${element.name}`
      })
    },
    async saveInfo () {
      const { data: res } = await this.$http.put('/userInfo/updateUserInfo', {
        username: this.editObj.name,
        sex: this.editObj.sex,
        birthday: this.editObj.date,
        place: this.editObj.address,
        info: this.editObj.intro
      })
      if (res.status === 'success') {
        this.$Toast.success('保存成功')
      } else {
        this.$$Toast.fail('保存失败')
      }
    }
  },
  mounted () {
    this.$http.get('/userInfo/getUserInfo').then((res, err) => {
      const userInfo = forrmatFileUrl(res.data.data.userinfo)
      if (res.data.status === 'success') {
        this.editObj.date = userInfo.birthday
        this.editObj.sex = userInfo.sex
        this.editObj.name = userInfo.username
        this.editObj.intro = userInfo.info
        this.editObj.address = userInfo.place
        this.head_photo = userInfo.head_photo
        this.bgObj.photoList = userInfo.back_photo
      }
    })
  }
}
</script>

<style lang="less" scoped>
.head_photo {
    margin: 2rem auto;
    left: 50%;
    transform: translateX(-50%);
}
</style>