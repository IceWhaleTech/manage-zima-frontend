<template>
  <div class="container">
    <div class="wrapper">
      <div>
        <h3>这边是markdown编辑器</h3>
        <MdEditor v-model="text" />
      </div>
      <div>
        这边是预览
      </div>
      <el-button @click="handleClick">确认</el-button>
    </div> 
    
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('# Hello Editor');

const handleClick = ()=>{
  console.log(text.value);
}

</script>
<style lang="scss" scoped>
.container {
  background: rgb(244, 244, 244);
  min-height: 100vh;
  .wrapper{
    max-width: 1600px;
    display: flex;
    margin:auto;
    padding-top: 50px;
    >div{
      flex: 1;
      min-height: 600px;
      background-color: #fff;
      margin: 0 12px;
      border-radius: 8px;
    }
  }
}
</style>