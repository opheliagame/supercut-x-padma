/*  
    supercuts with pad.ma

    -> this is a dra.ft (probably gonna call all my WIPs as dra.fts from now on) 
    -> searches the pad.ma archive by transcripts 
    -> returns set of videos or a single merged video, in other words, a supercut
    -> for now, the length of each cut is quite big compared to a conventional supercut 

    -> required parameters 
    -> SEARCH_TERM : the keyword to search by
    
    -> optional parameters
    -> RANGE : upper limit for number of videos to be processed
    -> FOLDER_NAME : name of folder to save output
    -> FILE_NAME : name of output file

 */


const rp = require('request-promise');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { exit } = require('process');

const argv = require('minimist')(process.argv.slice(2));
const url = "https://pad.ma/api";
const media_url = "https://8.v2.pad.ma";
const SEARCH_TERM = argv._[0];
const RANGE = argv.n ?? 10;
const OUTPUT_FOLDER = 'outputs';
const FOLDER_NAME = argv.dir ?? `${SEARCH_TERM.replace(/\s+/g, "_")}-${Date.now()}`; 
const FILE_NAME = argv.o ?? SEARCH_TERM.replace(/\s+/g, "_");

var postData = {
    keys: ['title', 'id', 'date'],
    query: {
        conditions: [
            {key: 'transcripts', operator: '=', value: SEARCH_TERM},
        ],
        operator: '&',
    },
    range: [0, RANGE],
    sort: [
        {key: 'title', operator: '+'},
    ],
    // group: 'source',
};
JSON.stringify(postData)

const options = {
    method: 'POST',
    uri: url,
    body: {
        action: 'find',
        data: postData
    },
    json: true
};

const getVideoPartElement = (item, video_url) => {
    if(item.value.includes(SEARCH_TERM)) {
        let seekIn = item.in;
        let duration = item.duration;

        return new Promise((resolve, reject) => {
            var file_name = `./${OUTPUT_FOLDER}/${FOLDER_NAME}/${seekIn.toString().replace(".", "")}.webm`;
            var video_part = ffmpeg()
                            .input(video_url)
                            .inputFormat('webm')
                            .seekInput(seekIn)
                            .duration(duration)
                            .size('640x480')
                            .autopad('black')
                            .on("start", commandLine => {
                                // console.log(`Processing video: ${item.id}`);
                              })
                            .on('error', function(err) {
                                console.log('An error occurred: ' + err.message);
                                reject(err);
                            })
                            .on('end', function() {
                                // console.log('Processing finished !');
                                resolve('hello');
                            })
                            .save(file_name);
        });
    }
}


const getVideoElement = (id, data) => {
    let video_url = `${media_url}/${id}/240p1.webm?${data.streams[0]}`;    
    const videos = data.layers.transcripts.map(item => getVideoPartElement(item, video_url));
    return Promise.all(videos);
}

const getItem = (item) => {
    const getItemPostData = {
        id: item.id,
        keys: ['title', 'layers', 'streams']
    }
    JSON.stringify(getItemPostData);

    const getItemRequest = {
        method: 'POST',
        uri: url,
        body: {
            action: 'get',
            data: getItemPostData
        },
        json: true
    }

    return rp(getItemRequest)
    .then(result => getVideoElement(item.id, result.data))
    .catch(err => console.log(err))
}

if (!fs.existsSync(`./${OUTPUT_FOLDER}/${FOLDER_NAME}`)){
    fs.mkdirSync(`./${OUTPUT_FOLDER}/${FOLDER_NAME}`, { recursive: true });
}
rp(options) 
    .then(result => {
        if(result.data.items.length == 0) {
            console.log("sorry..pad.ma doesn't have anything for your search term at the moment");
            exit(0);
        }
        console.log('getting files from pad.ma..');
        const getItems = result.data.items.map((item) => getItem(item));
        return Promise.all(getItems);
    })
    .then(() => {
        let output_folder = `./${OUTPUT_FOLDER}/${FOLDER_NAME}`;
        let output_file = `${output_folder}/${FILE_NAME}@padmaSupercut.webm`;
        
        console.log(`them files are now in : ${output_folder}`);
        console.log('merging videos together..');
        const final = ffmpeg();
        
        fs.readdirSync(`${output_folder}`).forEach(file => {
            final.mergeAdd(`${output_folder}/` + file)
        });

        final.on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                console.log(`we made a (rough)supercut, wohoo! : ${output_file}`);
            })
            .mergeToFile(`${output_file}`, './');
             
    })
    .catch(err => console.log(err));