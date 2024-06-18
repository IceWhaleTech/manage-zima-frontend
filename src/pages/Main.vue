<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-container>
        <el-aside>
          <Aside />
        </el-aside>
        <el-main>
          <RouterView class="main-wrapper" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import Header from "../components/Header.vue"
import Aside from "../components/Aside.vue"
</script>
<style lang="scss" scoped>
.el-header {
  border-bottom: 1px solid #eee;
}
.el-aside {
  height: calc(100vh - 60px);
  border-right: 1px solid #eee;
  max-width: 200px;
}
.el-main{
  height: calc(100vh - 60px);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgb(244,244,244);
  .main-wrapper{
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;
    min-height: 70vh;
  }
}
</style>
