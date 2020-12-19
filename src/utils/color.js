const CSS_COLOR = {
    aliceblue: "#F0F8FF",
    antiquewhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedalmond: "#FFEBCD",
    blue: "#0000FF",
    blueviolet: "#8A2BE2",
    brown: "#A52A2A",
    burlywood: "#DEB887",
    cadetblue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerblue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkblue: "#00008B",
    darkcyan: "#008B8B",
    darkgoldenrod: "#B8860B",
    darkgray: "#A9A9A9",
    darkgrey: "#A9A9A9",
    darkgreen: "#006400",
    darkkhaki: "#BDB76B",
    darkmagenta: "#8B008B",
    darkolivegreen: "#556B2F",
    darkorange: "#FF8C00",
    darkorchid: "#9932CC",
    darkred: "#8B0000",
    darksalmon: "#E9967A",
    darkseagreen: "#8FBC8F",
    darkslateblue: "#483D8B",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    darkturquoise: "#00CED1",
    darkviolet: "#9400D3",
    deeppink: "#FF1493",
    deepskyblue: "#00BFFF",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1E90FF",
    firebrick: "#B22222",
    floralwhite: "#FFFAF0",
    forestgreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostwhite: "#F8F8FF",
    gold: "#FFD700",
    goldenrod: "#DAA520",
    gray: "#808080",
    grey: "#808080",
    green: "#008000",
    greenyellow: "#ADFF2F",
    honeydew: "#F0FFF0",
    hotpink: "#FF69B4",
    indianred: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderblush: "#FFF0F5",
    lawngreen: "#7CFC00",
    lemonchiffon: "#FFFACD",
    lightblue: "#ADD8E6",
    lightcoral: "#F08080",
    lightcyan: "#E0FFFF",
    lightgoldenrodyellow: "#FAFAD2",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3",
    lightgreen: "#90EE90",
    lightpink: "#FFB6C1",
    lightsalmon: "#FFA07A",
    lightseagreen: "#20B2AA",
    lightskyblue: "#87CEFA",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#B0C4DE",
    lightyellow: "#FFFFE0",
    lime: "#00FF00",
    limegreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumaquamarine: "#66CDAA",
    mediumblue: "#0000CD",
    mediumorchid: "#BA55D3",
    mediumpurple: "#9370D8",
    mediumseagreen: "#3CB371",
    mediumslateblue: "#7B68EE",
    mediumspringgreen: "#00FA9A",
    mediumturquoise: "#48D1CC",
    mediumvioletred: "#C71585",
    midnightblue: "#191970",
    mintcream: "#F5FFFA",
    mistyrose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajowhite: "#FFDEAD",
    navy: "#000080",
    oldlace: "#FDF5E6",
    olive: "#808000",
    olivedrab: "#6B8E23",
    orange: "#FFA500",
    orangered: "#FF4500",
    orchid: "#DA70D6",
    palegoldenrod: "#EEE8AA",
    palegreen: "#98FB98",
    paleturquoise: "#AFEEEE",
    palevioletred: "#D87093",
    papayawhip: "#FFEFD5",
    peachpuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderblue: "#B0E0E6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#FF0000",
    rosybrown: "#BC8F8F",
    royalblue: "#4169E1",
    saddlebrown: "#8B4513",
    salmon: "#FA8072",
    sandybrown: "#F4A460",
    seagreen: "#2E8B57",
    seashell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyblue: "#87CEEB",
    slateblue: "#6A5ACD",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#FFFAFA",
    springgreen: "#00FF7F",
    steelblue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whitesmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowgreen: "#9ACD32",
};

const hexReg = /^#([0-9a-f]{3}[0-9a-f]?|[0-9a-f]{6}([0-9a-f]{2})?)$/i;
const rgbaIntReg = /^rgb(a?)\(\+?(\d+|\d*\.\d+),\+?(\d+|\d*\.\d+),\+?(\d+|\d*\.\d+)(,\+?(\d+|\d*\.\d+))?\)$/i;
const rgbaPerReg = /^rgb(a?)\(\+?(\d+|\d*\.\d+)%,\+?(\d+|\d*\.\d+)%,\+?(\d+|\d*\.\d+)%(,\+?(\d+|\d*\.\d+))?\)$/i;
const hslaReg = /^hsl(a?)\(\+?(\d+|\d*\.\d+),\+?(\d+|\d*\.\d+)%,\+?(\d+|\d*\.\d+)%(,\+?(\d+|\d*\.\d+))?\)$/i;
const hsvaReg = /^hsv(a?)\(\+?(\d+|\d*\.\d+),\+?(\d+|\d*\.\d+)%,\+?(\d+|\d*\.\d+)%(,\+?(\d+|\d*\.\d+))?\)$/i;

function Color(color) {
    if (!(this instanceof Color)) {
        return new Color(color);
    }
    this.RGBA_INT_DATA = Color.parse.call(this, color);
    this.isColor = this._isColor_;
}

Color.parse = function (color, type) {
    if (!color || typeof color !== "string") {
        return [];
    }
    this.color = color = CSS_COLOR[color] || color.replace(/\s*/g, "");
    this._isColor_ = true;
    let match = null;
    let rgba = [255, 0, 0, void 0];
    if (hexReg.test(color)) {
        rgba = this.HextoRGBA(color);
    } else if ((match = rgbaIntReg.exec(color))) {
        rgba[0] = match[2];
        rgba[1] = match[3];
        rgba[2] = match[4];
        rgba[3] = match[6];
    } else if ((match = rgbaPerReg.exec(color))) {
        rgba[0] = Math.round(match[2] * 255);
        rgba[1] = Math.round(match[3] * 255);
        rgba[2] = Math.round(match[4] * 255);
        rgba[3] = match[6];
    } else if ((match = hslaReg.exec(color))) {
        const result = this.HSLtoRGB(match[2], match[3], match[4], true);
        rgba[0] = Math.round(result[0]);
        rgba[1] = Math.round(result[1]);
        rgba[2] = Math.round(result[2]);
        rgba[3] = match[6];
    } else if ((match = hsvaReg.exec(color))) {
        const result = this.HSVtoRGB(match[2], match[3], match[4], true);
        rgba[0] = Math.round(result[0]);
        rgba[1] = Math.round(result[1]);
        rgba[2] = Math.round(result[2]);
        rgba[3] = match[6];
    } else {
        this._isColor_ = false;
    }
    if (rgba[3] === void 0 || rgba[3] === "") {
        rgba[3] = 1;
    }
    rgba = rgba.map((val) => Math.min(val, 255));
    rgba[3] = rgba[3].toFixed(2) / 1;
    if (type === 'rgba' || type === 'rgb') {
        return rgba
    }
    if (type === 'hex') {
        return Color.RGBtoHex(...rgba)
    }
    if (type === 'hsla' || type === 'hsl') {
        return Color.RGBtoHSL(...rgba)
    }
    if (type === 'hsva' || type === 'hsv') {
        return Color.RGBtoHSV(...rgba)
    }
    return rgba;
}
Color.isColor = function (color) {
    if (!color || typeof color !== "string") return false;
    color = CSS_COLOR[color] || color.replace(/\s*/g, "");
    return hexReg.test(color) || rgbaIntReg.test(color) || rgbaPerReg.test(color) || hslaReg.test(color) || hsvaReg.test(color);
};

Color.concat = function (...colors) {
    let R = 0,
        G = 0,
        B = 0,
        A = 0,
        length = colors.length;
    colors.forEach((color) => {
        color = color instanceof Color ? color : new Color(color);
        R += color.RGBA_INT_DATA[0];
        G += color.RGBA_INT_DATA[1];
        B += color.RGBA_INT_DATA[2];
        A += color.RGBA_INT_DATA[0];
    });
    return new Color(`rgba(${R / length},${G / length},${B / length},${A / length})`);
};

Color.HSLtoRGB = Color.prototype.HSLtoRGB = function (H, S, L, A = 1, noMath) {
    let R,
        G,
        B,
        temp1,
        temp2,
        Hue2RGB = function (temp1, temp2, temp3) {
            if (temp3 < 0) temp3 += 1;
            if (temp3 > 1) temp3 -= 1;
            if (6 * temp3 < 1) return temp1 + (temp2 - temp1) * 6 * temp3;
            if (2 * temp3 <= 1) return temp2;
            if (3 * temp3 <= 2) return temp1 + (temp2 - temp1) * (2 / 3 - temp3) * 6;
            return temp1;
        };
    H = H / 360;
    S = S / 100;
    L = L / 100;
    if (S == 0) {
        R = G = B = L;
    } else {
        temp2 = L < 0.5 ? L * (1 + S) : L + S - L * S;
        temp1 = 2 * L - temp2;
        R = Hue2RGB(temp1, temp2, H + 1 / 3);
        G = Hue2RGB(temp1, temp2, H);
        B = Hue2RGB(temp1, temp2, H - 1 / 3);
    }
    return noMath ? [(R * 255), (G * 255), (B * 255), A] : [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255), A];
};


Color.HSVtoRGB = Color.prototype.HSVtoRGB = function (H, S, V, A = 1, noMath) {
    S = S / 100;
    V = V / 100;
    let R,
        G,
        B;
    if (S === 0) {
        R = G = B = V;
    } else {
        let Hi = Math.floor(H / 60) % 6,
            f = H / 60 - Hi,
            p = V * (1 - S),
            q = V * (1 - S * f),
            t = V * (1 - S * (1 - f));
        switch (Hi) {
            case 6:
            case 0:
                R = V;
                G = t;
                B = p;
                break;
            case 1:
                R = q;
                G = V;
                B = p;
                break;
            case 2:
                R = p;
                G = V;
                B = t;
                break;
            case 3:
                R = p;
                G = q;
                B = V;
                break;
            case 4:
                R = t;
                G = p;
                B = V;
                break;
            case 5:
                R = V;
                G = p;
                B = q;
                break;
        }
    }
    return noMath ? [(R * 255), (G * 255), (B * 255), A] : [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255), A];
};

Color.RGBtoHSLV = Color.prototype.RGBtoHSLV = function (R, G, B, A = 1) {
    let min = Math.min(R, G, B),
        max = Math.max(R, G, B),
        delta = max - min,
        hslv = { a: A };
    hslv.l = (max + min) / 510;
    hslv.v = (max / 255 * 100);
    if (delta == 0 || max == 0) {
        hslv.h = hslv.s = hslv.vs = 0;
    } else {
        hslv.s = hslv.l <= 0.5 ? delta / (max + min) : delta / (510 - 510 * hslv.l);
        if (R == max) {
            hslv.h = (G - B) / delta;
        } else if (G == max) {
            hslv.h = 2 + (B - R) / delta;
        } else {
            hslv.h = 4 + (R - G) / delta;
        }
        hslv.h = (hslv.h * 60 + 360) % 360;
        hslv.s = (hslv.s * 100);
        hslv.vs = ((1 - min / max) * 100);
    }
    hslv.l = (hslv.l * 100);
    return hslv;
};

Color.RGBtoHSL = Color.prototype.RGBtoHSL = function (R, G, B, A = 1, noMath) {
    const data = this.RGBtoHSLV(R, G, B, A);
    return noMath ? [data.h, data.s, data.l, data.a] : [Math.round(data.h), Math.round(data.s), Math.round(data.l), (data.a)];
};

Color.RGBtoHSV = Color.prototype.RGBtoHSV = function (R, G, B, A = 1, noMath) {
    const data = this.RGBtoHSLV(R, G, B, A);
    return noMath ? [data.h, data.vs, data.v, data.a] : [Math.round(data.h), Math.round(data.vs), Math.round(data.v), (data.a)];
};

Color.HSLtoHSV = Color.prototype.HSLtoHSV = function (H, S, L, A = 1, noMath) {
    const data = this.HSLtoRGB(H, S, L, A);
    return this.RGBtoHSV(...data, noMath);
};

Color.HSVtoHSL = Color.prototype.HSVtoHSL = function (H, S, V, A = 1, noMath) {
    const data = this.HSVtoRGB(H, S, V, A);
    return this.RGBtoHSL(...data, noMath);
};

Color.HextoRGBA = Color.prototype.HextoRGBA = function (color) {
    const rgba = [0, 0, 0, void 0];
    const step = color.length < 6 ? 1 : 2;
    for (let i = 0; i < 4; i++) {
        let val = color[step * i + 1];
        let val2 = color[step * i + step];
        if (val2 === void 0) val2 = val;
        if (val !== void 0) rgba[i] = parseInt(`0x${val}${val2}`, 16);
    }
    if (rgba[3] !== void 0) {
        rgba[3] = (rgba[3] / 255).toFixed(2);
    } else {
        rgba[3] = 1;
    }
    return rgba;
};

Color.RGBtoHex = function (R, G, B, A) {
    const pad = function (str = "", length) {
        let len = str.length;
        if (len < length) {
            let count = Math.ceil(length / len);
            let index = 1;
            let result = str;
            while (index < count) {
                result += str;
                index++;
            }
            return result.slice(0, length);
        }
        return str;
    };
    const result = [pad(Number(R).toString(16), 2), pad(Number(G).toString(16), 2), pad(Number(B).toString(16), 2)];
    if (A || A === 0) {
        result.push(pad(Math.round(Number(A * 255)).toString(16), 2))
    }
    return result;
};


Color.prototype.toCSS = function (type = "rgba") {
    const last = type.length - 1;
    const hasAlpha = type[last] === 'a' || type[last] === 'A';
    type = hasAlpha ? type.substring(0, last) : type;
    if (type === "rgb") return this.toRGB(hasAlpha);
    if (type === "hex") return this.toHex(hasAlpha);
    if (type === "hsl") return this.toHSL(hasAlpha);
    if (type === "hsv") return this.toHSV(hasAlpha);
};

Color.prototype.toRGB = function (hasAlpha) {
    const alpha = hasAlpha ? `,${this.RGBA_INT_DATA[3]}` : "";
    return `${hasAlpha ? "rgba" : "rgb"}(${this.RGBA_INT_DATA[0]},${this.RGBA_INT_DATA[1]},${this.RGBA_INT_DATA[2]
        }${alpha})`;
};

Color.prototype.toRGBA = function () {
    return this.toRGB(true);
};

Color.prototype.toHex = function (hasAlpha = true) {
    return '#' + Color.RGBtoHex(this.RGBA_INT_DATA[0], this.RGBA_INT_DATA[1], this.RGBA_INT_DATA[2], hasAlpha ? this.RGBA_INT_DATA[3] : void 0).join('');
};

Color.prototype.toHSL = function (hasAlpha) {
    const alpha = hasAlpha ? `,${this.RGBA_INT_DATA[3]}` : "";
    const result = this.RGBtoHSL(...this.RGBA_INT_DATA);
    return `${hasAlpha ? "hsla" : "hsl"}(${result.h},${result.s}%,${result.l}%${alpha})`;
};

Color.prototype.toHSV = function (hasAlpha) {
    const alpha = hasAlpha ? `,${this.RGBA_INT_DATA[3]}` : "";
    const result = this.RGBtoHSV(...this.RGBA_INT_DATA);
    return `${hasAlpha ? "hsva" : "hsv"}(${result.h},${result.vs}%,${result.v}%${alpha})`;
};


Color.prototype.blend = function (color, alpha) {
    if (!(color instanceof Color)) {
        color = new Color(color);
    }
    alpha = Math.min(Math.max(alpha, 0), 1);
    this.RGBA_INT_DATA = this.RGBA_INT_DATA.map((val, index) => val * (1 - alpha) + color.RGBA_INT_DATA[index] * alpha);
    return this;
};

Color.prototype.setAlpha = function (alpha) {
    this.alpha = alpha;
    return this;
};

["red", "green", "blue"].forEach((key, index) => {
    Object.defineProperty(Color.prototype, key, {
        get() {
            return this.RGBA_INT_DATA[index];
        },
        set(value) {
            this.RGBA_INT_DATA[index] = value;
        },
    });
    Color.prototype["set" + key.substr(0, 1).toUpperCase() + key.substr(1)] = function (value) {
        this[key] = value;
        return this;
    };
});
Object.defineProperty(Color.prototype, "alpha", {
    get() {
        return this.RGBA_INT_DATA[3];
    },
    set(value) {
        this.RGBA_INT_DATA[3] = Math.min(Math.max(0, value), 1);
    },
});

export default Color;
