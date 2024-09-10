<template>
  <div class="container">
    <div class="login">
      <h1>Login</h1>
      <form >
        <div class="form-group">
          <label for="account">账号</label>
          <el-input type="text" class="form-control" id="account" v-model="userInfo.account" />
        </div>
        <div class="form-group" v-if="currentType=='register'">
          <label for="password">昵称</label>
          <el-input type="text" class="form-control" id="name" v-model="userInfo.name" />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <el-input type="password" class="form-control" id="password" v-model="userInfo.password" />
        </div>
        <el-button v-if="currentType=='login'" type="primary" class="btn btn-primary" style="width: 100%;" @click="doLogin">登录</el-button>
        <el-button v-else type="primary" class="btn btn-primary" style="width: 100%;" @click="doRegister">注册</el-button>
        <div class="tip-box">
          <p v-if="currentType=='login'">没有账号？请<el-link @click="currentType='register'">注册</el-link></p>
          <p v-else>已有账号？请<el-link @click="currentType='login'">登录</el-link></p>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive , ref} from "vue"
import request from "@/api";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
// import bcrypt from "bcryptjs"

const currentType = ref('login')

const userInfo = reactive({
  account:'',
  name:"",
  password:''
})

if(process.env.NODE_ENV == 'development'){
  userInfo.account = 'admin-icewhale'
  userInfo.password = 'icewhale2024'
}
// admin-icewhale    icewhale2024
// hannaixi@icewhale.org han6748
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
    localStorage.setItem('user',JSON.stringify(res.results))
    router.push('/')
  })
}

const doRegister = ()=>{
  if(!userInfo.account || !userInfo.password || !userInfo.name){
    ElMessage.error("请输入账号、密码和昵称！")
    return
  }
  if(!checkPassword(userInfo.password)){
    ElMessage.error("密码至少包含一个字母和一个数字，且长度不小于6位！")
    return
  }
  if(userInfo.account.indexOf("@icewhale.org")<0){
    ElMessage.error("请使用内部邮箱注册！")
    return
  }
  request.post('/auth/register',{
    account:userInfo.account,
    password: userInfo.password,
    name: userInfo.name
  }).then((res:any)=>{
    ElMessage.success('注册成功！')
    currentType.value = 'login'
    userInfo.password = ''
    userInfo.name = ''
  })
}

const checkPassword = (psd:string)=>{
  let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  return reg.test(psd)
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
    label{
      color: #666;
    }
  }
  .tip-box{
    margin-top: 12px;
    color: #666;
    p{
      display: flex;
      justify-content: right;
    }
  }
}
</style>