<template>
  <el-drawer :model-value="table.form.operate ? true : false" @close="table.form.operate = ''">
    <template #header>
      <h4>{{ table.form.operate == 'add' ? '新增' : '编辑' }}{{ type == '1' ? '图片' : '视频' }}</h4>
    </template>
    <template #default>
      <div>
        <el-form :model="form" ref="formRef" :rules="rules" label-width="auto" style="max-width:400px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="分类" v-if="type=='1'">
            <el-select
              v-model="form.category"
              placeholder="请选择"
            >
              <el-option
                v-for="item in categoryList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="序号">
            <el-input-number v-model="form.sort" :precision="0" :step="1" />
          </el-form-item>
          <el-form-item label="URL" v-if="type == '2'" prop="src">
            <el-input v-model="form.src" />
            <div class="tip" style="margin-top: 8px;">当前仅支持填写Youtube视频地址</div>
            <div class="tip">例：https://www.youtube.com/watch?v=2biqDdJCS90</div>
            
          </el-form-item>
          <el-form-item label="图片" v-if="type == '1'" prop="src">
            <el-upload class="avatar-uploader" action="/api/upload/image" :headers="{Authorization:token}" :show-file-list="false" name="image"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="form.src" :src="getResizedImage(form.src)" style="width: 100%;" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="form.status" :active-value="'1'" :inactive-value="'0'" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto;text-align: left;">
        <el-button type="primary" @click="handleSubmit(formRef)">确认</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { inject, ref, toRef, watchEffect , reactive} from 'vue';
import type { ZimaTable } from '@/types/table.t';
import type { Items } from './types.d'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import type { FormRules } from 'element-plus'
interface Props {
  type: string; // 1图片 2视频
}

const token = localStorage.getItem('token')

const table = inject("table") as ZimaTable<Items>
const handleSubmit = inject("handleSubmit") as any
const closeForm = inject("closeForm")

const form = toRef(table.form, 'items')
const formRef = ref()
const props = defineProps<Props>()
const rules = reactive<FormRules<Items>>({
  src: [
    { required: true, message: props.type == '1'?'请上传图片':'请填写视频地址', trigger: 'change' },
  ],
})

watchEffect(()=>{
  if(table.form.operate == 'add'){
    form.value.sort = table.data.length + 1
    form.value.type = props.type
  }
})

const categoryList = ['ZimaBoard','ZimaBlade','ZimaCube','Lifestyle','Application','Development']


const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
) => {
  form.value.src = "/api" + response.filePath
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不允许超过 5MB!')
    return false
  }
  return true
}

const getResizedImage = (src:string)=>{
  return src.replace('/images/','/images/resized_')
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
}
</style>