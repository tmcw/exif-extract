function xmpExtractor() {
    this.findXMP = function(k, g) {
        var j = new Uint8Array(k), e = "", l, d, f, h;
        for (h = 0; h < k.byteLength; h++) {
            e += String.fromCharCode(j[h]);
        }
        l = e.indexOf("<x:xmpmeta");
        d = e.indexOf("</x:xmpmeta>");
        f = e.slice(l, d);
        f = f + "</x:xmpmeta>";
        self.postMessage({
            guid: g,
            xmp: f
        });
    };
}
