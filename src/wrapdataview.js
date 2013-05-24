function wrapDataView(dataview) {

    dataview.getByteAt = dataview.getUint8;
    dataview.getShortAt = dataview.getUint16;

    dataview.getBytesAt = function(j, h) {
        var bytes = [];
        for (var g = 0; g < h; g++) {
            bytes[g] = this.getByteAt(j + g);
        }
        return bytes;
    };

    dataview.getLongAt = function(g, f) {
        return this.getUint32(g, f);
    };

    dataview.getSLongAt = function(g, f) {
        return this.getInt32(g, f);
    };

    dataview.getStringAt = function(k, j) {
        var str = [],
            f = this.getBytesAt(k, j);
        for (var h = 0; h < j; h++) {
            str[h] = String.fromCharCode(f[h]);
        }
        return str.join("");
    };

    return dataview;
}
