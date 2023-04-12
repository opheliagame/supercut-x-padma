# Supercuts(x)Pad.ma :wave:


:arrow_right: searches the pad.ma archive by transcripts 

:arrow_right: returns set of videos or a single merged video, in other words, a supercut

:arrow_right: this is a dra.ft (probably gonna call all my WIPs as dra.fts from now on)

## Prerequisites :eye:

+ this tool requires node version 14 or above. If you do not have node installed or have a lower version look [here](https://nodejs.org/en/download/) for instructions 
+ since we are working with video information we also need ffmpeg to be installed, find how to do so [here](https://ffmpeg.org/download.html) 


## Usage :keyboard:

```
cd <this folder>
npm i
node index.js "SEARCH_TERM"
```

### Required Parameters 
:arrow_right: SEARCH_TERM : the keyword to search by

### Optional Parameters
:arrow_right: RANGE : upper limit for number of videos to be processed, default value is 10

:arrow_right: DURATION_LIMIT : upper limit for length or duration of each cut

:arrow_right: FOLDER_NAME : name of folder to save output

:arrow_right: FILE_NAME : name of output file

## Usage Examples :tada:

+ `node index.js SEARCH_TERM -n 200 -c 10` 

    takes cuts, with maximum duration as 10 seconds, from the first 200 search results  

+ `node index.js SEARCH_TERM -n 20 -dir FOLDER_NAME`

    takes cuts from the first 20 search results with any length and uses `FOLDER_NAME` as the output directory 

+ `node index.js SEARCH_TERM -o FILE_NAME`

    takes cuts from the first 10 search results with any length and uses `FILE_NAME` as supercut output file name (without extension), output is always in `.webm`

# LINKS OF THE AMAZING OUTPUT 
https://drive.google.com/drive/folders/1OejG6FIYhx0UNnvyhC3aLJ_p037wbEGr

## TODO :woman_technologist:

- [x] add cmd throbber
- [x] find way to shorten length of cuts
- [ ] shift to something other than request-promise
- [ ] provide more context (?) - transcript etc
- [ ] expand pad.ma search functionality 
- [ ] expand within each result search functionality - pattern matching
- [ ] use path instead of template strings for folders 

