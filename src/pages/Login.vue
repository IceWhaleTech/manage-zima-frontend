<template>
  <div class="container">
    <div class="login">
      <h1>Login</h1>
      <form >
        <div class="form-group">
          <label for="account">账号</label>
          <el-input type="text" class="form-control" id="account" v-model="userInfo.account" />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <el-input type="password" class="form-control" id="password" v-model="userInfo.password" />
        </div>
        <el-button type="primary" class="btn btn-primary" style="width: 100%;" @click="doLogin">登录</el-button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive } from "vue"
import request from "@/api";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
// import bcrypt from "bcryptjs"
const userInfo = reactive({
  account:'',
  password:''
})
// admin-icewhale    icewhale2024
const router = useRouter()
const doLogin = ()=>{
  // const salt = bcrypt.genSaltSync(10);
  if(userInfo.account + userInfo.password == ''){
    ElMessage.error("请输入账号和密码！")
    return
  }
  request.post('/auth/login',{
    account:userInfo.account,
    password: userInfo.password,
  }).then((res:any)=>{
    localStorage.setItem('token',res.token)
    router.push('/')
  })
}
</script>
<style lang="scss" scoped>
.login{
  width: 300px;
  border: 1px solid #ccc;
  margin: 100px auto;
  padding: 24px;
  border-radius: 8px;
  h1{
    font-size: 32px;
    line-height: 60px;
  }
  .form-group{
    margin-bottom: 12px;
  }
}
</style>