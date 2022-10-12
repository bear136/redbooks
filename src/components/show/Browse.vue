<template>
  <div class="index"
       v-show="info">
    <div class="part"
         id="partBox"
         ref="partBox"
         @scroll='scrollFn'>
      <div class="scrollBox">
        <div class="show"
             v-for="(item,index) in info"
             :key="index">
          <img :src="defalute"
               v-lazy='coverImg(item)'
               @click="gotoDetial(item)"
               alt="简介图片">
          <p>{{item?(item.title ? item.title:''):''}}</p>
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
  </div>
</template>

<script>
import ShowInfoAction from '../toolAction/ShowInfoAction.vue'
export default {
  data () {
    return {
      defalute: require('../../assets/blueBg.png'),
      name: 'ShowPart'
    }
  },
  mounted () {
    if (this.isAll) {
      window.removeEventListener('scroll', this.scrollFn)
    }
  },
  computed: {
    scrollFn () {
      return this.throttle(this.listenBottomOut)
    },
    coverImg () {
      return item => {
        if (!item) {
          return ''
        }
        if (item.is_video === 1) {
          return item.cover_url ? item.cover_url : this.defalute
        } else {
          // eslint-disable-next-line camelcase
          const resource_url = item.resource_url ? item.resource_url[0] : this.defalute
          // eslint-disable-next-line camelcase
          return item.cover_url ? item.cover_url : resource_url
        }
      }
    }
  },
  components: {
    ShowInfoAction
  },
  props: ['info', 'isAll'],
  methods: {
    gotoDetial (item) {
      if (item.is_video === 0) {
        this.$router.push({ name: 'Detial', query: { messageId: item.article_id } })
      } else {
        this.$router.push({ name: 'video', query: { messageId: item.article_id } })
      }
    },
    listenBottomOut () {
      this.$nextTick(() => {
        const partBox = document.getElementById('partBox')
        const scrollBox = document.getElementsByClassName('scrollBox')[0]
        const scrollTop = partBox.scrollTop || document.body.scrollTop
        const clientHeight = partBox.clientHeight
        const scrollHeight = scrollBox.scrollHeight
        if (scrollTop + clientHeight >= scrollHeight) {
          if (!this.isAll) {
            this.$bus.$emit('getAllarticle')
          } else {
            window.removeEventListener('scroll', this.scrollFn)
          }
        }
      })
    },
    throttle (fn, wait = 500) {
      let previous = 0
      return (...args) => {
        const now = new Date().getTime()
        if (now - previous > wait) {
          previous = now
          fn.apply(this, args)
        }
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style lang="less" scoped>
.index {
  .part {
    width: 100%;
    padding: 3px;
    box-sizing: border-box;
    height: 90vh;
    overflow-y: auto;
    margin-bottom: 50px;

    // background-color: #f0f0f0;
    .scrollBox {
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
          width: 100%;
          height: 100%;
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
}
</style>
