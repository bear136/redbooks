<template>
  <div>
    <van-nav-bar title="修改邮箱"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <van-form @submit="onSubmit">
      <SendEmailCode v-model="userAccountInfo.account" />
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
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      userAccountInfo: {
        account_type: 'email',
        account: '',
        email: '',
        code: ''
      }
    }
  },
  components: {
    SendEmailCode
  },
  computed: {
    ...mapGetters(['getInfo'])
  },
  methods: {
    onClickLeft () {
      this.$router.push('/editaccount')
    },
    async onSubmit () {
      this.userAccountInfo.email = this.getInfo.mail
      const { data: res } = await this.$http.put('/userInfo/updateUserAccount', this.userAccountInfo)
      if (res.status === 'success') {
        this.$Toast.success('修改成功')
        this.onClickLeft()
      } else {
        this.$Toast.fail('修改失败，请检查输入是否有误')
      }
    }
  }
}
</script>

<style>
</style>