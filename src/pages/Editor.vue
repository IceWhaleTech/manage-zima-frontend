<template>
  <div class="container" id="main"> 
    aaaa
    <v-md-editor v-model="content" height="400px"></v-md-editor>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const content = ref('')

</script>