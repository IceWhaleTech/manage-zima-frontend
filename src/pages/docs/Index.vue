<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left font20">
        Docs
      </div>
      <div class="right">
        <el-button type="primary" @click="handleAdd" icon="Plus"> 新增 </el-button>
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="table.data.length==0&&!table.loading"></el-empty>
      <el-table :data="table.data" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="creatTime" label="创建时间" width="180"/>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column prop="address" label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { computed, onMounted, provide } from 'vue';
// import { useRouter } from 'vue-router';
// import type { Items } from './types.d'
const {
  table,
  getTableData,
  confirmDelete,
} = useTable<any>({
  baseUrl:'/docs'
})
table.filter.type = 1

onMounted(() => {
  // getTableData()
  table.data = [{
    title:'这是标题1',
    creatTime:'2023-06-21',
    updateTime:'2023-06-21',
  },{
    title:'这是标题2',
    creatTime:'2023-06-21',
    updateTime:'2023-06-21',
  }]
})
const handleAdd = (item:any)=>{
  window.open('/#/docs/editor');
}
</script>
<style lang="scss" scoped>

</style>