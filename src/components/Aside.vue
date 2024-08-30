<template>
<div class="aside">
  <el-menu
        :default-active="defaultActive"
        router
        :collapse="isCollapse"
        class="el-menu-vertical-demo"
      >
        <el-menu-item index="/home">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/event">
          <span>Event</span>
        </el-menu-item>
        <el-menu-item index="/docs">
          <span>Docs</span>
        </el-menu-item>
        <el-menu-item index="/search">
          <span>Search</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <!-- <el-icon><location /></el-icon> -->
            <span>Gallery</span>
          </template>
          <el-menu-item index="/gallery/images">图片管理</el-menu-item>
          <el-menu-item index="/gallery/videos">视频管理</el-menu-item>
        </el-sub-menu>
       
      </el-menu>
</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
const isCollapse = ref(false)

const defaultActive = ref('/home')
const route = useRoute()
defaultActive.value = route.path

</script>
<style lang="scss" scoped>
.el-menu{
  border: none;
}
</style>