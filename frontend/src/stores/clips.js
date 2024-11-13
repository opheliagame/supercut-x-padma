import { defineStore } from "pinia";
import { usePadmaRepositoryStore } from "./padma";
import { useQueryStore } from "./query";

export const useClipsStore = defineStore('clips', {
  state: () => {
    return {
      items: []
    }
  },
  

  actions: {
    async findClips() {
      this.setClips([])
      console.log("findClips")
      const query = useQueryStore()
      const padma = usePadmaRepositoryStore()
      const clips = await padma.searchClipsByTranscript(query.queryTranscripts, query.range)
      this.setClips(clips)
    
    },

    setClips(clips) {
      this.items = clips
    },

    
  }

})