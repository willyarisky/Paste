<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <button @click="newPaste">New</button>
        <button @click="save" :disabled="isSaving">
          {{ isSaving ? 'Saving paste...' : `Save / ${isMac ? 'CMD' : 'CTRL'}+S` }}
        </button>
      </div>
      <div class="right">
        <a href="https://github.com/willyarisky/paste" target="_blank" alt="Open Source Pastebin" class="btn p-0">
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
const isMac = ref(false);

onMounted(() => {
  editor.value = ace.edit('editor');
  editor.value.session.setMode('ace/mode/javascript');
  editor.value.setTheme('ace/theme/monokai');
  editor.value.session.setUseWrapMode(true);

  isMac.value = navigator.userAgent.indexOf('Macintosh') >= 0 || navigator.userAgent.indexOf('Mac OS X') >= 0;

  // Add keyboard shortcut for saving
  editor.value.commands.addCommand({
    name: 'save',
    bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
    exec: save
  });
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

  try {
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
  } catch (error) {
    isSaving.value = false;
    console.error('An error occurred while saving:', error);
  }
};

const newPaste = () => {
  editor.value.setValue('');
};
</script>