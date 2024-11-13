<script setup>
import SearchForm from '../components/SearchForm.vue'
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import MainSection from '../components/MainSection.vue'
import SideSection from '../components/SideSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import { useClipsStore } from '../stores/clips'

const supercutName = ref(null)
const supercutBlobUrl = ref(null)

const clips = useClipsStore()
const transcripts = clips.transcripts
</script>

<template>
  <div class="flex flex-col w-full md:h-screen">
    <AppHeader>
      <SearchForm />
    </AppHeader>

    <div
      v-if="clips.clips.length > 0"
      class="w-full h-full grid md:grid-cols-[2fr_1fr] lg:grid-cols-2 divide-x"
    >
      <MainSection
        v-bind:supercut-name="supercutName"
        v-bind:supercut-blob-url="supercutBlobUrl"
        v-bind:transcripts="transcripts"
      />

      <SideSection v-bind:clips="clips.clips" />
    </div>
    <div v-else>
      <AboutSection />
    </div>
  </div>
</template>
