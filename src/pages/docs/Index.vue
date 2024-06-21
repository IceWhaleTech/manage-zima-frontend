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
      <el-empty v-if="table.data.length == 0 && !table.loading"></el-empty>
      <el-table :data="table.data.slice((table.filter.pageNo-1)*10,(table.filter.pageNo)*10)" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="分类" width="300" :formatter="(row:Item)=>row.category.join(' / ')" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(scope.row)">编辑</el-button>
            <!-- <el-button type="danger" size="small" @click="confirmDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="flex" style="justify-content: flex-end;margin-top: 24px;">
        <el-pagination background layout="total,prev, pager, next" :total="table.total" @change="pageChange"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import type { Items } from './types.d'
const {
  table,
  getTableData,
  confirmDelete,
} = useTable<any>({
  baseUrl: '/docs'
})
table.filter.type = 1

onMounted(() => {
  getTableData((data) => {
    table.data = data.list
    table.total = data.list.length
    localStorage.setItem('docs_category',JSON.stringify(data.category))
  })
})
const handleAdd = () => {
  window.open('/#/docs/editor?type=add');
}

const handleEdit = (item: any) => {
  console.log(item)
  window.open('/#/docs/editor?type=edit');
}


const pageChange = (currentPage:number)=>{
  table.filter.pageNo = currentPage
}
</script>
<style lang="scss" scoped></style>