#### 小红书移动端开发

### bug1

聊天时本人发送的消息未存进 vueX (不实时更新)

### 需求一

视频模块 实现（完播率 如果播放时间大于一半就提交接口）

### 需求二

点赞视频分页实现 (删除评论后评论数量不一样 不同步)

<template>

  <!-- 可视区域 -->
  <div class="infinite-list-container"
       @scroll="scrollEvent($event)"
       ref="list">
    <div class="infinite-list-phantom"
         :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list"
         :style="{ transform: getTransform }">
      <div class="list_item"
           v-for="(item, index) in visiableListData"
           :key="index"
           :style="{height:propsData.itemSize+'px',lineHeight: propsData.itemSize + 'px'}">
        {{item}}
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      propsData: {
        listArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        itemSize: 200
      },
      // 可视区域的高度
      screenHeight: 0,
      // 开始的下标
      start: 0,
      // 结束的下标
      end: 0,
      // 偏移量
      startOffset: 0
    }
  },
  props: {
    listArr: {
      type: Array,
      default: []
    },
    itemSize: {
      type: Number,
      default: 200
    }
  },
  mounted () {
    this.screenHeight = this.$el.clientHeight
    this.start = 0
    this.end = this.start + this.visibleCount
  },
  computed: {
    // 列表的总高度
    listHeight () {
      return this.listArr.length * this.itemSize
    },
    // 可显示的item的数量
    visibleCount () {
      return Math.ceil(this.screenHeight / this.propsData.itemSize)
    },
    // 偏移量的样式
    getTransform () {
      return `translate3d(0,${this.startOffset}px,0)`
    },
    // 获取真实展示列表的数据
    visiableListData () {
      return this.listArr.slice(this.start, Math.min(this.end, this.listArr.length))
    }
  },
  methods: {
    scrollEvent () {
      // 当前的滚动位置
      const scrollTop = this.$refs.list.scrollTop
      // 此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize)
      // 此时的结束索引
      this.end = this.start + this.visibleCount
      // 此时的偏移量
      this.startOffset = scrollTop - (scrollTop % this.itemSize)
    }
  }
}
</script>

<style lang="less" scoped>
.infinite-list-container {
    height: 100%;
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}

.infinite-list {
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    text-align: center;
}

.infinite-list-item {
    padding: 10px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #999;
}
</style>

<template>
  <div>
    <van-field v-model="password"
               :type="passwordType"
               :label="label"
               @input="$emit('inputPassword',password)">
      <template #button>
        <van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o' "
                  @click="switchPasswordType()" />
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  data () {
    return {
      password: this.inputVal,
      passwordType: 'password',
      passwordIcon: 'closed-eye',
      label: this.label
    }
  },
  methods: {
    switchPasswordType () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    }
  },
  props: {
    inputVal: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '密码'
    }
  },
  model: {
    prop: 'inputVal',
    event: 'inputPassword'
  }
}
</script>

<style>
</style>
