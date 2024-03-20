<script setup>
import { ref, watchEffect } from 'vue';


const props = defineProps({
  supercutBlobUrl: {
    type: String
  },
  transcripts: {
    type: Array
  }
})

const transcripts = ref([])

watchEffect(() => {
  transcripts.value = props.transcripts
})

</script>

<template>
  <div class="flex flex-col gap-4 md:gap-8 px-6 lg:px-12 py-4 overflow-hidden">
    <div>
      <video :src="props.supercutBlobUrl" controls></video>

    </div>

    <div class="flex flex-col gap-2 md:gap-4">
      <div class="flex flex-row gap-2 items-center">
        <div class="w-4 h-4 rounded-full bg-green-400"></div>
        <h2 class="text-sm uppercase">Transcript</h2>
      </div>
      <div class="overflow-y-scroll">
        <div v-for="transcript in transcripts">
          <p>{{ transcript }}</p>
          <!-- <p>Int. Aliya's bedroom - night. Aliya is on her bed, with the laptop on her lap, in a Skype call with her mother.
          They speak in Arabic.
          AlIYA'S MOTHER
          It's unheard of! They're saying I have to go back to Egypt to get a visa! AliYA But that's ridiculous! Surely
          there must be a way. ALIYA'S MOTHERI'll have to wait for another week to find out! ALIYA Another week? There's
          no way you'll make it before they remove the bandages! ALIYA'S MOTHER This can't be happening to us! Your dad
          made some phone calls. Let's see what happens.ALIYA Or I'll take the next flight back home as soon as I'm done
          here. And anyways who knows, it's only the third attempt. ALIYA'S MOTHER Hey don't say that! That wasn't the
          best time in our country with all the religious arguments around transplants. It's going to be right this time,
          my child. You are going to get everything you wish. Aliya doesn't respond. They watch each other in silence.</p> -->
        </div>
      </div>

    </div>


  </div>
</template>