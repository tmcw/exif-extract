importScripts('tags.js');
importScripts('jdataview.js');
importScripts('exifextractor.js');
importScripts('jfifextractor.js');
importScripts('xmpextractor.js');

var self = this;

function parseMetadata(j) {
    var k = new ExifExtractor();
    k.getImageData(j, postMessage);
    // var l = new XMPExtractor();
    // l.findXMP(j, postMessage);
    var h = new JFIFExtractor();
    h.findJFIF(j, postMessage);
    self.postMessage({
        finished: true
    });
}

onmessage = function(e) {
    parseMetadata(e.data);
};
