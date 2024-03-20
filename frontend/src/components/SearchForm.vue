<script setup>
import { ref } from 'vue';
import { find, get, createSupercut } from '../api'

const emit = defineEmits(['send-supercut', 'send-videos', 'send-transcripts'])

const query = ref('')
const range = ref(2)
const cutLength = ref(10)

const onClick = async () => {
  console.log("search form: on click method called")
  console.log(query.value, range.value, cutLength.value)

  const videos = await find(query.value, range.value, cutLength.value)
  console.log(videos)

  let clips = await Promise.all(videos.map(v => get(v.id, query.value, cutLength.value)))
  clips = clips.flat(1)
  console.log(clips)

  emit('send-videos', clips)

  let transcripts = clips.map(c => c.transcript)
  console.log("here")
  console.log(transcripts)
  emit('send-transcripts', transcripts)

  const supercut = await createSupercut(clips)
  console.log(supercut)

  emit('send-supercut', supercut)

  // const videoListData = await getVideoList(query, range, cutLength)
  // const videoItems = videoListData.map(async (item) => {
  //   const videoSrc = await getVideo(item.id, query, cutLength)
  //   return videoSrc
  // });
  // let postData = await Promise.all(videoItems)
  // postData = postData.flat(1).filter(d => d != false)
  // if (postData.length == 0) return
  // urls = urls.flat(1).filter(url => url != false)
  // await Promise.all(urls.slice().map( async url => await fetch(url)))
  // let supercutUrl = await url


}

</script>

<template>
  <div class="w-full flex md:flex-row flex-col gap-2">
    <div class="flex md:block justify-between gap-2">
      <input type="text" name="query" id="input-query" v-model="query" placeholder="What are you thinking about"
        class="rounded-full px-2 py-1 flex-1 lg:min-w-96">

      <!-- <button class="md:hidden">></button> -->

      <div class="md:hidden">
        <button class="rounded-full px-2 py-0.5 text-sm border border-1 border-green-300 bg-white text-green-300"
          @click="onClick">search</button>
      </div>
    </div>

    <div class="flex flex-row gap-2 text-sm text-gray-500 px-1">
      <div>
        <label class="pe-2" for="range">Number of videos</label>
        <input type="number" name="range" id="input-range" v-model="range" aria-placeholder="Number of videos"
          class="rounded-full px-2 py-1 max-w-16">
      </div>


      <div>
        <label class="pe-2" for="cut-length">Duration of cut</label>
        <input type="number" name="cut-length" id="input-cut-length" v-model="cutLength" aria-placeholder="Duration of videos"
          class="rounded-full px-2 py-1 max-w-16">
      </div>
    </div>

    <div class="hidden md:block">
      <button class="rounded-full px-2 py-0.5 text-sm border border-1 border-green-300 bg-white text-green-300"
        @click="onClick">search</button>
    </div>


  </div>
</template>
