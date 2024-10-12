<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left font20" style="margin-bottom: 20px;">
        Share AD
      </div>
    </div>

    <el-form :model="form" ref="formRef" :rules="rules" label-width="auto" style="max-width:50vw;min-width: 700px;">
      <el-form-item label="链接：" prop="link">
        <el-input v-if="mode==='editing'" v-model="form.link" />
        <span v-else>{{ form.link }}</span>
      </el-form-item>
      <el-form-item label="图片：" prop="image">
        <el-row :gutter="20" v-loading="uploading">
          <el-col :span="12">
            <h3>PC端 建议尺寸：720 * 720</h3>
            <el-upload class="avatar-uploader" :disabled="mode==='static'" action="/api/upload/batchImages" :data="{path:'/share'}" :headers="{Authorization:token}" :show-file-list="false" name="file"
              :on-success="(res:any)=>handleSuccess(res,'image')" :before-upload="beforeUpload">
              <img v-if="form.image" :src="form.image" style="width: 100%;" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <h3>手机端 建议尺寸：680 * 268</h3>
            <el-upload class="avatar-uploader" :disabled="mode==='static'" action="/api/upload/batchImages" :data="{path:'/share'}" :headers="{Authorization:token}" :show-file-list="false" name="file"
              :on-success="(res:any)=>handleSuccess(res,'image_m')" :before-upload="beforeUpload">
              <img v-if="form.image_m" :src="form.image_m" style="width: 100%;" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <div class="table-wrapper" v-loading="loading">
      <div class="flex" style="margin-top: 24px;">
        <el-button v-if="mode=='editing'" type="primary" @click="handleSave">保存</el-button>
        <el-button v-if="mode=='editing'" @click="handleCancel">取消</el-button>
        <el-button v-if="mode=='static'" @click="mode='editing'">修改</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref , reactive, onMounted} from 'vue';
import type { UploadProps } from 'element-plus'
import * as imageConversion from 'image-conversion';
// import { useRouter } from 'vue-router';
import request from '@/api/index.js';
import { ElMessage } from 'element-plus';
import type { FormRules } from 'element-plus'
interface Items {
  link: string;
  image: string;
  image_m: string;
}

const token = localStorage.getItem('token')
const loading = ref(false)
const mode = ref('static')
const form = reactive<Items>({
  link: '',
  image: '',
  image_m: '',
})

const rules = reactive<FormRules<Items>>({
  link: [
    { required: true, message: '请填写链接', trigger: 'change' },
  ],
  image: [
    { required: true, message: '请上传图片', trigger: 'change' },
  ],
  image_m: [
    { required: true, message: '请上传图片', trigger: 'change' },
  ],
})

onMounted(()=>{
  getData()
})
const getData = ()=>{
  loading.value = true
  request.get('/share/data').then((res:any)=>{
    form.link = res.data.link
    form.image = res.data.image
    form.image_m = res.data.image_m
    loading.value = false
  }).catch((err:any) => {
    ElMessage.error(err.message)
    loading.value = false
  });
}


const handleCancel = ()=>{
  mode.value = 'static'
  getData()
}

const handleSave = ()=>{
  request.post('/share/save',form).then((res:any)=>{
    ElMessage.success('保存成功！')
    mode.value = 'static';
  }).catch((err:any) => {
    ElMessage.error(err.message)
  });
}

const uploading = ref(false)
const handleSuccess = (
  response:any,formKey:string
) => {
  uploading.value = false;
  
  (form as any)[formKey] = "/api" + response.data[0].filePath
}

const beforeUpload: UploadProps['beforeUpload'] = async (file: any) => {
  uploading.value = true;
  try {
    // 调用 image-conversion 库进行图片压缩
    const compressedFile = await imageConversion.compressAccurately(file, {
      size: 1000, // 目标压缩大小，单位 KB
    });
    // 继续上传处理
    return compressedFile;
  } catch (error) {
    uploading.value = false;
    console.error('图片压缩失败', error);
    return false;
  }
}


</script>
<style lang="scss" scoped>
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  &:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
.tip{
  font-size: 12px;
  color: #999;
  line-height: 16px;
}</style>