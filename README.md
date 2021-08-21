# node-extract-text-from-file
Detection and text extraction supported for .DOC, .DOCX, .PDF files

uses :
- https://github.com/mwilliamson/mammoth.js/
- https://github.com/mozilla/pdfjs-dist


A browser version could also work but not implemented yet, example:
https://codesandbox.io/s/extract-any-text-from-files-8soxz?file=/src/index.js

## Usage
```bash
npm i --save node-extract-text-from-file
```

## Directly from disk file
```javascript
const { extractText } = require('node-extract-text-from-file')
/**
 * FROM FILE PATH
 */
; (async () => {
    const files = [
        __dirname + "/test-files/test1.pdf",
        __dirname + "/test-files/test2.pdf",
        __dirname + "/test-files/test1.docx"
    ];

    for (const url of files) {
        const { text, originFileType } = await extractText({ fromPath: url })
        console.log('#')
        console.log('## originFileType : ' + originFileType)
        console.log('## text :')
        console.log(text)
        console.log('\n')
    }
})();
```


## ... or from url
```javascript
const { extractText } = require('node-extract-text-from-file')
/**
 * FROM URL
 */
; (async () => {
    const files = [
        "https://vvg-video.s3.eu-west-1.amazonaws.com/test1.pdf",
        "https://vvg-video.s3.eu-west-1.amazonaws.com/respondus-docx-sample-file_0.docx",
        "https://vvg-dump.s3.eu-west-3.amazonaws.com/01ad4feadf1e814c1ea9fa9fabe54a5b.pdf"
    ];

    for (const url of files) {
        const { text, originFileType } = await extractText({ fromUrl: url })
        console.log('#')
        console.log('## originFileType : ' + originFileType)
        console.log('## text :')
        console.log(text)
        console.log('\n')
    }
})();
```