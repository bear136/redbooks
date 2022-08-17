<template>
  <div class="register">
    <van-form colon
              :show-error-message='false'
              label-align='center'
              ref="regForm">
      <van-field v-model="regInfo.number"
                 name="手机号"
                 label="手机号"
                 placeholder="手机号"
                 :rules="[{ required: true, message: '请填写手机号' },{pattern:patternPhone,message: '请输入正确的手机号'}]" />
      <van-field v-model="regInfo.email"
                 name="邮箱"
                 label="邮箱"
                 placeholder="邮箱"
                 :rules="[{ required: true, message: '邮箱' },{pattern:patternMail,message: '请输入正确的邮箱'}]" />
      <van-field v-model="regInfo.password"
                 type="password"
                 name="密码"
                 label="密码"
                 placeholder="密码"
                 :rules="[{ required: true, message: '请填写密码' },{ validator:checkPassword}]" />
      <van-field v-model="confirmPassword"
                 type="password"
                 name="确认密码"
                 label="确认密码"
                 placeholder="确认密码"
                 :rules="[{ required: true, message: '请再次填写密码' },{ validator:cheakConfirmPassword}]" />
      <div class="mailCode">
        <van-field v-model="regInfo.code"
                   name="邮箱验证码"
                   placeholder="邮箱验证码"
                   :rules="[{ required: true, message: '请输入邮箱验证码' }]" />
        <van-button v-show="show"
                    class="getCode"
                    native-type="button"
                    @click="getCode"
                    round>获取验证码</van-button>
        <van-button v-show="!show"
                    class="getCode"
                    native-type="button"
                    round>{{count}}</van-button>
      </div>
      <div style="margin: 16px;">
        <van-button round
                    block
                    type="info"
                    @click="regester"
                    native-type="submit">注册</van-button>
      </div>
      <div class="skip">
        <p class="text">Have a account ?</p>
        <p class="login"
           @click="login">login up now</p>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      regInfo: {
        number: '',
        email: '',
        password: '',
        code: ''
      },
      confirmPassword: '',
      show: true,
      count: '',
      timer: null,
      // 手机号正则
      patternPhone: /^1[3|4|5|7|8][0-9]{9}$/,
      // 邮箱正则
      patternMail: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    }
  },
  methods: {
    // 密码格式
    checkPassword (val) {
      const phoneReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/
      if (!phoneReg.test(val)) {
        this.$Toast('密码应含有数字和字母,且长度在6-10位')
        return false
      }
      return true
    },
    // 判断两次密码是否一样
    cheakConfirmPassword (val) {
      if (val === this.regInfo.password) {
        return true
      } else {
        this.$Toast.fail('两次密码不一致')
        return false
      }
    },
    async getCode () {
      const TIME_COUNT = 60
      if (!this.timer) {
        // 发送获取邮箱验证码的请求

        const { data: result } = await this.$http.get('/sendCode', {
          params: {
            email: this.regInfo.email
          }
        })
        if (result.status !== 'success') {
          this.$Toast.fail('验证码发送失败')
          return
        }
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 注册请求
    regester () {
      this.$refs.regForm
        .validate()
        .then(async () => {
          const { data: res } = await this.$http.post('/register', JSON.stringify(this.regInfo))
          if (res.status === 'success') {
            this.$Toast.success('注册成功')
            this.$router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 返回登录页面
    login () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.register {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 30rem;
    width: 18rem;
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 13px;
    .van-form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .skip {
            margin-top: 1rem;
        }
        p {
            display: block;
            font-size: 14px;
            text-align: center;
        }
        .login {
            color: rgb(0, 162, 255);
            margin-top: 0.2rem;
            cursor: pointer;
        }
    }
    .van-cell {
        width: 15rem;
        margin-top: 10px;
        border-radius: 10px;
        padding: 10px 10px;
        border: 1px solid #ccc;
    }

    .mailCode {
        display: flex;
        align-items: center;
        margin-top: 10px;
        justify-content: space-around;
        .van-cell {
            width: 8rem;
            margin-top: 0;
        }
        .sendCode {
            height: 5rem !important;
            font-size: 14px;
        }
    }
}
</style>