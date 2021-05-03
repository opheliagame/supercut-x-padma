# Supercuts(x)Pad.ma


:arrow_right: searches the pad.ma archive by transcripts 

:arrow_right: returns set of videos or a single merged video, in other words, a supercut

:arrow_right: this is a dra.ft (probably gonna call all my WIPs as dra.fts from now on)


## Usage

```
cd <this folder>
npm i
node index.js "SEARCH_TERM"
```

### Required Parameters 
:arrow_right: SEARCH_TERM : the keyword to search by

### Optional Parameters
:arrow_right: RANGE : upper limit for number of videos to be processed

:arrow_right: FOLDER_NAME : name of folder to save output

:arrow_right: FILE_NAME : name of output file

## Usage Examples

+ `node index.js SEARCH_TERM -n 20` 

    takes cuts from a maximum of 20 search results 

+ `node index.js SEARCH_TERM -n 20 -dir FOLDER_NAME`

    uses `FOLDER_NAME` as the output directory

+ `node index.js SEARCH_TERM -o FILE_NAME`

    uses `FILE_NAME` as supercut output file name (without extension), output is always in `.webm`


## TODO

- [ ] add cmd throbber
- [ ] find way to shorten length of cuts
- [ ] provide more context (?) - transcript etc
- [ ] expand pad.ma search functionality 
- [ ] expand within each result search functionality - pattern matching
- [ ] use path instead of template strings for folders 

