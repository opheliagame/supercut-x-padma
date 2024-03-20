const PADMA_API_URL = "https://pad.ma/api"
const PADMA_MEDIA_URL = "https://media.v2.pad.ma"
const API_URL = "http://localhost:3001"

export const find = async (query, range, cutLength) => {
  const postData = {
    action: "find",
    data: {
      keys: ["id", "title"],
      query: {
        conditions: [
          { key: "transcripts", operator: "=", value: query },
        ],
        operator: "&",
      },
      range: [0, range],
      sort: [
        { key: "title", operator: "+" },
      ],
    }
  }

  try {
    const response = await fetch(PADMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    })

    const result = await response.json()
    if (result.status.code == 200) {
      const items = result.data.items
      return items
    }
    else {
      throw Error("an unexpected error occured")
    }
  } catch (e) {
    throw e;
  }
}

export const get = async (id, query, duration) => {
  const postData = {
    action: "get",
    data: {
      id: id,
      keys: ["id", "title", "layers", "streams", "modified"]
    }
  }

  try {
    const response = await fetch(PADMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    })

    const result = await response.json()
    if (result.status.code == 200) {
      const id = result.data.id
      const title = result.data.title
      const modified = result.data.modified
      const streams = result.data.streams
      const layers = result.data.layers
      const transcripts = layers.transcripts
      const keywords = layers.keywords

      const items = transcripts
        .filter(t => t.value.includes(query) && t.duration <= duration)
        .map(t => {
          return {
            id: id,
            title: title,
            transcript: t.value,
            keywords: keywords.map(k => k.value),
            url: `${PADMA_MEDIA_URL}/${id}/240p1.webm`,
            ss: t.in,
            duration: t.duration,
          }
        })

      return items;
    }
    else {
      throw Error("an unexpected error occured")
    }
  } catch (e) {
    throw e;
  }
}

export const createSupercut = async (clips) => {
  let items = clips
    .map(t => {
      return {
        url: t.url,
        ss: t.ss,
        duration: t.duration,
      }
    })

  const postData = {
    cuts: items
  }

  const url = fetch(`${API_URL}/supercut`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData)
  })
    .then((response) => {
      const reader = response.body.getReader()
      return new ReadableStream({
        start(controller) {
          return pump()
          function pump() {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }
              controller.enqueue(value)
              return pump()
            })
          }
        }
      })

    })
    .then((stream) => new Response(stream))
    .then((response) => response.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((url) => url)
    .catch((error) => console.log(error))

  return (await url)

}

const getVideoList = async (query, range, cutLength) => {
  const postData = {
    keys: ['title', 'id', 'date'],
    query: {
      conditions: [
        { key: 'transcripts', operator: '=', value: query },
      ],
      operator: '&',
    },
    range: [0, range],
    sort: [
      { key: 'title', operator: '+' },
    ],
    // group: 'source',
  };

  const response = await fetch(PADMA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: 'find',
      data: (postData)
    }),
  });


  // TODO check status code

  const data = (await response.json()).data.items
  return data
}

const getVideoInfo = async (id) => {
  const postData = {
    id: id,
    keys: ['title', 'layers', 'streams', 'modified']
  }

  const response = await fetch(PADMA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: 'get',
      data: (postData)
    }),
  });

  // TODO check status 
  const data = (await response.json()).data
  return data
}


const getVideoCut = async (v, videoUrl, query, cutLength) => {
  const condition =
    cutLength != 0 ?
      v.value.includes(query) && v.duration < cutLength :
      v.value.includes(query)

  if (!condition) return false

  const seekIn = v.in
  const duration = v.duration

  // console.log(`${videoUrl}, ${v.in}, ${v.duration}`)
  // const apiVideoUrl = `${API_URL}/supercut?url=${encodeURIComponent(videoUrl)}&in=${encodeURIComponent(v.in)}&duration=${encodeURIComponent(v.duration)}`
  // return apiVideoUrl

  return {
    url: videoUrl,
    ss: seekIn,
    duration: duration,
  }

}


const getVideo = async (id, query, cutLength) => {
  const videoInfo = await getVideoInfo(id)

  // const videoUrl = `${PADMA_MEDIA_URL}/${id}/240p1.webm?${videoInfo.modified}`
  const videoUrl = `${PADMA_MEDIA_URL}/${id}/240p1.webm`
  const videoCutUrls = videoInfo.layers.transcripts.map((v) => {
    return getVideoCut(v, videoUrl, query, cutLength)

  });
  // const videoCut = getVideoCut(id, videoInfo)

  return Promise.all(videoCutUrls)
}