<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading"
                      style="min-height: 100vh;"
                      @refresh="
                      onRefresh">
      <PersonInfo />
      <PersonWork />
    </van-pull-refresh>

  </div>
</template>

<script>
import PersonInfo from '../components/person/PersonInfo.vue'
import PersonWork from '../components/person/PersonWork.vue'
export default {
  data () {
    return {
      isLoading: false
    }
  },
  components: {
    PersonInfo,
    PersonWork
  },
  methods: {
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    }
  }
}
</script>

<style>
</style>