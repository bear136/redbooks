<template>
  <div class="userInfo">
    <!-- 背景图片 -->
    <img :src="info.back_photo"
         class="bgImg"
         alt="">
    <!-- 头像和名字 -->
    <div class=" perInfo">
      <img :src="info.head_photo"
           class="perfile"
           alt="">
      <div class="userName">{{info.username}}</div>
    </div>
    <!-- 个性签名 -->
    <div class="signature">
      <p>{{info.info}}</p>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      perInfo: null
    }
  },
  props: {
    info: {
      type: Object,
      require: false
    }
  },
  mounted () {},
  methods: {},
  computed: {}
}
</script>

<style lang='less' scoped>
.userInfo {
    height: 15rem;
    width: 100%;

    .bgImg {
        height: 100%;
        width: 100%;
    }
    .perInfo {
        width: 100%;
        position: absolute;
        top: 5px;
        // background-color: #f0f0f0;
        display: flex;
        align-items: center;
        height: 6rem;
        .perfile {
            height: 80px;
            width: 80px;
            border-radius: 50%;
            border: none;
            margin-left: 2rem;
        }
        .userName {
            font-size: 17px;
            height: 17px;
            text-align: center;
            margin-left: 10px;
            box-sizing: border-box;
            width: 7rem;
            color: #fff;
            // mix-blend-mode: difference;
            font-weight: 500;
        }
    }
    .signature {
        position: absolute;
        font-size: 14px;
        width: 100%;
        top: 6rem;
        padding: 14px 2rem;
        box-sizing: border-box;
        // mix-blend-mode: difference;
        color: #fff;
    }
}
</style>