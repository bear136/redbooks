<template>
  <div class="login">
    <van-form colon
              @submit="login"
              :show-error-message='false'
              label-align='center'
              ref="loginFormRef">
      <img src="../assets/1.jpeg"
           alt=""
           class="profile">
      <van-field v-model="loginInfo.account"
                 label="账号"
                 placeholder="手机号/邮箱"
                 :rules="[{ required: true,message: '请填写账号' },{ validator:getProfile}]" />
      <van-field v-model="loginInfo.password"
                 type="password"
                 label="密码"
                 placeholder="请输入密码"
                 :rules="[{ required: true,message: '请填写密码' }, { validator:checkPassword}]" />
      <div>
        <van-button round
                    block
                    class="submit"
                    type="info"
                    native-type="submit">登录</van-button>

      </div>
      <div class="skip">
        <p class="text">Don't have a account ?</p>
        <p class="register"
           @click="register">sign up now</p>
      </div>
    </van-form>
  </div>
</template>

<script>

import qs from 'qs'
export default {
  data () {
    return {
      loginInfo: {
        account: '',
        password: ''
      },
      profile: '../assets/1.jpeg'
    }
  },
  methods: {
    // 获取头像请求
    async getProfile (val) {
      // const { data: result } = await this.$http.get('/check', { params: { account: val } })
    },
    checkPassword (val) {
      const phoneReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/
      if (!phoneReg.test(val)) this.$Toast('密码应含有数字和字母,且长度在6-10位')
    },
    async login () {
      // 发送请求
      const { data: res } = await this.$http.post('/login', qs.stringify(this.loginInfo))
      if (res.status === 'success') {
        this.$Toast.success('登录成功')
        localStorage.setItem('redBooksToken', res.token)
        this.$router.push('/home')
      } else {
        this.$Toast('密码或者用户名错误，请重写')
      }
    },
    register () {
      // 实现跳转到注册页面
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="less" scoped>
.login {
    height: 100%;
    width: 100%;

    .van-form {
        background-color: #fff;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 18rem;
        height: 30rem;
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .profile {
            height: 6rem;
            width: 6rem;
            margin-top: 2rem;
            text-align: center;
            border-radius: 50%;
        }
        .van-cell {
            width: 15rem;
            margin-top: 20px;
            border-radius: 20px;
            padding: 10px 10px;
            border: 1px solid #ccc;
            .van-cell span {
                text-align: center !important;
            }
        }

        .submit {
            margin-top: 2rem;
            width: 8rem;
            margin-bottom: 0rem;
        }
        .van-row {
            width: 15rem;
        }
        .skip {
            margin-bottom: 1rem;
        }
        p {
            display: block;
            font-size: 14px;
            text-align: center;
        }
        .text {
            margin-top: 2rem;
            margin-bottom: 0rem;
        }
        .register {
            color: rgb(0, 162, 255);
            margin-top: 0.2rem;
            cursor: pointer;
        }
    }
}
</style>
