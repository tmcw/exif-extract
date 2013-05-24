var worker = new Worker('src/worker.js');

worker.postMessage = worker.webkitPostMessage || worker.postMessage;

worker.addEventListener('message', function(e) {
    if (e.data.thumb_src) {
        console.log(e.data.thumb_src);
    }

    if (e.data.Exif) {

        var lat = coords.fromSexagesimalRaw(
            e.data.Exif.GPSLatitude[0],
            e.data.Exif.GPSLatitude[1], 0,
            e.data.Exif.GPSLatitudeRef);

        var lon = coords.fromSexagesimalRaw(
            e.data.Exif.GPSLongitude[0],
            e.data.Exif.GPSLongitude[1], 0,
            e.data.Exif.GPSLongitudeRef);

        map.setView([lat, lon], 18);

    }
});

var map = L.mapbox.map('map', 'examples.map-4l7djmvo')
    .setView([40, -74.50], 9);

d3.select('body')
    .attr('dropzone', 'copy')
    .on('drop.localgpx', function() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        var f = d3.event.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function(e) {
            var data = reader.result;
            worker.postMessage(data, [data]);
        };

        reader.readAsArrayBuffer(f);
    })
    .on('dragenter.localgpx', over)
    .on('dragexit.localgpx', over)
    .on('dragover.localgpx', over);

function over() {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    d3.event.dataTransfer.dropEffect = 'copy';
}
