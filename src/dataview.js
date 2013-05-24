function dataView(e) {
    this.buffer = null;
    this.data = e;
    this.__defineGetter__("length", function() {
        return this.buffer.byteLength;
    });
    var d = {
        ArrayBuffer: typeof ArrayBuffer !== "undefined",
        DataView: typeof DataView !== "undefined"
    };
    if (this.data) {
        if (d.ArrayBuffer) {
            if (d.DataView) {
                this.buffer = new DataView(this.data);
            } else {
                this.buffer = this.data;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
    this.endianness = function(h, i, f, g) {
        return h + (g ? f - i - 1 : i);
    };
    this.getFloat64 = function(i, f) {
        var r = this.getUint8(this.endianness(i, 0, 8, f)),
            q = this.getUint8(this.endianness(i, 1, 8, f)),
            p = this.getUint8(this.endianness(i, 2, 8, f)),
            n = this.getUint8(this.endianness(i, 3, 8, f)),
            m = this.getUint8(this.endianness(i, 4, 8, f)),
            l = this.getUint8(this.endianness(i, 5, 8, f)),
            k = this.getUint8(this.endianness(i, 6, 8, f)),
            j = this.getUint8(this.endianness(i, 7, 8, f)),
            h = 1 - 2 * (r >> 7), o = ((r << 1 & 255) << 3 | q >> 4) - (Math.pow(2, 10) - 1), g = (q & 15) * Math.pow(2, 48) + p * Math.pow(2, 40) + n * Math.pow(2, 32) + m * Math.pow(2, 24) + l * Math.pow(2, 16) + k * Math.pow(2, 8) + j;
        if (g == 0 && o == -(Math.pow(2, 10) - 1)) {
            return 0;
        }
        if (o == -1023) {
            return h * g * Math.pow(2, -1022 - 52);
        }
        return h * (1 + g * Math.pow(2, -52)) * Math.pow(2, o);
    };
    this.getFloat32 = function(i, f) {
        var n = this.getUint8(this.endianness(i, 0, 4, f)), m = this.getUint8(this.endianness(i, 1, 4, f)), l = this.getUint8(this.endianness(i, 2, 4, f)), j = this.getUint8(this.endianness(i, 3, 4, f)), h = 1 - 2 * (n >> 7), k = (n << 1 & 255 | m >> 7) - 127, g = (m & 127) << 16 | l << 8 | j;
        if (g == 0 && k == -127) {
            return 0;
        }
        if (k == -127) {
            return h * g * Math.pow(2, -126 - 23);
        }
        return h * (1 + g * Math.pow(2, -23)) * Math.pow(2, k);
    };
    this.getInt32 = function(h, g) {
        var f = this.getUint32(h, g);
        return f > Math.pow(2, 31) - 1 ? f - Math.pow(2, 32) : f;
    };
    this.getUint32 = function(k, j) {
        var f = this.getUint8(this.endianness(k, 0, 4, j)), g = this.getUint8(this.endianness(k, 1, 4, j)), h = this.getUint8(this.endianness(k, 2, 4, j)), i = this.getUint8(this.endianness(k, 3, 4, j));
        return f * Math.pow(2, 24) + (g << 16) + (h << 8) + i;
    };
    this.getInt16 = function(h, g) {
        var f = this.getUint16(h, g);
        return f > Math.pow(2, 15) - 1 ? f - Math.pow(2, 16) : f;
    };
    this.getUint16 = function(i, h) {
        var f = this.getUint8(this.endianness(i, 0, 2, h)), g = this.getUint8(this.endianness(i, 1, 2, h));
        return (f << 8) + g;
    };
    this.getInt8 = function(g) {
        var f = this.getUint8(g);
        return f > Math.pow(2, 7) - 1 ? f - Math.pow(2, 8) : f;
    };
    this.getUint8 = function(f) {
        if (d.ArrayBuffer) {
            return new Uint8Array(this.buffer, f, 1)[0];
        } else {
            return this.data.charCodeAt(f) & 255;
        }
    };
    this.getStringAt = function(k, j) {
        var g = [];
        var f = this.getBytesAt(k, j);
        for (var h = 0; h < j; h++) {
            g[h] = String.fromCharCode(f[h]);
        }
        return g.join("");
    };
    this.getByteAt = function(f) {
        if (d.DataView) {
            return this.buffer.getUint8(f);
        } else {
            return this.getUint8(f);
        }
    };
    this.getBytesAt = function(j, h) {
        var f = [];
        for (var g = 0; g < h; g++) {
            f[g] = this.getByteAt(j + g);
        }
        return f;
    };
    this.getShortAt = function(g, f) {
        if (d.DataView) {
            return this.buffer.getUint16(g, f);
        } else {
            return this.getUint16(g, f);
        }
    };
    this.getLongAt = function(g, f) {
        if (d.DataView) {
            return this.buffer.getUint32(g, f);
        } else {
            return this.getUint32(g, f);
        }
    };
    this.getSLongAt = function(g, f) {
        if (d.DataView) {
            return this.buffer.getInt32(g, f);
        } else {
            return this.getInt32(g, f);
        }
    };
}
