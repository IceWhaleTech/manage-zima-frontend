<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/docs' }">Docs</el-breadcrumb-item>
      <el-breadcrumb-item>{{ type == 'add'?'新增':'编辑' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="wrapper">
      <el-form :model="form" label-width="auto" ref="ruleFormRef" :rules="rules" style="max-width: 600px">
        <el-form-item label="目录标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-cascader
            v-model="form.category"
            :options="categoryList"
            :props="{expandTrigger: 'hover'}"
            style="width:100%"
          />
        </el-form-item>
      </el-form>
      <div v-loading="state.contentLoading">
        <MdEditor v-model="form.content" @onUploadImg="onUploadImg" />
      </div>
      <el-button type="primary" :disabled="state.saveLoading" style="margin-top: 24px;" @click="handleSave(ruleFormRef)">
        <el-icon v-if="state.saveLoading" class="is-loading">
          <Loading />
        </el-icon>
        <span v-else>
          {{ type == 'add' ? '发布' : '保存' }}
        </span>
      </el-button>
      <p class="tip" style="margin-top: 10px;">旧有文章中的图片暂不支持预览，不影响正常功能！</p>
      <p class="tip" style="margin-top: 10px;">文章保存后需要约5min的编译时间，请在编译完成后查看！</p>
      <p class="tip" style="margin-top: 10px;">因编译需要时间，请勿频繁提交保存！</p>
    </div>
    <div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref , reactive , onMounted} from "vue";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute, useRouter } from "vue-router";
import request from '@/api/index.js';
import { ElMessage } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';
import * as imageConversion from 'image-conversion';
import type { FormInstance } from 'element-plus'
const state = reactive({
  contentLoading:false,
  saveLoading:false,
})
const form = reactive({
  title:'',
  title_origin:'',
  fileKey:'',
  category:[],
  category_origin:[],
  content:'',
  sha:undefined,
  fileName:'',
})
const ruleFormRef = ref<FormInstance>()
const rules = {
  title: [{required:true,message:'请输入标题',trigger:'blur'}],
  category: [{required:true,message:'请选择分类',trigger:'change'}]
}

const categoryList = JSON.parse(localStorage.getItem('docs_category')||'')

const route = useRoute();
const type = route.query.type;
if (type == 'add') {
  form.content = `---
title: 文章标题
type: “Docs”
tip: 顶部栏固定格式请勿删除
---
# 段落标题`;
}else{
  form.title = route.query.title as string
  form.title_origin = route.query.title as string
  let category = route.query.categoryKey as any
  form.category = category.split(',')
  form.category_origin = category.split(',')
  form.fileKey = route.query.fileKey as string
  form.fileName = route.query.fileName as string
}
onMounted(()=>{
  if(type == 'edit') getFile(route.query.fileName+'.md')
  
  // window.addEventListener('paste', (e:any)=>{
  //   const clipboardData = e.clipboardData;
  //   const items = clipboardData.items;
  //   console.log(clipboardData.getData('text/html'))
  //   return 
  //   let blob;
  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i].type.startsWith('image/')) {
  //       blob = items[i].getAsFile();
  //       break;
  //     }
  //   }
  //   if (blob) {
  //     const reader = new FileReader();
  //     reader.onload = (e:any) => {
  //       const img = new Image();
  //       img.src = e.target.result as string;
  //       img.onload = () => {
  //         imageConversion.convert(img, {
  //           maxWidth: 1000,
  //           maxHeight: 600,
  //           quality: 0.9,
  //           outputFormat: 'jpeg',
  //         }).then((buffer: any) => {
  //           const file = new File([buffer], 'image.jpg', { type: 'image/jpeg' });
  //         })
  //       }
  //     }
  //   }
  // })
})

const getFile = (fileName:string)=>{
  state.contentLoading = true
  request.get(`/docs/doc/${fileName}?path=${form.category[0]}`).then(res=>{
    form.content = res.data.content
    form.sha = res.data.sha
  }).finally(()=>{
    state.contentLoading = false
  })
}

const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      confirmSave()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const router = useRouter()

const confirmSave = () => {
  state.saveLoading = true
  if(type == 'add'){
    form.fileName = form.title.replace(/\s/g,'-')
    form.fileKey = form.fileName.toLowerCase()
  }
  request.post('/docs/save',{
    type,
    ...form
  }).then(()=>{
    window.setTimeout(()=>{
      ElMessage.success('保存成功！')
      router.push('/docs')
    },2000)
  }).catch((err:any) => {
    ElMessage.error(err.message)
  }).finally(()=>{
    state.saveLoading = false
  })
}

const onUploadImg = async (files:any, callback:(urlList:any)=>void) => {
  // 对文件先进行压缩
  const size = 400
  let blobList = await Promise.all(
    files.map((file:any)=>imageConversion.compressAccurately(file,size))
  )
  const formdata = new FormData()
  formdata.append('path','/docs')
  blobList.map((blob:any,index:number)=>{
    let file = new File([blob],files[index].name,{ type: files[index].type})
    console.log(file)
    formdata.append('file', file)
  })
  // 上传图片
  let {data} = await request.post('/upload/batchImages',formdata)
  let path = window.location.origin + '/api'
  callback(data.map((item:any) =>path + item.filePath));
}

</script>
<style lang="scss" scoped>
.container {
  background: rgb(244, 244, 244);
  min-height: 100vh;
  padding-top: 50px;

  .wrapper {
    max-width: 1600px;
    margin: auto;
    padding: 40px 24px;
    background-color: #fff;
  }
  .tip{
    color: #999;
    font-size: 12px;

  }
}
</style>