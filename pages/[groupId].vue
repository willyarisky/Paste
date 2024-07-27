<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <nuxt-link to="/" class="btn">New</nuxt-link>
      </div>

      <div class="right">
        <button class="btn" @click="copyURL">Copy URL</button>
        <GithubLogo/>
      </div>
    </div>
    <div id="editor"></div>
    
    <div class="actions">
      <button @click="copySnippet">
        <IconCopy/>
      </button>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: process.env.APP_NAME
})

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const editor = ref(null);
const router = useRouter();
const route = useRoute();
const groupId = route.params.groupId;

const { data, error } = await useFetch(`/api/show/${groupId}`);

onMounted(() => {
  editor.value = ace.edit('editor');
  editor.value.session.setMode('ace/mode/javascript');
  editor.value.setTheme('ace/theme/monokai');
  editor.value.session.setUseWrapMode(true);

  if (error.value || !data.value || !data.value.body || !data.value.body.content) {
    console.error('Error fetching data:', error.value);
    router.push('/');
  } else {
    const content = data.value.body.content.replace(/<<N>>/g, '\n');
    editor.value.setValue(content);
    editor.value.setReadOnly(true);
  }
});

const copySnippet = () => {
  const snippet = editor.value.getValue();
  navigator.clipboard.writeText(snippet);

  alert('Snippet copied to clipboard');
}

const copyURL = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);

  alert('Snippet URL copied to clipboard');
}
</script>
