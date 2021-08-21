// import mammoth from "mammoth"; // for docx
// import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.js";
// import fetch from "node-fetch"
// import * as pdfjs from "pdfjs-dist/legacy/build/pdf.js";

const mammoth = require("mammoth")
const fetch = require("node-fetch")
require("pdfjs-dist/lib/examples/node/domstubs.js").setStubs(global)

const pdfjs = require("pdfjs-dist/legacy/build/pdf.js")

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const HEADER_MAPPING = {
  d0cf11e0: "doc-docx",
  "504b34": "doc-docx",
  "25504446": "pdf"
};

function getFileTypeFromArrayBuffer(buffer) {
    return new Promise((resolve) => {
        var arr = new Uint8Array(buffer).subarray(0, 4);
        var header = "";
        for (var i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }
        resolve(HEADER_MAPPING[header] || header);
    });
}


function removeURLS(str) {
  return str.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
}

function removeWordsLessThan3(str) {
  return str.replace(/(\b(\w{1,3})\b(\W|$))/g, "");
}

function removeDoubleSpace(str) {
  return str.replace(/ +(?= )/g, "");
}
function removeNewLines(str) {
  return str.replace(/\n/g, " ");
}

function cleanOutput(str) {
  return removeDoubleSpace(
    removeNewLines(removeURLS(str))
  );
}

// Extract PDF CDN  version
/* async function extractPDF(arrayBuffer) {
  return new Promise(async (resolve) => {
    const script = document.createElement("script");
    script.src = "//mozilla.github.io/pdf.js/build/pdf.js";
    document.body.appendChild(script);
    script.onload = async () => {
      var pdfjsLib = window["pdfjs-dist/build/pdf"];
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "//mozilla.github.io/pdf.js/build/pdf.worker.js";
      //console.log(response.headers.get("content-type"));
      //let pdfParser = new PDFParser();
      //console.log(arrayBuffer);

      let doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
        return (await (await doc.getPage(i + 1)).getTextContent()).items
          .map((token) => token.str)
          .join(" ");
      });
      const text = (await Promise.all(pageTexts)).join("");
      resolve(text);
    };
  });
} */
async function extractPDF(arrayBuffer) {
  let doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
    return (await (await doc.getPage(i + 1)).getTextContent()).items
      .map((token) => token.str)
      .join(" ");
  });
  const text = (await Promise.all(pageTexts)).join("");
  return text;
}

// Extract DOCX
async function extractDOCX(arrayBuffer) {
  // return (await mammoth.extractRawText({ buffer: arrayBuffer })).value;
  const WordExtractor = require("word-extractor"); 
  const extractor = new WordExtractor();
  return (await extractor.extract(arrayBuffer)).getBody()
  
  // extracted.then(function(doc) { console.log(doc.getBody()); });
}


async function detectAndExtractText({ fromUrl, fromPath }) {
    let buffer, originFileType

    if (fromUrl) {
      buffer = await (await fetch(fromUrl)).buffer();
      // console.log(buffer)
    }
    const fsPromises = require('fs').promises
    if (fromPath) {
        buffer = await fsPromises.readFile(fromPath)
        // console.log(buffer)
        // process.exit()
    }
    if ((await getFileTypeFromArrayBuffer(buffer)) == "pdf") {
        originFileType = "pdf"
        // console.log("");
        // console.log("PDF :");
        output = await extractPDF(buffer);
    }
    if ((await getFileTypeFromArrayBuffer(buffer)) == "doc-docx") {
        originFileType = "doc-docx"
        // console.log("");
        // console.log("DOCX :");
        output = await extractDOCX(buffer);
    }
    return {
        text: cleanOutput(output),
        originFileType
    }
}

module.exports = {
    detectAndExtractText
}