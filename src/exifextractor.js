function ExifExtractor() {
    var h = new exifTags();

    function parseExif(j) {
        var m = [], i;

        if (j.getByteAt(0) != 255 || j.getByteAt(1) != 216) {

            self.postMessage({
                type: 'error',
                msg: 'ERROR: Not a valid JPEG'
            });

        } else {

            var l = 2,
                k = j.length;

            while (l < k) {

                self.postMessage({
                    msg: 'Looking for Exif tag at: ' + l + ' less than length: ' + k
                });

                if (j.getByteAt(l) != 255) {
                    self.postMessage({
                        type: 'error',
                        msg: 'ERROR: Not a valid marker at offset ' + l + ', found: ' + j.getByteAt(l)
                    });
                    break;
                }

                i = j.getByteAt(l + 1);

                if (i == 225) {
                    self.postMessage({
                        msg: 'Found 0xFFE1 marker (Exif) : ' + i
                    });
                    f(j, l + 4, j.getShortAt(l + 2, true) - 2);
                    break;
                } else {
                    if (i == 224) {
                        self.postMessage({
                            msg: 'Found OxFFE0 Marker (JFIF) : ' + i
                        });
                        l = 20;
                    } else {
                        self.postMessage({
                            msg: 'Did Not Found 0xFFE1 marker : ' + i
                        });
                        l += 2 + j.getShortAt(l + 2, true);
                    }
                }
            }

        }
    }
    function f(m, j, l) {
        var i,
            o = j + 6;

        if (m.getStringAt(j, 4) != 'Exif') {
            self.postMessage({
                msg: 'Not valid Exif data! ' + m.getStringAt(j, 4)
            });
            return false;
        }

        if (m.getShortAt(o) == 18761) {
            i = true;
            self.postMessage({
                msg: '----Yes Little Endian'
            });
        } else {
            if (m.getShortAt(o) == 19789) {
                i = false;
                self.postMessage({
                    msg: '----Not Little Endian'
                });
            } else {
                self.postMessage({
                    msg: 'Not valid TIFF data! (no 0x4949 or 0x4D4D)' + m.getShortAt(o)
                });
                return false;
            }
        }

        if (m.getShortAt(o + 2, i) != 42) {
            self.postMessage({
                msg: 'Not valid TIFF data! (no 0x002A) : ' + m.getShortAt(o + 2, i)
            });
            return false;
        }

        if (m.getLongAt(o + 4, i) != 8) {
            self.postMessage({
                msg: 'Not valid TIFF data! (First offset not 8) : ' + m.getShortAt(o + 4, i)
            });
            return false;
        }

        var p = h.readTags(m, o, o + 8, h.Exif.TiffTags, i);

        if (p.ExifIFDPointer) {
            var n = h.readTags(m, o, o + p.ExifIFDPointer, h.Exif.Tags, i);
            for (var q in n) {
                switch (q) {
                  case 'LightSource':
                  case 'Flash':
                  case 'MeteringMode':
                  case 'ExposureProgram':
                  case 'SensingMethod':
                  case 'SceneCaptureType':
                  case 'SceneType':
                  case 'CustomRendered':
                  case 'WhiteBalance':
                  case 'GainControl':
                  case 'Contrast':
                  case 'Saturation':
                  case 'Sharpness':
                  case 'SubjectDistanceRange':
                  case 'FileSource':
                    n[q] = h.Exif.StringValues[q][n[q]];
                    break;

                  case 'ExifVersion':
                  case 'FlashpixVersion':
                    n[q] = String.fromCharCode(n[q][0], n[q][1], n[q][2], n[q][3]);
                    break;

                  case 'ComponentsConfiguration':
                    n[q] = h.Exif.StringValues.Components[n[q][0]] +
                        h.Exif.StringValues.Components[n[q][1]] +
                        h.Exif.StringValues.Components[n[q][2]] +
                        h.Exif.StringValues.Components[n[q][3]];
                    break;
                }
                p[q] = n[q];
            }
        }

        if (p.GPSInfoIFDPointer) {
            var k = h.readTags(m, o, o + p.GPSInfoIFDPointer, h.Exif.GPSTags, i);
            for (var q in k) {
                switch (q) {
                  case 'GPSVersionID':
                    k[q] = k[q][0] + '.' + k[q][1] + '.' + k[q][2] + '.' + k[q][3];
                    break;
                }
                p[q] = k[q];
            }
        }

        if (p.IFD1Offset) {
            IFD1Tags = h.readTags(m, o, p.IFD1Offset + o, h.Exif.TiffTags, i);
            self.postMessage({
                msg: IFD1Tags
            });
            if (IFD1Tags.JPEGInterchangeFormat) {
                extractThumbnail(m, IFD1Tags.JPEGInterchangeFormat, IFD1Tags.JPEGInterchangeFormatLength, o, i);
            } else {
                self.postMessage({
                    msg: 'No thumbnail location marker found!'
                });
            }
        }

        postMessage({
            type: 'exif',
            exif: p
        });
    }

    function extractThumbnail(j, m, o, q, p) {

        if (j.length < m + q + o) {
            self.postMessage({
                msg: 'The thumbnail falls outside the available data!'
            });
            return;
        }

        var n = j.getBytesAt(m + q, o),
            l = [];

        for (var k in n) {
            if (n[k] < 16) {
                l[k] = '0' + n[k].toString(16);
            } else {
                l[k] = n[k].toString(16);
            }
        }

        self.postMessage({
            type: 'thumbnail',
            thumb_src: 'data:image/jpeg,%' + l.join('%')
        });
    }

    this.getImageData = function(j) {
        dataview = wrapDataView(new jDataView(j));
        dataview.length = j.byteLength;
        parseExif(dataview);
    };
}
