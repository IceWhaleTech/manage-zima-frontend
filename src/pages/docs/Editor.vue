<template>
  <div class="container">
    <div class="wrapper">
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            v-model="form.category"
            :options="categoryList"
            :props="{expandTrigger: 'hover'}"
            style="width:100%"
          />
        </el-form-item>
      </el-form>
      <MdEditor v-model="form.content" />
      <el-button type="primary" style="margin-top: 24px;" @click="handleSave">{{ type == 'add' ? '发布' : '保存' }}</el-button>
    </div>
    <div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive} from "vue";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute } from "vue-router";
import request from '@/api/index.js';
import { ElMessage } from 'element-plus';
const form = reactive({
  title:'',
  category:[],
  content:''
})
const categoryList = JSON.parse(localStorage.getItem('docs_category')||'')

const route = useRoute();
const type = route.query.type;
if (type == 'add') {
  form.content = '# 标题';
}


const handleSave = () => {
  request.post('/docs/save',form).then(()=>{
    ElMessage.success('保存成功！')
  }).catch((err:any) => {
    ElMessage.error(err.message)
  });
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
}
</style>