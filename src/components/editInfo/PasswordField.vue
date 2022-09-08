<template>
  <!--带密码可见功能的密码输入框-->
  <van-field class="field"
             v-model="password"
             :type="passwordType"
             :label=label
             validate-trigger='onSubmit'
             :required="required"
             :show-error-message='false'
             :rules="[{required: rulesRequired, message: placeholder},{ pattern,message: rulesMessage}]"
             @input="$emit('input',password)">
    <template #button>
      <van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o' "
                @click="switchPasswordType()" />
    </template>
  </van-field>
</template>

<script>
export default {
  name: 'PasswordField',
  model: {
    prop: 'inputValue',
    event: 'input'
  },
  props: {
    /**
     * 当前输入的值
     */
    inputValue: {
      type: String,
      default: ''
    },
    /**
     * 输入框左侧文本
     */
    label: {
      type: String,
      default: '密码'
    },
    /**
     * 占位提示文字
     */
    placeholder: {
      type: String,
      default: '请输入密码'
    },
    /**
     * 是否显示表单必填星号
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * 校验提示文案
     */
    rulesMessage: {
      type: String,
      default: '请输入正确的密码'
    },
    /**
     * 校验规则：是否为必须字段
     */
    rulesRequired: {
      type: Boolean,
      default: true
    },
    pattern: {
      type: RegExp,
      default: () => {}
    }
  },
  data () {
    return {
      password: this.inputValue,
      passwordType: 'password'
    }
  },
  methods: {
    /**
     * 密码是否可见
     */
    switchPasswordType () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    }
  }
}
</script>

