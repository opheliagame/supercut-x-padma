import { defineStore } from "pinia";
import { usePadmaRepositoryStore } from "./padma";
import { useQueryStore } from "./query";

export const useClipsStore = defineStore('clips', {
  state: () => {
    return {
      clips: [],
      supercut: null,
      transcripts: [],
    }
  },
  

  actions: {
    async findClips() {
      console.log("findClips")
      const query = useQueryStore()
      const padma = usePadmaRepositoryStore()
      const clips = await padma.searchClipsByTranscript(query.queryTranscripts, query.range)
      this.setClips(clips)
    
    },

    setClips(clips) {
      this.clips = clips
    },

    setSupercut(supercut) {
      this.supercut = supercut
    },
    
    setTranscripts(transcripts) {
      this.transcripts = transcripts
    }
  }

})