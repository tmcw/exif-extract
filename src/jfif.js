function jfifExtractor() {
    var g = 0, e, f = {}, d = {
        0: "ApplicationRecordVersion",
        3: "ObjectTypeReference",
        4: "ObjectAttributeReference",
        5: "ObjectName",
        7: "EditStatus",
        8: "EditorialUpdate",
        10: "Urgency",
        12: "SubjectReference",
        15: "Category",
        20: "SupplementalCategories",
        22: "FixtureIdentifier",
        25: "Keywords",
        26: "ContentLocationCode",
        27: "ContentLocationName",
        30: "ReleaseDate",
        35: "ReleaseTime",
        37: "ExpirationDate",
        38: "ExpirationTime",
        40: "SpecialInstructions",
        42: "ActionAdvised",
        45: "ReferenceService",
        47: "ReferenceDate",
        50: "ReferenceNumber",
        55: "DateCreated",
        60: "TimeCreated",
        62: "DigitalCreationDate",
        63: "DigitalCreationTime",
        65: "OriginatingProgram",
        70: "ProgramVersion",
        75: "ObjectCycle",
        80: "ByLine",
        85: "ByLineTitle",
        90: "City",
        92: "Sub-location",
        95: "Province-State",
        100: "CountryPrimaryLocationCode",
        101: "CountryPrimaryLocationName",
        103: "OriginalTransmissionReference",
        105: "Headline",
        110: "Credit",
        115: "Source",
        116: "CopyrightNotice",
        118: "Contact",
        120: "CaptionAbstract",
        121: "LocalCaption",
        122: "WriterEditor",
        125: "RasterizedCaption",
        130: "ImageType",
        131: "ImageOrientation",
        135: "LanguageIdentifier",
        150: "AudioType",
        151: "AudioSamplingRate",
        152: "AudioSamplingResolution",
        153: "AudioDuration",
        154: "AudioOutcue",
        184: "JobID",
        185: "MasterDocumentID",
        186: "ShortDocumentID",
        187: "UniqueDocumentID",
        188: "OwnerID",
        200: "ObjectPreviewFileFormat",
        201: "ObjectPreviewFileVersion",
        202: "ObjectPreviewData",
        221: "Prefs",
        225: "ClassifyState",
        228: "SimilarityIndex",
        230: "DocumentNotes",
        231: "DocumentHistory",
        232: "ExifCameraInfo",
        255: "CatalogSets"
    };
    this.findJFIF = function(k, p) {
        var i, m, r, l = [], q = {}, h, j, o = false, n = false;
        e = new c.YDataView(k);
        while (g + 2 < e.length) {
            if (e.getShortAt(g, false) == 65517) {
                self.postMessage({
                    msg: "Found APP 14 Marker at: " + g
                });
                n = true;
                break;
            }
            g += 2;
        }
        if (g >= e.length || !n) {
            return;
        }
        g += 2;
        j = e.getShortAt(g, false);
        self.postMessage({
            msg: "APP14 Size: " + j + " found at: " + g
        });
        while (g + 4 < e.length) {
            if (e.getStringAt(g, 4) === "8BIM") {
                self.postMessage({
                    msg: "Found 8BIM at:" + g
                });
                o = true;
                break;
            }
            g++;
        }
        if (!o) {
            return;
        }
        h = g + j;
        while (g < h) {
            if (e.getShortAt(g, false) == 7170) {
                g += 2;
                i = d[e.getByteAt(g)];
                g++;
                m = e.getShortAt(g, false);
                g += 2;
                r = e.getStringAt(g, m);
                self.postMessage({
                    msg: "Found seg data:" + i + ":" + m + ":" + r
                });
                if (i === "Keywords") {
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
