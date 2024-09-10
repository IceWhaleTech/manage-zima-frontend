<template>
  <el-drawer :model-value="table.form.operate ? true : false" @close="table.form.operate = ''">
    <template #header>
      <h4>反馈信息</h4>
    </template>
    <template #default>
      <div style="margin-top: -20px;">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="auto" style="max-width:500px">
          <el-form-item label="创建时间:" prop="title">
            {{ fnFormatTime(form.create_time) }}
          </el-form-item>
          <el-form-item label="系统:" prop="title">
            {{ form.fb_system }}
          </el-form-item>
          <el-form-item label="反馈页面:" prop="title">
            <a target="_blank" :href="form.fb_page">{{ form.fb_page }}</a>
          </el-form-item>
          <el-form-item label="反馈人:" prop="title">
            {{ form.fb_name }}
          </el-form-item>
          <el-form-item label="邮箱:" prop="title">
            <a target="_blank" :href="'mailto:'+form.email" :title="'mailto:'+form.email">{{form.email}}</a>
          </el-form-item>
          <el-form-item label="反馈内容:" prop="title">
            <div class="content">{{ form.content }}</div>
          </el-form-item>
          <el-form-item label="工单状态:">
            <el-select
              v-model="form.status"
              placeholder="请选择"
              style="width: 150px;"
            >
              <el-option
                v-for="item in statusList"
                :key="item"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="更新时间:" prop="title" v-if="form.update_time">
            {{ fnFormatTime(form.update_time) }}
          </el-form-item>
          <el-form-item label="处理人:" prop="title" v-if="form.operator">
            {{ form.operator }}
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              v-model="form.remark"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto;text-align: left;">
        <el-button type="primary" @click="handleSubmit(formRef)">确认</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { inject, ref, toRef, watchEffect , reactive} from 'vue';
import type { ZimaTable } from '@/types/table.t';
import type { Items } from './types.d.ts';
import type { FormRules } from 'element-plus'
import { fnFormatTime } from '@/utils/formatFn.ts';
const table = inject("table") as ZimaTable<Items>
const handleSubmit = inject("handleSubmit") as any
const closeForm = inject("closeForm") as any
const statusList = inject("statusList") as any
const form = toRef(table.form, 'items')
const formRef = ref()
const rules = reactive<FormRules<Items>>({
  // src: [
  //   { required: true, message: props.type == '1'?'请上传图片':'请填写视频地址', trigger: 'change' },
  // ],
})

</script>
<style lang="scss" scoped>
.content{
  padding: 5px 11px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
  width: 100%;
}
</style>