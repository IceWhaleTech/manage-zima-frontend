<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/docs' }">Docs</el-breadcrumb-item>
      <el-breadcrumb-item>{{ type == 'add'?'新增':'编辑' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px;">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane v-for="item in langList" :label="item.label + `(${item.value})`" :disabled="type==='add'&&item.value!=='en'" :name="item.value" lazy>
          <Editor :lang="item.value" :langLabel="item.label" :langList="langList"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch , ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import Editor from './Editor.vue'
const route = useRoute();
const type = ref('') 
type.value = route.query.type as string

watch(()=>route.query,()=>{
  type.value = route.query.type as string || 'add'
})
const activeName = ref('en')
const langList = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'jp' },
  { label: '西班牙语', value: 'es' },
  { label: '葡萄牙语-葡萄牙', value: 'pt-PT' },
  // { label: 'Français', value: 'fr' },
]

</script>