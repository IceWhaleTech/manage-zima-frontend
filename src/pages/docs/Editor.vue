<template>
  <div class="container">
    <div class="wrapper">
      <el-form :model="form" label-width="auto" ref="ruleFormRef" :rules="rules" style="max-width: 600px">
        <el-form-item label="目录标题" prop="title">
          <div class="flex" style="width: 100%;">
            <el-input v-model="form.title" style="flex:1"/>
            <el-button type="primary" :disabled="!form.title"
              v-if="lang != 'en'"
              style="margin-left: 6px;"
              @click="handleAi('translateTitle')">翻译标题</el-button>
          </div>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-cascader v-model="form.category" :disabled="!canEditCatergory || lang!='en'" :options="categoryList"
            :props="{ expandTrigger: 'hover' }" style="width:100%" />
          <p class="tip" style="margin-top: 4px;">该文章为当前主目录下的默认页，目录层级不允许修改！</p>
        </el-form-item>
        <el-form-item label="Ai赋能">
          <el-tooltip effect="dark" content="总结文章并填充到description" placement="bottom">
            <el-button type="primary" size="small" :disabled="!form.content || form.content.length < 100"
              @click="handleAi('description')">总结文章</el-button>
          </el-tooltip>
          <el-button type="primary" size="small" :disabled="!form.content || form.content.length < 100"
            v-if="lang != 'en'"
            @click="handleAi('translate')">翻译文章</el-button>
        </el-form-item>
      </el-form>
      <div v-loading="state.contentLoading">
        <MdEditor class="docs-editor" :editorId="'md-editor-'+lang" ref="editorRef" v-model="form.content"
          @onUploadImg="onUploadImg" />
      </div>
      <el-button type="primary" :disabled="state.saveLoading" style="margin-top: 24px;"
        @click="handleSave(ruleFormRef)">
        <el-icon v-if="state.saveLoading" class="is-loading">
          <Loading />
        </el-icon>
        <span v-else>
          {{ type == 'add' ? '发布' : '保存' }}
        </span>
      </el-button>
      <p class="tip" style="margin-top: 6px;">请勿使用一级标题 h1 或 # （SEO优化）！</p>
      <p class="tip" style="margin-top: 6px;">插入图片或链接后请在[]内添加相关描述（SEO优化）！</p>
      <p class="tip" style="margin-top: 6px;">旧有文章中的图片暂不支持预览，不影响正常功能！</p>
      <p class="tip" style="margin-top: 6px;">文章保存后需要约5min的编译时间，请在编译完成后查看！</p>
      <p class="tip" style="margin-top: 6px;">因编译需要时间，请勿频繁提交保存！</p>
      <p class="tip" style="margin-top: 6px;">gif动图大小不要超过10M！</p>
    </div>
    <div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useRoute, useRouter } from "vue-router";
import request from '@/api/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as imageConversion from 'image-conversion';
import type { FormInstance } from 'element-plus'
import TurndownService from 'turndown'
import { useAi } from '@/hooks/useAi'

const props = defineProps<{
  lang: string
  langLabel: string
}>()
const langPath = computed(() => {
  return props.lang == 'en' ? '' : props.lang + '/'
})

const state = reactive({
  contentLoading: false,
  saveLoading: false,
})
const form = reactive({
  title: '',
  title_origin: '',
  fileKey: '',
  category: [],
  category_origin: [],
  content: '',
  sha: undefined,
  fileName: '',
})
const ruleFormRef = ref<FormInstance>()
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const categoryList = JSON.parse(localStorage.getItem('docs_category') || '')
const user = JSON.parse(localStorage.getItem('user') || "{}")
const route = useRoute();
const type = route.query.type;
if (type == 'add') {
  form.content = `---
title: 文章标题
description: 
type: Docs
author: ${user.name}
tip: 顶部栏固定格式请勿删除,description为文章描述，不填时将截取内容最前一段文字
---
## 段落标题
内容部分`;
} else {
  form.title = route.query.title as string
  form.title_origin = route.query.title as string
  let category = route.query.categoryKey as any
  form.category = category.split(',')
  form.category_origin = category.split(',')
  form.fileKey = route.query.fileKey as string
  form.fileName = route.query.fileName as string
}

const editorRef = ref()
const canEditCatergory = computed(() => {
  return form.fileName !== 'index'
})
var turndownService = new TurndownService({
  headingStyle: 'atx',
})
// var markdown = turndownService.turndown('<h1>Hello world!</h1>')
onMounted(() => {
  if (type == 'edit') getFile(route.query.fileName + '.md')
  let editor = document.getElementById('md-editor-'+props.lang) as any
  editor.addEventListener('paste', handlePaste)
})

const handlePaste = async (event: any) => {
  state.contentLoading = true
  const clipboardData = event.clipboardData || event.originalEvent.clipboardData;
  const htmlData = clipboardData.getData('text/html');
  const textData = clipboardData.getData('text/plain');
  // 将复制的文章中的h1标签转换为h2标签
  let newHtml = htmlData.replaceAll('<h1', '<h2').replaceAll('</h1>', '</h2>');
  if (htmlData && textData) {
    // 创建一个虚拟DOM来解析HTML
    event.preventDefault();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
    const imgTags = doc.getElementsByTagName('img');
    // 转存图片
    if (imgTags.length > 0) {
      for (const img of imgTags) {
        const imgUrl = img.src;
        const newUrl = await uploadImage(imgUrl);
        newHtml = newHtml.replace(imgUrl, newUrl);
      }
      var markdown = turndownService.turndown(newHtml)
      // event.preventDefault() 不生效，进行替换改写;
      form.content = form.content.replace(textData, '')
      form.content += markdown
    }
    // 转存markdown
  }
  state.contentLoading = false
}


async function uploadImage(url: string) {
  // 通过图片链接获取图片blob
  const response = await fetch(url);
  const responseBlob = await response.blob();
  const size = 400
  let blob = await imageConversion.compressAccurately(responseBlob, size)
  let contentType = response.headers.get('Content-Type')
  let fileType = contentType?.split('/')[1]

  const formdata = new FormData()
  formdata.append('path', '/docs')
  let file = new File([blob], 'copyImage.' + fileType, { type: fileType })

  formdata.append('file', file)
  // 上传图片
  let { data } = await request.post('/upload/batchImages', formdata)
  let path = window.location.origin + '/api'
  return data.map((item: any) => path + item.filePath)[0];
}

const getFile = (fileName: string) => {
  state.contentLoading = true

  request.get(`/docs/doc/${fileName}?path=${langPath.value + form.category[0]}`).then(res => {
    form.content = res.data.content
    form.sha = res.data.sha
  }).finally(() => {
    state.contentLoading = false
  })
}

const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      confirmSave()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const router = useRouter()

const confirmSave = () => {
  state.saveLoading = true
  if (type == 'add') {
    form.fileName = form.title.replace(/\s/g, '-')
    form.fileKey = form.fileName.toLowerCase()
  }
  console.log(form)
  return
  request.post('/docs/save', {
    type,
    langPath: langPath.value,
    ...form
  }).then(() => {
    window.setTimeout(() => {
      ElMessage.success('保存成功！')
      router.push('/docs')
    }, 2000)
  }).catch((err: any) => {
    ElMessage.error(err.message)
  }).finally(() => {
    state.saveLoading = false
  })
}

const onUploadImg = async (files: any, callback: (urlList: any) => void) => {
  // 对文件先进行压缩
  const size = 400
  let blobList = await Promise.all(
    files.map((file: any) => {
      // 小于10M的gif不压缩
      if (file.type.indexOf('gif') >= 0 && file.size < 1024 * 1024 * 10) {
        return file
      } else {
        return imageConversion.compressAccurately(file, size)
      }
    }
    ))
  const formdata = new FormData()
  formdata.append('path', '/docs')
  blobList.map((blob: any, index: number) => {
    let file = new File([blob], files[index].name, { type: files[index].type })
    formdata.append('file', file)
  })
  // 上传图片
  let { data } = await request.post('/upload/batchImages', formdata)
  let path = window.location.origin + '/api'
  callback(data.map((item: any) => path + item.filePath));
}


const { runAi } = useAi()


const handleAi = (type: string) => {
  if (type == 'description') {
    confirmAi(`对后面的文章给我100字以内的总结以帮助seo,用${props.langLabel}回复`, form.content ,(response:string) => {
      form.content = form.content.replace(/description:.*\n/, 'description: ' + response + '\n')
    })
  }
  if (type == 'translate') {
    confirmAi(`将后面的内容翻译成${props.langLabel}并保留原有格式`, form.content ,(response:string) => {
      form.content = response
    })
  }
  if (type == 'translateTitle') {
    confirmAi(`根据文章内容，将${form.title}翻译成${props.langLabel}`,form.content, (response:string) => {
      form.title = response
    })
  }
}

const confirmAi = (text:string,extraText:string,callback:any)=>{
  ElMessageBox.prompt('', 'Ai Prompt', {
    inputValue: text,
    inputType: 'textarea',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Loading...'
        if (!instance.inputValue) {
          ElMessage({
            type: 'warning',
            message: '请输入内容！',
          })
        } else {
          runAi({
            system: instance.inputValue,
            user: extraText
          }).then((response: any) => {
            if(callback) callback(response)
            done()
          });
        }
      } else {
        done()
      }
    },
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: `操作成功！`,
      })
    }).catch()
}

</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;

  .wrapper {
    max-width: 1600px;
    margin: auto;
    padding: 20px 24px 40px;
    background-color: #fff;
  }

  .tip {
    color: #999;
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
<style lang="scss">
// 隐藏toolbar中的一级标题
.docs-editor {
  .md-editor-toolbar-wrapper .md-editor-toolbar {
    .md-editor-dropdown-overlay ul.md-editor-menu {
      li.md-editor-menu-item-title {
        &:nth-child(1) {
          display: none;
        }
      }
    }
  }
}
</style>