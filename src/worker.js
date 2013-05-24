importScripts('exiftags.js');
importScripts('jfiftags.js');
importScripts('wrapdataview.js');
importScripts('jdataview.js');
importScripts('exifextractor.js');
importScripts('jfifextractor.js');

function parseMetadata(j) {

    var exifExtractor = new ExifExtractor();
    exifExtractor.getImageData(j, postMessage);

    var jfifExtractor = new JFIFExtractor();
    jfifExtractor.findJFIF(j, postMessage);

    postMessage({
        finished: true
    });

}

onmessage = function(e) {
    parseMetadata(e.data);
};
