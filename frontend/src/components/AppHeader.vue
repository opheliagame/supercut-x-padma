<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'

const title = 'Sequince'
// const titleRef = useTemplateRef('title')
const repeatedTitle = ref(title.repeat(10))

onMounted(() => {
  // const titleWidth = titleRef.value.offsetWidth
  
  setInterval(() => {
    const newValue = repeatedTitle.value.slice(1) + repeatedTitle.value[0]
    repeatedTitle.value = newValue

  }, 2000);

})



</script>


<template>
  <div class="w-full py-4 bg-blue-800 flex flex-col gap-y-2">
    <div class="overflow-clip">
      <h1 class="font-display text-white text-5xl uppercase font-bold">
        {{ repeatedTitle }}
      </h1>
    </div>
    
    <slot />
  </div>

</template>