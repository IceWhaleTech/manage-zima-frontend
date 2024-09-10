<template>
<header>
  <h1>ZimaSpace 运营管理平台</h1>
  <div>
    
    <el-dropdown v-if="user&&user.account">
      <span class="el-dropdown-link">
        Hi, {{ user.name }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <div @click="doLogout">退出</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <p class="to-login" v-else>请
      <el-link href="/#/login">登录</el-link>
    </p>
  </div>
</header>
</template>
<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
const user = JSON.parse(localStorage.getItem('user')||'{}')

const doLogout = ()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  location.href = '/#/login'
}

</script>
<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
h1 {
  font-size: 24px;
  line-height: 30px;
}
.to-login {
  display: flex;
  align-items: center;
}
</style>