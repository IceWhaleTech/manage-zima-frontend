<template>
  <div>
    <div class="filter-wrapper flex justify-between">
      <div class="left flex items-center">
        <h3 class="font20">
          图片管理
        </h3>
        <div style="margin-left:20px">
          <el-select v-model="currentCategory" placeholder="All" clearable style="width: 150px">
            <el-option
              v-for="item in categoryList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" @click="handleAdd" icon="Plus"> 新增 </el-button>
        <el-button type="primary" @click="handleBatch" icon="Upload"> 批量上传 </el-button>
      </div>
    </div>
    <div class="table-wrapper" v-loading="table.loading">
      <el-empty v-if="tableData.length == 0"></el-empty>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="(image, index) in tableData"
          style="margin-bottom: 20px;">
          <el-card style="width: 100%" body-style="padding:0" shadow="hover">
            <div class="card">
              <el-image :class="{ grey: image.status == '0' }" style="height: 160px;" preview-teleported :preview-src-list="srcList"
                :initial-index="index" :src="getResizedImage(image.src)" :fit="'cover'" />
              <div class="delete">
                <el-popconfirm title="确认删除?" @confirm="confirmDelete(image)">
                  <template #reference>
                    <!-- <el-button type="danger" :icon="'Delete'" circle></el-button> -->
                    <el-icon>
                      <CloseBold />
                    </el-icon>
                  </template>
                </el-popconfirm>
              </div>
              <div class="control">
                <!-- <el-button type="primary" :icon="'imagePlay'" circle></el-button> -->
                <el-switch v-model="image.status" :active-value="'1'" :inactive-value="'0'"
                  @change="confirmEditing(image)" style="margin-right: 10px;" />
                <el-button type="primary" :icon="'Edit'" circle @click="handleEdit(image)"></el-button>
              </div>
            </div>
            <template #footer>
              <div class="card-footer">
                <div class="title flex items-center justify-between">
                  <el-input v-show="image.editing" v-model="image.title" :rows="1" autosize
                    @keyup.enter="confirmEditing(image)" />
                  <span v-show="!image.editing">{{ image.title || '--' }}</span>
                  <el-icon v-show="!image.editing" size="16" color="#999" style="cursor: pointer;"
                    @click="image.editing = !image.editing">
                    <Edit />
                  </el-icon>
                </div>
                <el-tag type="info" v-if="image.category" style="margin-top: 10px;">{{image.category}}</el-tag>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <Form :type="'1'" />
    <el-dialog v-model="batchVisiable" title="批量上传" width="900">
      <div v-loading="uploading">
        <el-form :model="batchForm" ref="formRef" label-width="auto" style="padding-left: 24px;">
          <el-form-item label="分类">
            <el-select v-model="batchForm.category" placeholder="请选择" style="width:200px">
              <el-option v-for="item in categoryList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="batchForm.status" :active-value="'1'" :inactive-value="'0'" />
          </el-form-item>
          <el-form-item label="图片">
            <el-upload ref="uploadRef" v-model:file-list="batchList" multiple :limit="10" name="image"
              :auto-upload="false" :headers="{ Authorization: token }" :before-upload="beforeUpload"
              :on-success="onSuccess" :on-exceed="onExceed" action="/api/upload/image" list-type="picture-card">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
            <div style="width: 100%;font-size: 12px;color: #999;margin-top: 10px;">!单次上传最多支持10张图片</div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchVisiable = false">取消</el-button>
          <el-button type="primary" @click="confirmBatch" :disabled="uploading">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { ref, computed, onMounted, provide, reactive } from 'vue';
import Form from './Form.vue'
import type { Items } from './types.d'
import { ElMessage, type UploadInstance } from 'element-plus'
import * as imageConversion from 'image-conversion';
import request from '@/api/index.js';
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
table.filter.type = 1
const categoryList = ['ZimaBoard', 'ZimaBlade', 'ZimaCube', 'Lifestyle', 'Application', 'Development']

provide('table', table)
provide('handleSubmit', handleSubmit)
provide('closeForm', closeForm)
provide('categoryList', categoryList)

onMounted(() => {
  getTableData()
})


const currentCategory = ref('')
const tableData = computed(()=>{
  if(currentCategory.value){
    return table.data.filter(item => item.category === currentCategory.value)
  }else{
    return table.data
  }
})

const srcList = computed(() => tableData.value.map(item => item.src))


const getResizedImage = (src: string) => {
  return src.replace('/images/', '/images/resized_')
}

// 批量上传相关
const uploadRef = ref<UploadInstance>()
const token = localStorage.getItem('token')
const batchForm = reactive({
  category: [],
  status: '0'
})


// 编辑
const confirmEditing = (image: Items) => {
  request.put('/gallery/edit', image
  ).then((res: any) => {
    ElMessage.success(res.data.message)
    image.editing = false
  }).catch(() => {
    ElMessage.error("操作失败，请重试！")
    getTableData()
  });
}

const batchVisiable = ref(false)
const batchList = ref([])
const uploadList = ref<any[]>([])
const uploading = ref(false)
const handleBatch = () => {
  // 批量上传图片
  batchList.value = []
  uploadList.value = []
  batchVisiable.value = true
}

const confirmBatch = () => {
  // 确认上传图片
  uploading.value = true
  uploadRef.value!.submit()
}

const beforeUpload = async (file: any) => {
  try {
    // 调用 image-conversion 库进行图片压缩
    const compressedFile = await imageConversion.compressAccurately(file, {
      size: 1000, // 目标压缩大小，单位 KB
    });
    // 继续上传处理
    return compressedFile;
  } catch (error) {
    console.error('图片压缩失败', error);
    return false;
  }
}

const onExceed = ()=>{
  ElMessage.warning('单次最多可上传10张图片！')
}

const onSuccess = (res: any) => {
  const lastItem = table.data[table.data.length - 1] || { sort: 0 }
  uploadList.value.push({
    type: 1,
    category: batchForm.category,
    status: batchForm.status,
    sort: lastItem.sort  + uploadList.value.length + 1,
    src: "/api" + res.filePath
  });
  if (uploadList.value.length == batchList.value.length) {
    request.post(
      "/gallery/batchAdd",
      {
        list: uploadList.value
      }
    ).then(() => {
      batchVisiable.value = false;
      getTableData()
      ElMessage.success("批量上传成功！")
    }).finally(() => uploading.value = false)
  }
}

</script>
<style lang="scss" scoped>
.table-wrapper {
  padding: 24px 0;

  .card {
    position: relative;
    overflow: hidden;
    padding: 0;
    display: flex;
    justify-content: center;
    >.el-image.grey {
      filter: grayscale(100%);
    }

    .delete {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #fff;
      width: 28px;
      height: 28px;
      font-size: 16px;
      cursor: pointer;
      display: none;
      // display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;

      .el-icon {
        opacity: .8;
        transition: .3s ease;
      }

      &:hover {

        .el-icon {
          opacity: 1;
          transform: scale(1.1);
        }
      }
    }

    .control {
      position: absolute;
      bottom: -52px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 10px 12px;
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.6);
      transition: all 0.3s ease;
      backdrop-filter: saturate(50%) blur(4px);
    }

    &:hover {
      .delete {
        display: flex;
      }

      .control {
        bottom: 0px;
      }
    }
  }
  ::v-deep(.el-card__footer){
    padding: 10px 16px;
  }
  .card-footer {
    min-height: 50px;
    line-height: 16px;
    i.el-icon {
      margin-right: -4px;
      display: none;
      &:hover{
        color:var(--el-color-primary);
      }
    }

    &:hover {
      i.el-icon {
        display: block;
      }
    }
  }
}
</style>