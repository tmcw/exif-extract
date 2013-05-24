var worker = new Worker('src/worker.js');

worker.postMessage = worker.webkitPostMessage || worker.postMessage;

worker.addEventListener('message', function(e) {
    console.log(e.data);
});

d3.select('body')
    .attr('dropzone', 'copy')
    .on('drop.localgpx', function() {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        var f = d3.event.dataTransfer.files[0],
            reader = new FileReader();

        reader.onload = function(e) {
            var data = reader.result;
            console.log(data);
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
