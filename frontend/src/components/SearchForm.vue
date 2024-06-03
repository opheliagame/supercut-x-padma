<script setup>
import { ref, watchEffect } from 'vue';
import { find, get, createSupercut } from '../api'
import LoadingDots from './LoadingDots.vue'

const emit = defineEmits(['send-supercut-name', 'send-supercut-url', 'send-videos', 'send-transcripts'])

const searchForm = ref(null)
const query = ref('')
const range = ref(2)
const cutLength = ref(10)
const error = ref(false)
const isClicked = ref(false)
const isFinished = ref(false)

const onInput = (e) => {
  error.value = false
}

const onClick = async (e) => {
  e.preventDefault()
  
  error.value = false
  isClicked.value = true
  isFinished.value = false
  emit('send-videos', [])
  emit('send-transcripts', [])
  emit('send-supercut-name', null)
  emit('send-supercut-url', null)

  if(query.value.trim().length == 1) return

  query.value = query.value.toLowerCase()
  console.log("search form: on click method called")
  console.log(query.value, range.value, cutLength.value)

  const videos = await find(query.value, range.value, cutLength.value)
  console.log(videos)

  let clips = await Promise.all(videos.map(v => get(v.id, query.value, cutLength.value)))
  clips = clips.flat(1)
  console.log(clips)

  if(clips.length == 0) {
    error.value = true
    isFinished.value = true
  }
  else {
    emit('send-supercut-name', query.value)
    // reset form params
    console.log("resetting params")
    query.value = ''
    range.value = 2
    cutLength.value = 10
    isClicked.value = false
    isFinished.value = true
  }
  emit('send-videos', clips)

  let transcripts = clips.map(c => c.transcript)
  console.log("here")
  console.log(transcripts)
  emit('send-transcripts', transcripts)

  const supercut = await createSupercut(clips)
  console.log(supercut)

  emit('send-supercut-url', supercut)

}

</script>

<template>
  <form @submit="onClick" ref="searchForm" class="w-full flex md:flex-row flex-col gap-2 header-text dark:inputDarkModeOverride">
    <div class="flex md:block justify-between gap-2">
      <input type="text" name="query" id="input-query" v-model="query" placeholder="What are you thinking about"
        @input="onInput"
        class="dark:text-slate-400 dark:inputDarkModeOverride rounded-full px-2 py-1 flex-1 lg:min-w-96">

      <!-- <button class="md:hidden">></button> -->

      <div class="md:hidden">
        <button class="header-button"
          @click="onClick">search</button>
      </div>
    </div>

    <div class="flex flex-row gap-2 px-1">
      <div>
        <label class="pe-2" for="range">Number of videos</label>
        <input type="number" name="range" id="input-range" v-model="range" aria-placeholder="Number of videos"
          class="dark:text-slate-400 rounded-full px-2 py-1 max-w-16">
      </div>


      <div>
        <label class="pe-2" for="cut-length">Duration of cut</label>
        <input type="number" name="cut-length" id="input-cut-length" v-model="cutLength" aria-placeholder="Duration of videos"
          class="dark:text-slate-400 rounded-full px-2 py-1 max-w-16">
      </div>
    </div>

    <div class="hidden md:block">
      <button class="header-button"
        @click="onClick">search</button>
    </div>

  </form>

  <div v-if="isClicked && !isFinished" class="header-text">
    <p>You are looking for things containing some 
    <span class="green-underline">{{ query }}</span>, that are not more than 
    <span class="green-underline">{{ cutLength }}</span> seconds long, and not more than 
    <span class="green-underline">{{ range }}</span> when put together.<LoadingDots />
    </p>
  </div>

  <div v-if="isFinished && error" class="py-2 header-text">
    <p>We came up empty. Please try again.</p>
  </div>
</template>
