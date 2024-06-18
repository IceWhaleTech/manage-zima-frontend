<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left font20">
        视频管理
      </div>
      <div class="right">
        <el-button type="primary" @click="handleAdd" icon="Plus"> 新增 </el-button>
      </div>
    </div>
    {{ table.loading }}
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="table.data.length == 0"></el-empty>
      <el-row :gutter="20">
        <el-col v-for="video in table.data" :span="6" style="margin-bottom: 20px;">
          <el-card style="max-width: 480px" body-style="padding:0">
            <div class="card">
              <el-image :class="{ grey: video.status == '0' }" style="width: 100%;cursor: pointer;"
                :src="getVideoPoster(video.src)" :fit="'cover'" @click="handlePreview(video)" />
              <div class="control">
                <el-button type="primary" :icon="'Edit'" circle @click="handleEdit(video)"></el-button>
                <el-popconfirm title="确认删除?" @confirm="confirmDelete(video)">
                  <template #reference>
                    <el-button type="danger" :icon="'Delete'" circle></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <template #footer>{{ video.title }}</template>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogVisible" title="预览" width="630">
      <iframe width="600px" height="300px" :src="iframeSrc" frameborder="0" allowfullscreen></iframe>
    </el-dialog>

    <Form :type="'2'" />
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { onMounted, provide, ref } from 'vue';
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
  baseUrl: '/gallery'
})
table.filter.type = 2

provide('table', table)
provide('handleSubmit', handleSubmit)
provide('closeForm', closeForm)
//预览弹框
const dialogVisible = ref(false)

onMounted(() => {
  getTableData()
})

const iframeSrc = ref('')
const handlePreview = (item: any) => {
  table.form.items = item
  dialogVisible.value = true
  iframeSrc.value = getIframeSrc(item.src)
}


const getVideoPoster = (src: string) => {
  if (src) {
    return `https://i.ytimg.com/vi/${src.split("v=")[1]}/maxresdefault.jpg`
  } else {
    return ''
  }
}
const getIframeSrc = (src: string) => {
  if (src) {
    return `//www.youtube.com/embed/${src.split("v=")[1]}?autoplay=1`
  } else {
    return ''
  }
}


</script>
<style lang="scss" scoped>
.table-wrapper {
  .card {
    position: relative;
    overflow: hidden;
    padding: 0;

    >.el-image.grey {
      filter: grayscale(100%);
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
</style>