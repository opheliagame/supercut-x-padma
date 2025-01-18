<script setup>
import SearchForm from '../components/SearchForm.vue'
import AppHeader from '../components/AppHeader.vue'
import MainSection from '../components/MainSection.vue'
import SideSection from '../components/SideSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import { useClipsStore } from '../stores/clips'


const clips = useClipsStore()

</script>

<template>
  <div class="flex flex-col w-full h-screen bg-knit-pattern">
    <AppHeader>
      <SearchForm />
    </AppHeader>


    <!-- class="w-full h-full grid md:grid-cols-[2fr_1fr] lg:grid-cols-2 divide-x" -->

    <div v-if="clips.items.length > 0" 
      class="w-full h-full">
      <MainSection `/>

      <!-- <SideSection v-bind:clips="clips.items" /> -->
    </div>
    <div v-else>
      <AboutSection />
    </div>
  </div>
</template>
