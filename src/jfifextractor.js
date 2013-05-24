function JFIFExtractor() {
    var g = 0, e, f = {};

    this.findJFIF = function(k, p) {

        var i, m, r,
            l = [],
            q = {},
            h, j,
            o = false,
            n = false;

        e = new jDataView(k);
        e.getByteAt = dataview.getUint8;
        e.getShortAt = dataview.getUint16;
        e.length = k.byteLength;

        while (g + 2 < e.length) {
            if (e.getShortAt(g, false) == 65517) {
                self.postMessage({
                    msg: 'Found APP 14 Marker at: ' + g
                });
                n = true;
                break;
            }
            g += 2;
        }

        if (g >= e.length || !n) return;

        g += 2;
        j = e.getShortAt(g, false);
        self.postMessage({
            msg: 'APP14 Size: ' + j + ' found at: ' + g
        });
        while (g + 4 < e.length) {
            if (e.getStringAt(g, 4) === '8BIM') {
                self.postMessage({
                    msg: 'Found 8BIM at:' + g
                });
                o = true;
                break;
            }
            g++;
        }

        if (!o) return;

        h = g + j;

        while (g < h) {
            if (e.getShortAt(g, false) == 7170) {
                g += 2;
                i = JFIFTags[e.getByteAt(g)];
                g++;
                m = e.getShortAt(g, false);
                g += 2;
                r = e.getStringAt(g, m);
                self.postMessage({
                    msg: 'Found seg data:' + i + ':' + m + ':' + r
                });
                if (i === 'Keywords') {
                    l.push(r);
                    q[i] = l;
                } else {
                    q[i] = r;
                }
                g += m;
            } else {
                g++;
            }
        }

        self.postMessage({
            iptc: q,
            guid: p
        });
    };
}
