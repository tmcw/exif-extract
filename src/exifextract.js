function exifExtract(data, cb) {

    var worker = new Worker('src/worker.js');

    worker.postMessage = worker.webkitPostMessage || worker.postMessage;
    worker.addEventListener('message', onMessage);
    worker.postMessage(data, [data]);

    var data = {};

    function hasPosition(exif) {
        return (typeof exif.GPSLatitude !== undefined);
    }

    function decodePosition(exif) {
        return exif.GPSLatitude && [
            coords.fromSexagesimalRaw(
                exif.GPSLatitude[0],
                exif.GPSLatitude[1], 0,
                exif.GPSLatitudeRef),
                coords.fromSexagesimalRaw(
                    exif.GPSLongitude[0],
                    exif.GPSLongitude[1], 0,
                    exif.GPSLongitudeRef)];
    }

    function onMessage(e) {
        if (e.data.type) {
            if (e.data.type == 'exif') {
                data.position = decodePosition(e.data.exif);
                data.exif = decodePosition(e.data.exif);
            }
        }
        if (e.data.finished) {
            cb(null, data);
        }
    }
}
