<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <nuxt-link to="/" class="btn">New</nuxt-link>
      </div>

      <div class="right">
        <a href="#" class="btn p-0">
          <GithubLogo/>
        </a>
      </div>
    </div>
    <div id="editor"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const route = useRoute();
const groupId = route.params.groupId;
const editor = ref(null);

onMounted(async () => {
  editor.value = ace.edit('editor');
  editor.value.session.setMode('ace/mode/javascript');
  editor.value.setTheme('ace/theme/monokai');
  editor.value.session.setUseWrapMode(true);
  editor.value.setValue('Loading...');

  try {
    const response = await $fetch(`/api/show/${groupId}`);
    
    const content = response.body.content.replace(/<<N>>/g, '\n');
    editor.value.setValue(content);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>
