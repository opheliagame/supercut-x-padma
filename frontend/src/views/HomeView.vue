<script setup>
import SearchForm from '../components/SearchForm.vue'
import { onMounted, ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import MainSection from '../components/MainSection.vue';
import SideSection from '../components/SideSection.vue';
import AboutSection from '@/components/AboutSection.vue';

const error = ref(null)
const supercutBlobUrl = ref(null)
const clips = ref([])
const transcripts = ref([])


// async function load() {
//   try {
//     const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
//     const ffmpeg = ffmpegRef
//     // toBlobURL is used to bypass CORS issue, urls with the same
//     // domain can be used directly.
//     await ffmpeg.load({
//       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//       wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
//     });
//     // ffmpeg.on('log', ({ message }) => {
//     // // messageRef.current.innerHTML = message;
//     //   console.log(message);
//     // });

//   } catch (e) {
//     console.log(e)
//   }
// }

// load().then(() => {
//   console.log("ffmpeg loaded")
// })

const handleSendSupercut = (value) => {
  console.log(value)
  supercutBlobUrl.value = value
}

const handleSendVideos = (value) => {
  console.log("in handle send videos")
  if(value.length == 0) {
    error.value = true
  }
  else {
    error.value = false
  }
  
  const arr = value.map(v => {
    return {
      title: v.title,
      url: v.url,
      keywords: v.keywords,
    }
  })
  
  clips.value = arr
  console.log(clips.value)
}

const handleSendTranscripts = (value) => {
  console.log("in handle send transcripts")

  transcripts.value = value

}

</script>

<template>
  
  <div class="flex flex-col w-full h-full overflow-hidden">
    <AppHeader>
      <SearchForm @send-supercut="handleSendSupercut" @send-videos="handleSendVideos" @send-transcripts="handleSendTranscripts" />
    </AppHeader>

    <div v-if="error" class="px-6 md:px-12 py-2 bg-red-50 text-sm">
      <p>We could not find anything with these search parameters. Please try again.</p>
    </div>

    <div v-if="clips.length > 0" class="w-full h-full grid md:grid-cols-2 divide-x overflow-hidden">
      <MainSection v-bind:supercut-blob-url="supercutBlobUrl" v-bind:transcripts="transcripts" />
      
      <SideSection v-bind:clips="clips" />

    </div>
    <div v-else>
      <AboutSection />
    </div>
  </div>
</template>

