## exif-extract

Extract [EXIF](https://en.wikipedia.org/wiki/Exchangeable_image_file_format) and [JFIF](http://en.wikipedia.org/wiki/JPEG_File_Interchange_Format)
tags from images in-browser.

### example

```js
exifExtract(data, function(err, result) {
    if (err) throw err;
    if (result.position) {
        map.setView(result.position, 13);
    }
});
```

### props

Uses [jDataView](https://github.com/vjeux/jDataView) and works well with
the HTML5 Drag & Drop API. Requires FileReader and ArrayBuffer APIs.

Adapted from the implementation
[described and used by Flickr](http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/).
