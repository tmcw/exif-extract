function e() {
    d();
    self.addEventListener("message", function(h) {
        if (h.data.arrayBuffer || h.data.file) {
            a[h.data.guid] = {
                arrayBuffer: h.data.arrayBuffer,
                file: h.data.file
            };
            d();
        }
    });
}
function d() {
    var n = f.Object.size(a);
    var m = 1;
    var l = {};
    var j;
    var h = 0;
    var k = 0;
    if (n === 0) {
        return;
    } else {
        if (n <= m) {
            l = a;
            a = {};
        } else {
            f.Object.some(a, function(o, i) {
                k++;
                if (k > m) {
                    return true;
                } else {
                    l[i] = o;
                    delete a[i];
                }
            });
        }
    }
    j = f.Object.size(l);
    if (j > 0) {
        f.Object.each(l, function(o, i) {
            if (o.file) {
                var p = new FileReader();
                p.onloadend = function() {
                    self.postMessage({
                        msg: i + " loadend " + p.readyState
                    });
                    h++;
                    if (h === j) {
                        d();
                    }
                };
                p.onabort = function() {
                    self.postMessage({
                        msg: i + " abort " + p.readyState
                    });
                };
                p.onerror = function() {
                    self.postMessage({
                        msg: i + " error " + p.readyState
                    });
                    self.postMessage({
                        msg: "ERROR"
                    });
                };
                p.onload = function() {
                    self.postMessage({
                        msg: i + " load " + p.readyState
                    });
                    g(p.result, i);
                };
                p.onloadstart = function() {
                    self.postMessage({
                        msg: i + " loadstart " + p.readyState
                    });
                };
                p.onprogress = function() {
                    self.postMessage({
                        msg: i + " progress " + p.readyState
                    });
                    setTimeout(function() {
                        self.postMessage({
                            msg: i + " progress (5s later) " + p.readyState
                        });
                    }, 5e3);
                };
                p.readAsBinaryString(o.file);
            } else {
                if (o.arrayBuffer) {
                    g(o.arrayBuffer, i);
                    h++;
                    if (h === j) {
                        d();
                    }
                }
            }
        });
    }
}

function g(j, i) {
    var k = new f.ExifExtractor();
    k.getImageData(j, i);
    var l = new f.XMPExtractor();
    l.findXMP(j, i);
    var h = new f.JFIFExtractor();
    h.findJFIF(j, i);
    self.postMessage({
        guid: dataview.guid,
        finished: true
    });
}

var workerExifExtractor = {
    init: e
};

workerExifExtractor.init();
