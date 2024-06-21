<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left font20" style="margin-bottom: 20px;">
        Event <el-link style="margin-left: 20px;" type="primary" href="https://www.zimaspace.com/event" target="_blank">点我去官网查看</el-link>
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="table.data.length == 0 && !table.loading"></el-empty>
      <el-table :data="table.data" style="width: 500px">
        <el-table-column prop="rank" label="名次" align="center" width="80" />
        <el-table-column prop="name" label="姓名" >
          <template #default="scope">
            <el-input v-if="mode=='editing'" v-model="scope.row.name"/>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="like" label="点赞量" width="100">
          <template #default="scope">
            <el-input v-if="mode=='editing'" v-model="scope.row.like"/>
            <span v-else>{{ scope.row.like }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex" style="margin-top: 24px;">
        <el-button v-if="mode=='editing'" type="primary" @click="handleSave">保存</el-button>
        <el-button v-if="mode=='editing'" @click="handleCancel">取消</el-button>
        <el-button v-if="mode=='static'" @click="mode='editing'">修改</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useTable } from '@/hooks/useTable';
import { onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import request from '@/api/index.js';
import { ElMessage } from 'element-plus';
const {
  table,
  getTableData,
} = useTable<any>({
  baseUrl: '/event'
})

const mode = ref('static') // editing

onMounted(() => {
  getTableData()
})



const handleCancel = ()=>{
  mode.value = 'static'
  getTableData()
}

const handleSave = ()=>{
  request.post('/event/save',table.data).then((res:any)=>{
    ElMessage.success('保存成功！')
    mode.value ='static'
  }).catch((err:any) => {
    ElMessage.error(err.message)
  });
}
</script>
<style lang="scss" scoped></style>