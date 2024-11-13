import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'

const ffmpeg = new FFmpeg({ log: true })
ffmpeg.on('log', ({ message: msg }) => {
  console.log(msg)
})
ffmpeg.on('progress', ({ progress, time }) => {
  const progressMessage = `${progress * 100} % (transcoded time: ${time / 1000000} s)`;
  console.log(progressMessage)
});

async function getVideoMetadata(url) {
  const response = await fetch(url, { method: 'HEAD', mode: 'cors' })
  const contentLength = response.headers.get('Content-Length')
  return { contentLength: parseInt(contentLength, 10) }
}

function calculateTimeFromBytes(totalBytes, totalDuration, startByte, endByte) {
  const startTime = (startByte / totalBytes) * totalDuration
  const endTime = (endByte / totalBytes) * totalDuration
  return { startTime, endTime }
}
function calculateByteRange(totalBytes, totalDuration, startTime, duration) {
  const startByte = Math.floor((startTime / totalDuration) * totalBytes)
  const endByte = Math.floor(((startTime + duration) / totalDuration) * totalBytes)
  return { startByte, endByte }
}

async function fetchVideoSegment(url, startByte, endByte) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Range: `bytes=${startByte}-${endByte}`
    }
  })
  return new Uint8Array(await response.arrayBuffer())
}

async function executeFFmpegCommand(cuts, inputs, filterComplex, streamMapping, outputFile) {
  console.log('Executing ffmpeg command')
  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    })
  }

  console.log('FFmpeg loaded:', ffmpeg.loaded)
  console.log('Input files:', cuts)
  console.log('Loading files')
  // Load input files into ffmpeg FS
  for (let i = 0; i < cuts.length; i++) {
    let inputFile = cuts[i].url
    let startTime = cuts[i].ss

    let duration = cuts[i].duration

    let totalDuration = cuts[i].totalDuration

    // const fileData = await fetchFile(inputFile)

    const { contentLength } = await getVideoMetadata(inputFile)
    // Step 2: Calculate byte range
    const { startByte, endByte } = calculateByteRange(
      contentLength,
      totalDuration,
      startTime,
      duration
    )
    // Step 3: Fetch the video segment
    const segmentHeader = await fetchVideoSegment(inputFile, 0, 1048575)
    const segmentBuffer = await fetchVideoSegment(inputFile, startByte, endByte)
    const segmentData = new Uint8Array(segmentHeader.length + segmentBuffer.length)
    segmentData.set(segmentHeader, 0)
    segmentData.set(segmentBuffer, segmentHeader.length)

    await ffmpeg.writeFile(`${i}-header.webm`, segmentHeader)
    await ffmpeg.writeFile(`${i}-segment.webm`, segmentBuffer)
    await ffmpeg.writeFile(`${i}-combined.webm`, segmentData)

    // scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1,setsar=1"
    // -vf scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1,setsar=1,fps=30
    // const ffmpegCommand = `-i ${i}-combined.webm -vf scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1,setsar=1,fps=30 -pix_fmt yuv420p -c:v libx264 -preset fast -crf 10 -c:a copy -ar 44100 -t ${duration} output${i}.mp4`
    // const ffmpegCommand = `-i ${i}-combined.webm -vf scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1,setsar=1,fps=30 -t ${parseFloat(duration).toFixed(2)} output${i}.mp4`
    // const ffmpegCommand = `-i ${i}-combined.webm -vf scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1,setsar=1 output${i}.mp4`
    // const ffmpegCommand = `-i ${i}-combined.webm -t ${duration} output${i}.mp4`
    // console.log(ffmpegCommand.split(' '))
    
    // await ffmpeg.exec(ffmpegCommand.split(' '))


  }

  inputs.push(...filterComplex)
  inputs.push(...streamMapping)
  inputs.push(`${outputFile}`)

  // ffmpeg -i output0.mp4 -i output1.mp4 -i output2.mp4 -i output3.mp4 -i output4.mp4 -i output5.mp4 -i output6.mp4 -i output7.mp4 \
  // -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0][3:v:0][3:a:0][4:v:0][4:a:0][5:v:0][5:a:0][6:v:0][6:a:0][7:v:0][7:a:0]concat=n=8:v=1:a=1[outv][outa]" \
  // -map "[outv]" -map "[outa]" final_output.mp4

  // const inputFiles = cuts.map((_, i) => `-i output${i}.mp4`)
  // const filterComplex1 = cuts.map((_, i) => `[${i}:v:0][${i}:a:0]`)
  // const filterComplex2 = `concat=n=${cuts.length}:v=1:a=1[outv][outa]`
  // const filter = `-filter_complex ${filterComplex1.join('')}${filterComplex2} -map [outv] -map [outa]`
  // const ffmpegCommand = `${inputFiles.join(' ')} ${filter} final_output.mp4`

  // console.log(`ffmpeg command: ${ffmpegCommand}`)
  // console.log(ffmpegCommand.split(' '))
  // await ffmpeg.exec(ffmpegCommand.split(' '))

  // Execute ffmpeg command
  await ffmpeg.exec(inputs)

  console.log("ffmpeg command executed")

  // Retrieve the output file
  const data = await ffmpeg.readFile(outputFile)

  // Create a URL for the output file
  const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
  console.log(`Video URL: ${videoUrl}`)

  return videoUrl
}

async function combineCuts(cuts) {
  console.log('Combining cuts:', cuts)
  const uniqueFiles = [...new Set(cuts.map((cut) => cut.url))]
  const cutsGroupedByFile = uniqueFiles.map((file) => cuts.filter((cut) => cut.url === file))

  console.log('Cuts grouped by file:', cutsGroupedByFile)

  // const id = uuidv4()
  const id = 'output'
  const outputFile = `${id}.mp4`
  const w = 640
  const h = 480

  const inputs = []
  const filter1 = []
  const filter2 = []
  for (let i = 0; i < cuts.length; i++) {
    const { contentLength } = await getVideoMetadata(cuts[i].url)
    const { startTime, endTime } = calculateTimeFromBytes(contentLength, cuts[i].totalDuration, 0, 1048575)
    const v = cuts[i]
    const vinput = [
      '-ss',
      // parseFloat(v.ss).toFixed(2),
      startTime.toFixed(2),
      '-t',
      parseFloat(v.duration).toFixed(2),
      '-i',
      `${i}-combined.webm`
    ]
    inputs.push(...vinput)

    filter1.push(
      `[${i}:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:-1:-1,setsar=1[v${i}];`
    )
    filter2.push(`[v${i}][${i}:a]`)
  }

  const filterComplex1 = filter1.join(' ')
  const filterComplex2 = filter2.join('')
  const filterComplex3 = `concat=n=${cuts.length}:v=1:a=1[v][a]`
  const streamMapping = ['-map', '[v]', '-map', '[a]']
  // removing '-fps_mode', 'vfr' to check if it works without variable framerate
  const filterComplex = ['-filter_complex', `${filterComplex1} ${filterComplex2}${filterComplex3}`]

  try {
    const videoUrl = await executeFFmpegCommand(
      cuts,
      inputs,
      filterComplex,
      streamMapping,
      outputFile
    )
    console.log('Video processing complete:', videoUrl)
    return videoUrl
  } catch (error) {
    console.error('Error processing video:', error)
  }
}

export { combineCuts }
