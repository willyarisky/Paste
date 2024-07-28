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
                <GithubLogo />
            </div>
        </div>
        <div id="editor"></div>
    </div>
</template>

<script setup>
useHead({
    title: process.env.APP_NAME
});

import { ref, onMounted } from 'vue';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { useRouter } from 'vue-router';

const editor = ref(null);
const router = useRouter();
const isSaving = ref(false);
const isMac = ref(false);

onMounted(() => {
    editor.value = ace.edit('editor');
    editor.value.session.setMode('ace/mode/javascript');
    editor.value.setTheme('ace/theme/monokai');
    editor.value.session.setUseWrapMode(true);
    editor.value.setShowPrintMargin(false);

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
        const response = await $fetch('/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        isSaving.value = false;

        if (response && response.body && response.body.groupId) {
            router.push(`/${response.body.groupId}`);
        } else {
            console.error('Unexpected response format:', response);
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
