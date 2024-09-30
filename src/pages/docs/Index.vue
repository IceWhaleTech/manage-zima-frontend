<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left flex" style="align-items: center;">
        <h3 class="font20" style="margin-right: 20px;">Docs</h3> <span>当前环境：测试 <a :href="host" target="_blank">{{ host }}</a> </span>
      </div>
      <div class="right">
        <el-button type="primary" @click="handleAdd" icon="Plus"> 新增 </el-button>
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="table.data.length == 0 && !table.loading"></el-empty>
      <el-table :data="table.data.slice((table.filter.pageNo-1)*10,(table.filter.pageNo)*10)" style="width: 100%">
        <el-table-column prop="title" label="标题" >
          <template #default="scope">
            <el-link type="primary" :underline="false" :href="host+scope.row.categoryKey[0]+'/'+scope.row.fileName" target="_blank">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="300" :formatter="(row:Items)=>row.category.join(' / ')" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
import { useRouter } from 'vue-router';
import type { Items } from './types.d'

// const host = "https://jeremyhann.github.io/"
const host = "https://docs.zimaspace.com/"

const {
  table,
  getTableData,
} = useTable<Items>({
  baseUrl: '/docs'
})
table.filter.type = 1

onMounted(() => {
  getTableData((data) => {
    table.data = data.list.filter((item:Items)=>item.fileKey !== 'placeholder')
    table.total = table.data.length
    localStorage.setItem('docs_category',JSON.stringify(data.category))
  })
})

const router = useRouter()
const handleAdd = () => {
  router.push('/docs/editor?type=add');
}

const handleEdit = (item: any) => {
  `/docs/editor?type=edit&title=${item.title}&fileName=${item.fileName.replace('.html','')}&category=${item.category}`
  router.push({
    path: '/docs/editor',
    query: {
      type: 'edit',
      title: item.title,
      fileKey: item.fileKey,
      fileName: item.fileName.replace('.html',''),
      category: item.category.join(','),
      categoryKey: item.categoryKey.join(','),
    }
  });
}


const pageChange = (currentPage:number)=>{
  table.filter.pageNo = currentPage
}
</script>
<style lang="scss" scoped></style>