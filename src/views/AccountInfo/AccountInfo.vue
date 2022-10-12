<template>
  <div class="accountBox">
    <van-nav-bar title="账号与安全"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <div class="accountInfo">
      <van-cell-group inset>
        <van-cell title="手机号"
                  @click="changeTel()"
                  is-link
                  icon="bag-o"
                  :value="telPhone" />
        <van-cell title="邮箱"
                  is-link
                  icon="bag-o"
                  @click="changeMail()"
                  :value="email" />
        <van-cell title="密码"
                  is-link
                  icon="bag-o"
                  @click="changePassWorld()"
                  value="修改密码" />
      </van-cell-group>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      accountInfo: {
        tel: '',
        mail: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getInfo']),
    telPhone () {
      const tel = this.accountInfo.tel
      return tel.substring(0, 3) + '****' + tel.substring(7, 12)
    },
    // eslint-disable-next-line vue/return-in-computed-property
    email () {
      const mail = this.accountInfo.mail
      if (mail !== '') {
        const index = mail.indexOf('@')
        return mail.substring(0, 1) + '*'.repeat(index - 1) + mail.substring(index, mail.length)
      }
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/user')
    },
    changeTel () {
      this.$dialog
        .confirm({
          message: '您确定要修已绑定的手机号吗'
        })
        .then(() => {
          this.$router.push({
            name: 'changePhone'
          })
        })
        .catch(() => {})
    },
    changeMail () {
      this.$dialog
        .confirm({
          message: '您确定要修已绑定的邮箱吗'
        })
        .then(() => {
          this.$router.push({
            name: 'sendMail'
          })
        })
        .catch(() => {})
    },
    changePassWorld () {
      this.$dialog
        .confirm({
          message: '您确定要修密码吗'
        })
        .then(() => {
          this.$router.push({
            name: 'changePassword'
          })
        })
        .catch(() => {})
    }
  },
  mounted () {
    this.accountInfo = { ...this.getInfo }
  }
}
</script>

<style lang="less" scoped>
.accountBox {
    min-height: 100vh;

    .accountInfo {
        box-sizing: border-box;
        margin-top: 20px;
    }
}
</style>
