<template>
  <div>
    <div class="header filter-wrapper flex justify-between">
      <div class="left flex " style="align-items: center;">
        <h3 class="font20" style="margin-right: 20px;">Search</h3>
        <el-input v-model="table.filter.keyword" style="max-width: 800px" placeholder="请输入关键词" class="input-with-select"
          @keyup.enter="handleSearch">
          <!-- <template #prepend>
            <el-select v-model="table.filter.maxResults" placeholder="Select" style="width: 80px">
              <el-option label="20 条" :value="20" />
              <el-option label="50 条" :value="50" />
            </el-select>
          </template> -->
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
        <span style="color: #999;white-space: nowrap;margin-left: 10px;font-size: 12px;">! 当前仅支持YouTube检索</span>
      </div>
      <div class="right" v-if="table.data && table.data.length">
        <el-button type="primary" icon="Download" @click="handleDownload">导出 Excel</el-button>
      </div>
    </div>
    <div class="table-wrapper" v-loading="searchLoading">
      <el-empty v-if="table.data.length == 0 && !searchLoading"></el-empty>
      <el-table v-else :data="table.data" height="calc(100vh - 160px)" style="width: 100%" ref="multipleTableRef"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column type="index" label="序号" width="55" align="center"/>
        <el-table-column prop="videoCover" label="视频封面" width="150" align="center">
          <template #default="scope">
            <a target="_blank" :href="scope.row.channelUrl">
              <el-image style="height: 100px" :src="scope.row.videoCover" fit="contain" />
            </a>  
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="300">
          <template #default="scope">
            <a target="_blank" :href="'https://www.youtube.com/watch?v=' + scope.row.videoId">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="播放量" width="100" align="center" />
        <el-table-column prop="channelUrl" label="频道" width="200" align="center">
          <template #default="scope">
            <a target="_blank" :href="scope.row.channelUrl">{{ scope.row.channelTitle }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="subscriberCount" label="订阅数" width="100" align="center" />
        <el-table-column prop="channelVedioCount" label="视频数量" width="100" align="center" />
        <!-- <el-table-column prop="channelViewCount" label="播放量" width="150" /> -->
        <el-table-column prop="channelAverageViewCount" label="平均播放量" width="120" align="center" />
        <el-table-column prop="email" label="邮箱" width="200" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.email"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="channelUrl" label="社媒信息" width="300" align="center">
          <template #default="scope">

            <ul v-if="scope.row.socialInfo && scope.row.socialInfo.length">
              <li v-for="link in scope.row.socialInfo">
                <a target="_blank" :href="'https://' + link.text">{{ link.text }}</a>
              </li>
            </ul>
            <el-button v-else @click="getSocial(scope.row)" size="small" type="primary"
              :disables="scope.row.socialLoading">
              <el-icon class="is-loading" v-if="scope.row.socialLoading">
                <Loading />
              </el-icon>
              <span v-else>获取</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="load-more" v-if="table.data&&table.data.length&&table.data.length" @click="loadMore">
        <el-icon class="is-loading" v-if="table.loading">
          <Loading />
        </el-icon>
        <span v-else>加载更多...</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTable } from '@/hooks/useTable';
import { ref, onMounted, reactive } from 'vue';
import type { Items } from './types.d';
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
import request from '@/api';
import { useExcel } from '@/hooks/useExcel';
const {
  table,
  getTableData,
} = useTable<Items>({
  baseUrl: '/search'
})

onMounted(() => {
  table.filter.maxResults = 20
  table.filter.keyword = ''
  // table.filter.keyword = 'insta360'
})

const keyword = ref('')

const searchLoading = ref(false)
const handleSearch = () => {
  if (!table.filter.keyword) {
    return
  }
  searchLoading.value = true
  keyword.value = table.filter.keyword
  table.data = []
  getTableData((data) => {
    toggleSelection()
    searchLoading.value = false
    table.data = data.list
    table.filter.nextPageToken = data.nextPageToken
  })
}


const loadMore = () => {
  if(table.loading) return
  getTableData((data) => {
    table.data = [...table.data, ...data.list]
    table.filter.nextPageToken = data.nextPageToken
  })
}

const getSocial = (row: Items) => {
  row.socialLoading = true
  request.get('/search/social', {
    params: {
      channelId: row.channelId
    }
  }).then((res) => {
    row.socialLoading = false
    row.socialInfo = res.data.socialLinks
  }).finally(() => {
    row.socialLoading = false
  })
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Items[]>([])
const toggleSelection = (rows?: Items[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: Items[]) => {
  multipleSelection.value = val
}


const { exportToExcel } = useExcel()
const handleDownload = () => {
  const column = [
    {
      keyword: '关键词',
      title: '标题',
      videoUrl: '视频链接',
      viewCount: "播放量",
      channelTitle: "频道",
      channelUrl: "频道链接",
      subscriberCount: '订阅数',
      channelVedioCount: "视频数量",
      channelAverageViewCount: "平均播放量",
      email: "邮箱",
      socialInfo: "社媒信息"
    }
  ]
  let data = multipleSelection.value.length?multipleSelection.value : table.data
  let list = data.map((item:any)=>{
    let object = JSON.parse(JSON.stringify(item))
    object.keyword = keyword.value
    object.videoId = undefined
    object.videoUrl = 'https://www.youtube.com/watch?v=' + item.videoId
    object.videoCover = undefined
    object.channelId = undefined
    object.channelViewCount = undefined
    object.socialLoading = undefined
    object.socialInfo = item.socialInfo?.map((link:any) => 'https://'+ link.text).join(' \n')
    return object
  })
  exportToExcel([...column, ...list], keyword.value)
}
</script>
<style lang="scss" scoped>
.header{
  position: sticky;
  margin-top: -20px;
  top: -20px;
  padding: 20px 0;
  z-index: 1000;
  background-color: #fff;
}
.load-more{
  text-align: center;
  padding: 20px 0;
  cursor: pointer;
  color: #666;
  &:hover{
    background-color: #FAFAFA;
    color: var(--el-color-primary);
  }
}
</style>