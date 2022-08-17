<template>
  <div class="index">
    <div class="part"
         ref="partBox">
      <div class="show"
           v-for="(item) in info"
           :key="item.article_id">
        <img :src="defalute"
             v-lazy='item.cover_url||item.resource_url[0]'
             @click="gotoDetial(item)"
             alt="简介图片">
        <p>{{item.title}}</p>
        <div class="authorInfo">
          <van-image height='20'
                     width="20"
                     radius="50%"
                     :src="item.author_info.head_photo"
                     fit="fill" />
          <span class="authname">{{item.author_info.username}}</span>
          <ShowInfoAction v-bind:msgItem="item"
                          v-bind:likeCount="item.give_like_count" />
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import ShowInfoAction from '../toolAction/ShowInfoAction.vue'
export default {
  data () {
    return {
      defalute: '',
      name: 'ShowPart'
    }
  },
  mounted () {
    this.defalute = require('../../assets/blueBg.png')
    
  },
  components: {
    ShowInfoAction
  },
  props: {
    info: Array
  },
  methods: {
    gotoDetial (item) {
      if (item.is_video === 0) {
        this.$router.push({ name: 'Detial', query: { messageId: item.article_id } })
      } else {
        this.$router.push({ name: 'video', query: { messageId: item.article_id } })
      }
    },
    async takeLike (item) {
      this.$emit('changeLike', item)
    },
  }
}
</script>

<style lang="less" scoped>
.index {
    .part {
        width: 100%;
        padding: 3px;
        box-sizing: border-box;
        min-height: 90vh;
        margin-bottom: 50px;
        background-color: #f0f0f0;
        column-count: 2;
        column-gap: 10px;
        .show {
            break-inside: avoid;
            background-color: #fff;
            border-radius: 10px;
            padding: 5px;
            box-sizing: border-box;
            margin-bottom: 10px;
            .van-image {
                z-index: 0;
            }
            img {
                max-width: 100%;
                width: auto;
                height: auto;
                max-height: 210px;
                box-sizing: border-box;
                border-radius: 10px;
            }
            p {
                max-height: 50px;
                margin-top: 8px;
                width: 100%;
                padding-left: 5px;
                padding-right: 5px;
                box-sizing: border-box;
                font-size: 14px;
                //多行文本打省略号
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .authorInfo {
                margin-top: 5px;
                height: 22px;
                width: 100%;
                display: flex;

                align-items: center;
                justify-content: space-around;
                /deep/ span {
                    font-size: 12px;
                    margin-left: 5px;
                }
                .authname {
                    display: inline-block;
                    height: 20px;
                    line-height: 20px;
                    width: 85px;
                    text-align: center;
                }
            }
        }
    }
}
</style>