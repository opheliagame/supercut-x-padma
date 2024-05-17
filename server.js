const express = require('express')
const cors = require('cors')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const childProcess = require('child_process')
const { deleteFile } = require('./functions')
const { v1: uuidv1, v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// TODO : enable for only frontend
app.use(cors())
const port = process.env.PORT || 3001


app.get('/', (req, res) => {
  res.send('supercut x padma')
})

app.get('/partVideo', (req, res) => {
  const url = req.query.url
  const startTime = req.query.in
  const duration = req.query.duration

  try {
    res.status(206)
    res.set('Content-Type', 'video/mp4')
    ffmpeg(url)
      .seekInput(startTime)
      .duration(duration)
      .format('webm')
      .on('stderr', function(stderrLine) {
        console.log('Stderr output: ' + stderrLine);
      })
      .on('error', function(err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
      })
      .pipe(res, {end: true})
      
  } catch(error) {
    console.log(error)
  }
})

app.post('/supercut', (req, res) => {

  
  try {
    const body = req.body

    const id = uuidv4()
    const outputFile = `${process.cwd()}/data/${id}.mp4`;
    const w = 640
    const h = 480

    const inputs = []
    const filter1 = []
    const filter2 = []
    for(let i = 0; i < body.cuts.length; i++) {
      const v = body.cuts[i]
      const vinput = ['-ss', v.ss, '-t', v.duration, '-i', v.url]
      inputs.push(...vinput)

      filter1.push(`[${i}:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:-1:-1,setsar=1[v${i}];`)
      filter2.push(`[v${i}][${i}:a]`)
    }

    
    const filterComplex1 = filter1.join(' ')
    const filterComplex2 = filter2.join('')
    const filterComplex3 = `concat=n=${body.cuts.length}:v=1:a=1[v][a]`
    const streamMapping = ['-map', '[v]', '-map', '[a]']
    // removing '-fps_mode', 'vfr' to check if it works without variable framerate
    const filterComplex = ['-filter_complex', `${filterComplex1} ${filterComplex2}${filterComplex3}`]
    
    
    inputs.push(...filterComplex)
    inputs.push(...streamMapping)
    inputs.push(`${outputFile}`)

    console.log(`ffmpeg command: ${inputs.join(' ')}`)
    console.log(inputs)

    const child = childProcess.spawn('ffmpeg', inputs)

    child.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });
    
    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    child.on('close', (code, signal) => {
      console.log(`Process exited with code: ${code} ${signal}`);
      if (code === 0) {
          console.log(`FFmpeg finished successfully`);
          // res.status(206)
          res.set('Content-Type', 'video/mp4')
          fs.createReadStream(outputFile)
            .pipe(res, {end: true})
            .on('error', (error) => {
              console.log(`FS error: ${error}`)
            })
            .on('finish', () => {
              console.log(`deleting file: ${outputFile}`)
              deleteFile(outputFile)

            })


      } else {
          console.log(`FFmpeg encountered an error, check the console output`);
      }
    });


  } catch(err) {
    console.log(err)
  }
  
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})