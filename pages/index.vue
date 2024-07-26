<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <button @click="newPaste">New</button>
        <button @click="save" :disabled="isSaving">
          {{ isSaving ? 'Saving paste...' : 'Save' }}
        </button>
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
import { ref, onMounted } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { useRouter } from 'vue-router';
import { useFetch } from '#app';

const editor = ref(null);
const router = useRouter();
const isSaving = ref(false);

onMounted(() => {
  editor.value = ace.edit('editor');
  editor.value.session.setMode('ace/mode/javascript');
  editor.value.setTheme('ace/theme/monokai');
  editor.value.session.setUseWrapMode(true);
});

const save = async () => {
  const snippet = editor.value.getValue();

  if (!snippet) {
    return;
  }

  isSaving.value = true;
  
  const payload = {
    content: snippet
  };

  const { data, error } = await useFetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  isSaving.value = false;

  if (!error.value) {
    router.push(`/${data.value.body.groupId}`);
  } else {
    console.error(error.value);
  }
};

const newPaste = () => {
  editor.value.setValue('');
};
</script>
