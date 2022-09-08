<template>
  <div>
    <van-nav-bar title="修改手机号"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <van-form @submit="onSubmit">
      <van-field v-model="userAccountInfo.account"
                 label="新手机号"
                 placeholder="请输入手机号"
                 :rules="[{ pattern, message: '请填写正确的手机号' }]" />
      <SendEmailCode v-model="userAccountInfo.email" />
      <van-field v-model="userAccountInfo.code"
                 label="验证码"
                 placeholder="请输入验证码"
                 :rules="[{ required: true, message: '验证码' }]" />
      <div :style="{marginTop:'50px',display:'flex',alignItems:'center',justifyContent:'center'}">
        <van-button>确定修改</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import SendEmailCode from '../../components/editInfo/SendEmailCode.vue'
export default {
  data () {
    return {
      userAccountInfo: {
        account_type: 'number',
        account: '',
        email: '',
        code: ''
      },
      pattern: /^1[3|4|5|7|8][0-9]{9}$/
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/editaccount')
    },
    async onSubmit () {
      const { data: res } = await this.$http.put('/userInfo/updateUserAccount', this.userAccountInfo)
      if (res.status === 'success') {
        this.$Toast.success('修改成功')
        this.onClickLeft()
      } else {
        this.$Toast.fail('修改失败，请检查输入是否有误')
      }
    }
  },
  components: {
    SendEmailCode
  }
}
</script>

<style>
</style>