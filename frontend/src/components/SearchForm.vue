<script setup>
import { ref } from 'vue'
import LoadingDots from './LoadingDots.vue'
import { useQueryStore } from '../stores/query'
import { useClipsStore } from '../stores/clips'
import { usePadmaRepositoryStore } from '../stores/padma'

const query = useQueryStore()
const clips = useClipsStore()
const padma = usePadmaRepositoryStore()

const searchForm = ref(null)
const error = ref(false)
const isClicked = ref(false)
const isFinished = ref(false)

const onInput = (e) => {
  error.value = false
  query.setQueryTranscripts(e.target.value)
}

const onClick = async (e) => {
  e.preventDefault()

  error.value = false
  isClicked.value = true
  isFinished.value = false

  console.log('search form: on click method called')
  console.log(query.queryTranscripts, query.range, query.duration)

  await clips.findClips()
  padma.createSupercut()

  if (clips.clips.length == 0) {
    error.value = true
    isFinished.value = true
  } else {
    // reset form params
    console.log('resetting params')
    query.reset()
    isClicked.value = false
    isFinished.value = true
  }
}
</script>

<template>
  <form
    @submit="onClick"
    ref="searchForm"
    class="w-full flex md:flex-row flex-col gap-2 header-text dark:inputDarkModeOverride"
  >
    <div class="flex md:block justify-between gap-2">
      <input
        type="text"
        name="query"
        id="input-query"
        :value="query.queryTranscripts"
        placeholder="What are you thinking about"
        @input="onInput($event)"
        class="dark:text-slate-400 dark:inputDarkModeOverride rounded-full px-2 py-1 flex-1 lg:min-w-96"
      />

      <!-- <button class="md:hidden">></button> -->

      <div class="md:hidden">
        <button class="header-button" @click="onClick">search</button>
      </div>
    </div>

    <div class="flex flex-row gap-2 px-1">
      <div>
        <label class="pe-2" for="range">Number of videos</label>
        <input
          type="number"
          name="range"
          id="input-range"
          :value="query.range"
          @input="query.setRange($event.target.value)"
          aria-placeholder="Number of videos"
          class="dark:text-slate-400 rounded-full px-2 py-1 max-w-16"
        />
      </div>

      <div>
        <label class="pe-2" for="cut-length">Duration of cut</label>
        <input
          type="number"
          name="cut-length"
          id="input-cut-length"
          :value="query.duration"
          @input="query.setDuration($event.target.value)"
          aria-placeholder="Duration of videos"
          class="dark:text-slate-400 rounded-full px-2 py-1 max-w-16"
        />
      </div>
    </div>

    <div class="hidden md:block">
      <button class="header-button" @click="onClick">search</button>
    </div>
  </form>

  <div v-if="isClicked && !isFinished" class="header-text">
    <p>
      You are looking for things containing some
      <span class="green-underline">{{ query.queryTranscripts }}</span
      >, that are not more than <span class="green-underline">{{ query.duration }}</span> seconds
      long, and not more than <span class="green-underline">{{ query.range }}</span> when put
      together.<LoadingDots />
    </p>
  </div>

  <div v-if="isFinished && error" class="py-2 header-text">
    <p>We came up empty. Please try again.</p>
  </div>
</template>
