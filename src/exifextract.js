function exifExtract(data, cb) {

    var worker = new Worker('src/worker.js');

    worker.postMessage = worker.webkitPostMessage || worker.postMessage;
    worker.addEventListener('message', onMessage);
    worker.postMessage(data, [data]);

    var resp = {};

    function hasPosition(exif) {
        return (typeof exif.GPSLatitude !== undefined);
    }

    function decodePosition(exif) {
        return exif.GPSLatitude && [
            coords.fromSexagesimalRaw(
                exif.GPSLatitude[0],
                exif.GPSLatitude[1],
                exif.GPSLatitude[2],
                exif.GPSLatitudeRef),
            coords.fromSexagesimalRaw(
                exif.GPSLongitude[0],
                exif.GPSLongitude[1],
                exif.GPSLongitude[2],
                exif.GPSLongitudeRef)
        ];
    }

    function onMessage(e) {
        if (e.data.type) {
            if (e.data.type == 'exif') {
                resp.position = decodePosition(e.data.exif);
                resp.exif = decodePosition(e.data.exif);
            }

            if (e.data.type == 'thumbnail') {
                resp.thumbnail = e.data.thumb_src;
            }

            if (e.data.type == 'error') {
                cb(e.data.msg);
            }
        }

        if (e.data.finished) {
            cb(null, resp);
        }
    }
}
