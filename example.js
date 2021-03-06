const { extractText } = require('./index')

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

/**
 * FROM FILE PATH
 */
; (async () => {
    const files = [
        __dirname + "/test-files/test1.pdf",
        __dirname + "/test-files/test2.pdf",
        __dirname + "/test-files/test1.docx",
        __dirname + "/test-files/test3.doc"
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
