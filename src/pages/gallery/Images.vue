<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left font20">
        图片管理
      </div>
      <div class="right">
        <el-button type="primary" @click="handleAdd" icon="Plus"> 新增 </el-button>
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="table.data.length==0"></el-empty>
      <ul class="flex">
        <li v-for="image in table.data">
          <el-card style="max-width: 480px" body-style="padding:0">
            <div class="card">
              <el-image :class="{grey:image.status=='0'}" style="height: 160px;" :preview-src-list="srcList" :src="image.src" :fit="'cover'" />
              <div class="control">
                <!-- <el-button type="primary" :icon="'imagePlay'" circle></el-button> -->
                <el-button type="primary" :icon="'Edit'" circle @click="handleEdit(image)"></el-button>
                <el-popconfirm title="确认删除?" @confirm="confirmDelete(image)">
                  <template #reference>
                    <el-button type="danger" :icon="'Delete'" circle></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <template #footer>{{ image.title }}</template>
          </el-card>
        </li>
      </ul>
    </div>
    <Form :type="'1'" />
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { computed, onMounted, provide } from 'vue';
import type { Items } from './types.d'
import Form from './Form.vue'
const {
  table,
  getTableData,
  handleAdd,
  handleEdit,
  handleSubmit,
  confirmDelete,
  closeForm
} = useTable<Items>({
  baseUrl:'/gallery'
})
table.filter.type = 1

const srcList = computed(()=>table.data.map(item=>item.src))

provide('table',table)
provide('handleSubmit',handleSubmit)
provide('closeForm',closeForm)

onMounted(() => {
  getTableData()
})


</script>
<style lang="scss" scoped>
.table-wrapper {
  ul {
    flex-wrap: wrap;
    margin: 0 -16px;
    li {
      margin: 16px;
      overflow: hidden;
      .card{
        position: relative;
        overflow: hidden;
        padding: 0;
        >.el-image.grey{
          filter: grayscale(100%);
        }
      }
      .control {
        position: absolute;
        bottom: -52px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 20px;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
        backdrop-filter: saturate(50%) blur(4px);
      }

      &:hover {
        .control {
          bottom: 0px;
        }
      }
    }
  }
}
</style>