<template>
  <div class="container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/docs' }">Docs</el-breadcrumb-item>
      <el-breadcrumb-item>{{ type == 'add'?'新增':'编辑' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px;">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane v-for="item in langList" :label="item.label" :name="item.value" lazy>
          <Editor :lang="item.value" :langLabel="item.label" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import Editor from './Editor.vue'
const type = computed(()=>{
  return useRoute().query.type as string
})
const activeName = ref('en')
const langList = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'jp' },
  // { label: 'Français', value: 'fr' },
]

</script>