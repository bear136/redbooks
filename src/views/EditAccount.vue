<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!--不需要缓存的keep-alive 配置 展示内容-->
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {}
</script>
