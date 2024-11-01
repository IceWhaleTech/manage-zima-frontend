<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left flex" style="align-items: center;">
        <h3 class="font20" style="margin-right: 20px;">Docs</h3> <span>当前环境：生产 <a :href="host" target="_blank">{{ host }}</a> </span>
      </div>
      <div class="right flex">
        <el-button type="primary" @click="handleAdd" icon="Plus"> 新增 </el-button>
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="table.data.length == 0 && !table.loading"></el-empty>
      <el-table :data="tableData.slice((table.filter.pageNo-1)*10,(table.filter.pageNo)*10)" style="width: 100%">
        <el-table-column prop="title" label="标题" >
          <template #header>
            <div class="flex items-center">
              <span>标题</span>
              <el-input style="margin-left: 10px;width: 250px;" v-model="keyword" clearable @input="handleKeyword"></el-input>
            </div>
          </template>
          <template #default="scope">
            <el-link type="primary" :underline="false" :href="host+scope.row.categoryKey[0]+'/'+scope.row.fileName" target="_blank">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="300" :formatter="(row:Items)=>row.category.join(' / ')" >
          <template #header>
            <div>
              <span>分类</span>
              <el-cascader 
              v-model="categorySelected" 
              :options="options" 
              :props="{checkStrictly: true,expandTrigger: 'hover'}" 
              clearable 
              @change="handleCategory" 
              style="width: 180px;margin-left:10px"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="danger" size="small" @click="confirmDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="flex" style="justify-content: flex-end;margin-top: 24px;">
        <el-pagination background layout="total,prev, pager, next" :total="tableData.length" @change="pageChange"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import type { Items } from './types.d'
import { ref } from 'vue'
// const host = "https://jeremyhann.github.io/"
const host = "https://www.zimaspace.com/docs/"

const {
  table,
  getTableData,
} = useTable<Items>({
  baseUrl: '/docs'
})
table.filter.type = 1
const options = ref([])
onMounted(() => {
  getTableData((data) => {
    table.data = data.list.filter((item:Items)=>item.fileKey !== 'placeholder')
    tableData.value = table.data
    table.total = table.data.length
    localStorage.setItem('docs_category',JSON.stringify(data.category))
    options.value = data.category
  })
})

const keyword = ref('')
const categorySelected = ref([])
const tableData = ref<Items[]>([])

const handleKeyword = () => {
  table.filter.pageNo = 1
  categorySelected.value = []
  if(keyword.value){
    tableData.value = table.data.filter((item:Items) => item.title.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase()))
  }else{
    tableData.value = table.data
  }
}

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

const handleCategory = ()=>{
  console.log(categorySelected.value)
  if(categorySelected.value && categorySelected.value.length > 0){
    keyword.value = ''
    table.filter.pageNo = 1
    tableData.value = table.data.filter((item:Items) => {
      return item.categoryKey.join(',').indexOf( categorySelected.value.join(','))>-1
    })
  }
  // 清空分类
  if(!categorySelected.value){
    keyword.value = ''
    table.filter.pageNo = 1
    tableData.value = table.data
  }
}


const pageChange = (currentPage:number)=>{
  table.filter.pageNo = currentPage
}
</script>
<style lang="scss" scoped></style>