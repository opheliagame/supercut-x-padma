<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps(['clips'])

const isEmpty = ref(false)

watchEffect(() => {
  isEmpty.value = props.clips.length == 0
})
</script>

<template>
  <div class="h-full">
    <div class="flex flex-row gap-2 items-center px-6 md:py-2">
      <div class="w-4 h-4 rounded-full bg-green-400"></div>
      <h2 class="text-sm uppercase">Playlist</h2>
    </div>

    <div class="h-full md:overflow-y-auto">
      <div :key="clip" v-for="clip in clips" class="grid lg:grid-cols-[1fr_2fr] gap-x-4 px-6 py-4">
        <video crossorigin="anonymous" :src="clip.url" controls></video>

        <div class="flex flex-col gap-2 justify-between">
          <p class="">{{ clip.title }}</p>
          <div>
            <p v-if="clip.keywords.length > 0">Keywords - {{ clip.keywords.join(', ') }}</p>
            <div class="flex justify-end">
              <a :href="clip.url" target="_blank" class="text-xs underline decoration-blue-400"
                >watch on Pad.ma</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
