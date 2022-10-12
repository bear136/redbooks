<template>
  <div>
    <van-nav-bar title="修改密码"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <div>
      <van-form @submit="onSubmit">
        <PasswordField v-model="passwordInfo.old_pwd"
                       label="旧密码"
                       :rules="[{ required: true, message: '请填写旧密码' }]"
                       label-align='left' />
        <PasswordField v-model="passwordInfo.new_pwd"
                       label="新密码"
                       :pattern='pattern'
                       rulesMessage='6-20位密码,至少含字母及数字' />
        <SendEmailCode v-model="email" />
        <van-field v-model="passwordInfo.code"
                   size="small"
                   label="验证码" />
        <div class="submitBtn">
          <van-button native-type="submit">确认修改</van-button>
        </div>
      </van-form>

    </div>

  </div>

</template>

<script>
import PasswordField from '../../components/editInfo/PasswordField.vue'
import SendEmailCode from '../../components/editInfo/SendEmailCode.vue'
export default {
  data () {
    return {
      passwordInfo: {
        old_pwd: '',
        new_pwd: '',
        code: ''
      },
      email: '',
      makeSureCode: '',
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/
    }
  },
  mounted () {},
  methods: {
    onClickLeft () {
      this.$router.push('/editaccount')
    },
    async onSubmit () {
      const { data: res } = await this.$http.put('/userInfo/updateUserPassword', this.passwordInfo)
      if (res.status === 'success') {
        this.$Toast.success('密码修改成功')
        this.onClickLeft()
      } else {
        this.$Toast.fail('验证码或旧密码错误')
      }
    }
  },
  components: {
    PasswordField,
    SendEmailCode
  }
}
</script>

<style lang="less" scoped>
.submitBtn {
    margin-top: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
