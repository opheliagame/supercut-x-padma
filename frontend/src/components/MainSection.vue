<script setup>
import { useClipsStore } from '../stores/clips'
import DynamicVideo from './DynamicVideo.vue'

const clips = useClipsStore()


</script>

<template>
  <div class="h-full w-full flex flex-col justify-center md:block">
    <DynamicVideo />
  </div>



  <div class="hidden h-full flex flex-col gap-4 md:gap-8 px-6 lg:px-12 py-4 overflow-hidden">
    <div class="flex flex-col gap-2 md:gap-4">

      <!-- <div v-if="props.supercutName">
        <h1 class="text-sm text-green-400 font-bold uppercase">{{ props.supercutName }}</h1>
      </div>
      <video v-if="props.supercutBlobUrl" :src="props.supercutBlobUrl" controls></video>
      <div v-else>
        Cutting you a supercut
        <LoadingDots character="✂" />
      </div> -->
    </div>

    <!-- <div class="flex flex-col gap-2 md:gap-4"> -->
    <!-- <div class="flex flex-row gap-2 items-center">
        <div class="w-4 h-4 rounded-full bg-green-400"></div>
        <h2 class="text-sm uppercase">Transcript</h2>
      </div>
      <div class="md:overflow-y-auto">
        <div :key="clip" v-for="clip in clips">
          <p>{{ clip.transcript }}</p>
        </div>
      </div> -->
    <!-- </div> -->
  </div>


</template>