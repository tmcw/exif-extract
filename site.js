function over() {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    d3.event.dataTransfer.dropEffect = 'copy';
}

var exif = new exifExtractor();

d3.select('body')
    .attr('dropzone', 'copy')
    .on('drop.localgpx', function() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        var f = d3.event.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function(e) {
            exif.getImageData(reader.result);
        };

        reader.readAsBinaryString(f);
    })
    .on('dragenter.localgpx', over)
    .on('dragexit.localgpx', over)
    .on('dragover.localgpx', over);
