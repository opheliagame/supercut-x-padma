const ffmpeg = require('fluent-ffmpeg')

ffmpeg()
  .duration(10)
  .input('https://video16.pad.ma/BZX/240p1.mp4')
  .seekInput(0)
  .duration(10)
  .input('https://video16.pad.ma/BZX/240p1.mp4')
  .seekInput(100)
  .mergeToFile('output.mp4')
  .on('start', (commandline) => {
    console.log(`Spawned ffmpeg with command: ${commandline}`)
  })
  .on('stderr', function(stderrLine) {
    console.log('Stderr output: ' + stderrLine);
  })
  .on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message);
  })


  // ffmpeg -ss 0 -t 10 -i https://video16.pad.ma/BZX/240p1.mp4 -ss 100 -t 10 -i https://video16.pad.ma/BHM/240p1.mp4 -filter_complex concat=n=2:v=1:a=1 output.mp4 
  // ffmpeg -ss 0 -t 10 -i https://video16.pad.ma/BZX/240p1.mp4 -ss 100 -t 10 -i https://video16.pad.ma/BHM/240p1.mp4 -ss 12 -t 20 -i https://video16.pad.ma/KGF/240p1.mp4 -filter_complex '[0:v]scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1,setsar=1[v0]; [1:v]scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1,setsar=1[v1]; [2:v]scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1,setsar=1[v2]; [v0][0:a][v1][1:a][v2][2:a]concat=n=3:v=1:a=1[v][a]' -map [v] -map [a] -fps_mode vfr output.mp4 