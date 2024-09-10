<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left font20" style="margin-bottom: 20px;">
        站点反馈
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <!-- <el-empty v-if="table.data.length == 0 && !table.loading"></el-empty> -->
      <el-table :data="table.data.slice((table.filter.pageNo-1)*10,(table.filter.pageNo)*10)" style="min-height: 460px;">
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column prop="create_time" label="创建时间" width="110" align="center" :formatter="(row:Items)=>fnFormatTime(row.create_time)" show-overflow-tooltip/>
        <el-table-column prop="fb_system" label="系统" width="100" align="center">
          <template #default="scope">
            <a target="_blank" :href="scope.row.fb_page">{{scope.row.fb_system}}</a>
          </template>
        </el-table-column>
        <el-table-column label="反馈人" width="150" align="center">
          <template #default="scope">
            <a target="_blank" :href="'mailto:'+scope.row.email" :title="'mailto:'+scope.row.email">{{scope.row.fb_name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="反馈内容" min-width="200" show-overflow-tooltip />
        <!-- <el-table-column prop="fb_system" label="状态" width="100" :filters="statusList" :filter-method="filterTag" > -->
        <el-table-column prop="fb_system" label="状态" width="100" >
          <template #header>
            <el-dropdown @command="handleStatus" style="cursor: pointer;">
              <span class="el-dropdown-link" :class="{active:table.filter.status}">
                状态
                <el-icon class="el-icon--right">
                  <Filter />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="''">
                    <div class="filter-status" :class="{active:!table.filter.status}">全部</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-for="status in statusList" :key="status.value" :command="status.value">
                    <div class="filter-status" :class="{active:table.filter.status == status.value}">{{status.text}}</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <template v-for="status in statusList" >
              <el-tag 
              v-if="scope.row.status==status.value"
              :key="status.value"
              :type="status.type">{{status.text}}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="处理人" align="center" width="80" show-overflow-tooltip/>
        <el-table-column prop="update_time" label="更新时间" width="110" align="center" :formatter="(row:Items)=>fnFormatTime(row.update_time)" show-overflow-tooltip/>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">{{scope.row.status=='1'&&scope.row.valid=='1'?'处理':'查看'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex" style="justify-content: space-between;margin-top: 24px;">
        <p class="statistics">
          <span style="margin-right: 16px;" @click="handleStatus('')">总计：<b style="color:var(--el-color-primary);margin: 0 2px;">{{staticTotal}}</b>条</span>
          <span v-for="status in statusList" @click="handleStatus(status.value)" style="margin-right: 16px;">
            {{status.text}}: <b style="color:var(--el-color-primary);margin: 0 2px;"> {{status.num}} </b>条
          </span>
        </p>
        <el-pagination background layout="total,prev, pager, next" :total="table.total" @change="pageChange"/>
      </div>
    </div>
    <Form />
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { onMounted , provide , ref} from 'vue';
import { Items } from './types';
import Form from './Form.vue';
import request from '@/api';
import { fnFormatTime } from '@/utils/formatFn';
const {
  table,
  getTableData,
  handleEdit,
  handleSubmit,
  closeForm,
} = useTable<Items>({
  baseUrl: '/feedback'
})

const statusList = ref([
  {
    text: '待处理',
    value: '1',
    type: 'warning',
    num: 0
  },
  {
    text: '处理中',
    value: '2',
    type: 'primary',
    num: 0
  },
  {
    text: '已处理',
    value: '3',
    type: 'success',
    num: 0
  },
  {
    text: '无效',
    value: '0',
    type: 'info',
    num: 0
  }
])


provide('table', table)
provide('handleSubmit', handleSubmit)
provide('closeForm', closeForm)
provide('statusList', statusList)

const staticTotal = ref(0)
onMounted(() => {
  // handleAdd()
  getTableData((data)=>{
    table.data = data.map((item:Items)=>{
      staticTotal.value++
      statusList.value.forEach((status)=>{
        if(item.status == status.value){
          status.num++
        }
      })
      return item
    })  
    table.total = table.data.length
  })
})

const pageChange = (currentPage:number)=>{
  table.filter.pageNo = currentPage
}

const handleStatus = (status:string)=>{
  table.filter.status = status
  table.filter.pageNo = 1
  getTableData((data)=>{
    table.data = data
    table.total = table.data.length
  })
}

const handleAdd = ()=>{
  request.post('/feedback/add',{
    fb_system : "Docs",
    fb_page: "https://jeremyhann.github.io/zimacube/Quick-Start.html",
    fb_name: "Jeremy",
    email: "jeremy@aaa.com",
    content: "这个页面的文档不够详细，希望能够补充一些内容",
  }).then((res:any)=>{
    getTableData()
  })
}

</script>
<style lang="scss" scoped>
.el-popper{
  max-width: 300px;
}
.el-dropdown-link{
  &.active{
    color: var(--el-color-primary);
  }
}
.filter-status{
  &.active{
    color: var(--el-color-primary);
  }
}
.statistics span{
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
}
</style>