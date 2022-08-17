<template>
  <div>
    <div class="likedAction">
      <van-icon :name="likedName"
                size="20px"
                :color="likedcolor" />
      <span>{{item.give_like_count}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      likedName: 'like-o',
      likedcolor: 'red'
    }
  },
  methods: {
    
  }
}
</script>

<style lang='less' scoped>
.likedAction {
    height: 30px;
    line-height: 30px;
    span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin-left: 5px;
        color: #767676;
    }
}
</style>