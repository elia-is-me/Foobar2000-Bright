﻿// vim: set ft=javascript fileencoding=utf-8 bomb et:
// created by Elia
// e.g.) @import "%fb2k_profile_path%themes\bright\import\common\common5.js

//////////////////////////////////////////////////////////////////////////////

String.prototype.trim = function(s) {
    return this.replace(/^[\s　]*|[\s　]*$/g, "");
};

String.prototype.validate = function() {
    return this.replace(/[\/\\|:\*"<>\?]/g, "_");
};

String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.substr(1);
};

if (!Array.prototype.unique) {
    Array.prototype.unique = function() {
        var arr = this;
        if (arr.length <= 0) return [];
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    arr.splice(j, 1);
                    j -= 1;
                }
            }
        }
        return arr;
    };
}


// Refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {
        'use strict';
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val)
                }
            }
        }
        return res;
    }
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }
        return A
    }
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O)
            }
            k++;
        }
    }
}

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}


//////////////////////////////////////////////////////////////////////////////

// Refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
function isArray(arr) {
    return Object.prototype.toString.call(arg) === '[object Array]';
}

// jQuery.isNumeric()
function isNumeric (obj) {
    return !Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}


function console(s) {
    fb.trace(s);
};

function alert(msg) {
    fb.ShowPopupMessage(msg, "WSH Panel Mod", 0);
};


function GetFBWnd() {
    return utils.CreateWND(window.ID).GetAncestor(2);
}


function StringFormat() {
    var h_align = 0,
        v_align = 0,
        trimming = 0,
        flags = 0;
    switch (arguments.length) {
        case 4:
            flags = arguments[3];
        case 3:
            trimming = arguments[2];
        case 2:
            v_align = arguments[1];
        case 1:
            h_align = arguments[0];
            break;
        default:
            return 0;
    };
    return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}

function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function RGB(r, g, b) {
    return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function toRGB(d) {
    var d = d - 0xff000000;
    var r = d >> 16;
    var g = d >> 8 & 0xFF;
    var b = d & 0xFF;
    return [r, g, b];
};


function negativeColor(colour) {
    var R = getRed(colour);
    var G = getGreen(colour);    
    var B = getBlue(colour);
    return RGB(Math.abs(R-255), Math.abs(G-255), Math.abs(B-255));
};

function blendColors(c1, c2, factor) {
    var c1 = toRGB(c1);
    var c2 = toRGB(c2);
    var r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
    var g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
    var b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
    return (0xff000000 | (r << 16) | (g << 8) | (b));
};

function combineColors(bg, color) {
    var b = toRGB(bg);
    var c = [getRed(color), getGreen(color), getBlue(color), getAlpha(color) / 255];
    return RGB(
            (1 - c[3]) * b[0] + c[3] * c[0],
            (1 - c[3]) * b[1] + c[3] * c[1],
            (1 - c[3]) * b[2] + c[3] * c[2]
          );
}

function getAlpha(color) {
    return ((color >> 24) & 0xff);
}

function getRed(color) {
    return ((color >> 16) & 0xff);
}

function getGreen(color) {
    return ((color >> 8) & 0xff);
}

function getBlue(color) {
    return (color & 0xff);
}

function setAlpha(color, a) {
    return ((color & 0x00ffffff) | (a << 24));
}

function Luminance(color) {
    color = toRGB(color);
    return (0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]) / 255.0;
};


function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    };
    return clone;
};

function GetSystemDpiPercent() {
    var objShell = new ActiveXObject("WScript.Shell");
    var temp;
    try {
        temp = objShell.RegRead("HKEY_CURRENT_USER\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");
        console("DPI: " + temp);
    } catch (e) {
        temp = 96;
    }
    return Math.round(temp / 96 * 100);
}


function GetWindowsVersion() {
    // get windows version
    var wbemFlagReturnImmediately = 0x10;
    var wbemFlagForwardOnly = 0x20;
    var objWMIService = GetObject("winmgmts:\\\\.\\root\\CIMV2");
    var colItems = objWMIService.ExecQuery("SELECT * FROM Win32_OperatingSystem", "WQL",
                                          wbemFlagReturnImmediately | wbemFlagForwardOnly);
    var enumItems = new Enumerator(colItems);
    var objItem = enumItems.item();
    var version_number = 0;
    if(objItem.Caption.toUpperCase().indexOf("XP")!=-1) version_number = 5;
    if(objItem.Caption.toUpperCase().indexOf("VISTA")!=-1) version_number = 6;
    if(objItem.Caption.toUpperCase().indexOf("7")!=-1) version_number = 7;
    if(objItem.Caption.toUpperCase().indexOf("8")!=-1) version_number = 8;
    if(objItem.Caption.toUpperCase().indexOf("10")!=-1) version_number = 10;
    return version_number;
}


function GetFBColors() {
    var ret = {};
    if (window.InstanceType == 1) { // DUI
        ret = {
            text: window.GetColorDUI(ColorTypeDUI.text),
            background: window.GetColorDUI(ColorTypeDUI.background),
            selection_background: window.GetColorDUI(ColorTypeDUI.selection),
            highlight: window.GetColorDUI(ColorTypeDUI.highlight)
        };
    } else {
        ret = {
            text: window.GetColorCUI(ColorTypeCUI.text),
            selection_text: window.GetColorCUI(ColorTypeCUI.selection_text),
            background: window.GetColorCUI(ColorTypeCUI.background),
            selection_background: window.GetColorCUI(ColorTypeCUI.selection_background),
            highlight: window.GetColorCUI(ColorTypeCUI.active_item_frame),
        };
    }
    return ret;
}

//////////////////////////////////////////////////////////////////////////////



function Button(func) {
    this.func = func || function() {};
    this.state = 0;
    this.isDown = false;
}

Button.prototype.setSize = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Button.prototype.isMouseOver = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
}

Button.prototype.changeState = function (state) {
    if (state == this.state) {
        return;
    }
    this.state = state;
    this.repaint();
}

Button.prototype.repaint = function () {
    window.Repaint(this.x, this.y, this.w+1, this.h+1);
}

Button.prototype.onClick = function(x, y) {
    if (this.isMouseOver(x, y)) {
        this.func(x, y);
    }
}

Button.prototype.onMouseMove = function (x, y) {
    if (this.state == 2) {
        return;
    } else {
        this.changeState(this.isMouseOver(x, y) ? 1 : 0);
    }
}

Button.prototype.onMouseDown = function(x, y) {
    if (this.isMouseOver(x, y)) {
        this.changeState(2);
        return true;
    } else {
        return false;
    }
}

Button.prototype.onMouseUp = function(x, y) {
    if (this.isMouseOver(x, y)) {
        this.changeState(1);
        return true;
    } else {
        this.changeState(0);
        return false;
    }
}

Button.prototype.onMouseLeave = function (x, y) {
    this.changeState(0);
}

Button.prototype.draw = function(gr, img, x, y) {
    x = Math.round(x);
    y = Math.round(y);
    this.setSize(x, y, img.Width, img.Height);
    var alpha = (this.state == 2 ? 100 : ( this.state == 1 ? 200 : 255));
    gr.DrawImage(img, x, y, this.w, this.h, 0, 0, this.w, this.h, 0, alpha);
}


//
function Slider(getPos, setPos) {
    this.getPos = getPos || function () {};
    this.setPos = setPos || function () {};
    this.pos = this.getPos();
    this.pos_ = this.pos;
}

Slider.prototype.isMouseOver = Button.prototype.isMouseOver;

Slider.prototype.repaint = Button.prototype.repaint;

Slider.prototype.setSize = Button.prototype.setSize;

Slider.prototype.onMouseDown = function(x, y) {
    if (this.isMouseOver(x, y)) {
        this.dragging = true;
        this.onMouseMove(x, y);
    }
}

Slider.prototype.onMouseMove = function(x, y, set) {
    if (!this.dragging) {
        return;
    }
    x -= this.x;
    this.pos = x < 0 ? 0 :  x > this.w ? 1 : x / this.w;
    this.setPos(this.pos);
    this.repaint();
}

Slider.prototype.onMouseUp = function(x, y) {
    this.dragging = false;
}

Slider.prototype.updatePos = function() {
    this.pos = this.getPos();
    this.repaint();
}

Slider.prototype.draw = function(gr, nobImg, x, y, w, h, padding_h, color1, color2) {
    if (padding_h * 2 > h)
        padding_h = 0;
    this.nobImg = nobImg;
    this.setSize(x, y, w, h);
    // bg
    gr.FillSolidRect(x, y+padding_h, w, h - padding_h * 2, color2);
    // progress
    if (this.pos > 0 && this.pos <= 1) {
        gr.FillSolidRect(x, y+padding_h, w * this.pos, h - padding_h * 2, color1);
    }
    // nobImg
    if (this.nobImg && isNumeric(this.pos) && this.pos >= 0) {
        var img_w = this.nobImg.Width,
            img_h = this.nobImg.Height;
        gr.DrawImage(this.nobImg, x+w*this.pos - img_w/2, (h - img_h)/2+y, img_w, img_h, 0, 0, img_w, img_h, 0, 255);
    }
}


//////////////////////////////////////////////////////////////////////////////

// Constants && Objects

var DT_LEFT = 0x00000000;
var DT_CENTER = 0x00000001;
var DT_RIGHT = 0x00000002;
var DT_VCENTER = 0x00000004;
var DT_WORDBREAK = 0x00000010;
var DT_CALCRECT = 0x00000400;
var DT_NOPREFIX = 0x00000800;
var DT_END_ELLIPSIS = 0x00008000;
var DT_SINGLELINE = 0x00000020;

var MF_GRAYED = 0x00000001;
var MF_STRING = 0x00000000;
var MF_POPUP = 0x00000010;
var MF_DISABLED = 0x00000002;

var IDC_ARROW = 32512;
var IDC_HAND = 32649;
var IDC_HELP = 32651;
var IDC_NO = 32648
var IDC_ARROW = 32512;
var IDC_IBEAM = 32513;

/* Control wants all keys           */
var DLGC_WANTALLKEYS = 0x0004; 

var MK_LBUTTON  = 0x0001;
var MK_RBUTTON  = 0x0002;
// The SHIFT key is down.
var MK_SHIFT    = 0x0004; 
// The CTRL key is down.
var MK_CONTROL  = 0x0008; 
var MK_MBUTTON  = 0x0010;
var MK_XBUTTON1 = 0x0020;
var MK_XBUTTON2 = 0x0040;

var VK_BACK = 0x08;
var VK_CONTROL = 0x11;
var VK_SHIFT = 0x10;
var VK_MENU = 0x12; // Alt key
var VK_ALT = 0x12;
var VK_PAUSE = 0x13;
var VK_ESCAPE = 0x1B;
var VK_SPACE = 0x20;
var VK_DELETE = 0x2E;
var VK_PRIOR = 0x21; // PAGE UP key
var VK_NEXT = 0x22; // PAGE DOWN key
var VK_PGUP = 0x21;
var VK_PGDN = 0x22;
var VK_END = 0x23;
var VK_HOME = 0x24;
var VK_LEFT = 0x25;
var VK_UP = 0x26;
var VK_RIGHT = 0x27;
var VK_DOWN = 0x28;
var VK_INSERT = 0x2D;
var VK_SPACEBAR = 0x20;
var VK_RETURN = 0x0D; //Enter
var VK_LSHIFT = 0xA0; // Left SHIFT key
var VK_RSHIFT = 0xA1; // Right SHIFT key
var VK_LCONTROL = 0xA2; // Left CONTROL key
var VK_RCONTROL = 0xA3; // Right CONTROL key
var VK_LMENU = 0xA4; // Left MENU key
var VK_RMENU = 0xA5; // Right MENU key
 
var VK_KEY_0 = 0x30 //    0
var VK_KEY_1 = 0x31 //    1
var VK_KEY_2 = 0x32 //    2
var VK_KEY_3 = 0x33 //    3
var VK_KEY_4 = 0x34 //    4
var VK_KEY_5 = 0x35 //    5
var VK_KEY_6 = 0x36 //    6
var VK_KEY_7 = 0x37 //    7
var VK_KEY_8 = 0x38 //    8
var VK_KEY_9 = 0x39 //    9
var VK_KEY_A = 0x41 //    A
var VK_KEY_B = 0x42 //    B
var VK_KEY_C = 0x43 //    C
var VK_KEY_D = 0x44 //    D
var VK_KEY_E = 0x45 //    E
var VK_KEY_F = 0x46 //    F
var VK_KEY_G = 0x47 //    G
var VK_KEY_H = 0x48 //    H
var VK_KEY_I = 0x49 //    I
var VK_KEY_J = 0x4A //    J
var VK_KEY_K = 0x4B //    K
var VK_KEY_L = 0x4C //    L
var VK_KEY_M = 0x4D //    M
var VK_KEY_N = 0x4E //    N
var VK_KEY_O = 0x4F //    O
var VK_KEY_P = 0x50 //    P
var VK_KEY_Q = 0x51 //    Q
var VK_KEY_R = 0x52 //    R
var VK_KEY_S = 0x53 //    S
var VK_KEY_T = 0x54 //    T
var VK_KEY_U = 0x55 //    U
var VK_KEY_V = 0x56 //    V
var VK_KEY_W = 0x57 //    W
var VK_KEY_X = 0x58 //    X
var VK_KEY_Y = 0x59 //    Y
var VK_KEY_Z = 0x5A //    Z
 
var VK_F1    = 0x70 //    F1
var VK_F2    = 0x71 //    F2
var VK_F3    = 0x72 //    F3
var VK_F4    = 0x73 //    F4
var VK_F5    = 0x74 // F5
var VK_F6    = 0x75 // F6
var VK_F7    = 0x76 // F7
var VK_F8    = 0x77 // F8
var VK_F9    = 0x78 // F9
var VK_F10    = 0x79 //    F10
var VK_F11    = 0x7A //    F11
var VK_F12    = 0x7B //    F12

var FontStyle = {
    Regular: 0,
    Bold: 1,
    Italic: 2,
    BoldItalic: 3,
    Underline: 4,
    Strikeout: 8
};
var StringTrimming = {
    None: 0,
    Character: 1,
    Word: 2,
    EllipsisCharacter: 3,
    EllipsisWord: 4,
    EllipsisPath: 5
};
var StringFormatFlags = {
    DirectionRightToLeft: 1,
    DirectionVertical: 2,
    NoFitBlackBox: 4,
    DisplayFormatControl: 32,
    NoFontFallback: 1024,
    MeasureTrailingSpaces: 2048,
    NoWrap: 4096,
    LineLimit: 8192,
    NoClip: 16384
};
var TextRenderingHint = {
    SystemDefault: 0,
    SingleBitPerPixelGridFit: 1,
    SingleBitPerPixel: 2,
    AntiAliasGridFit: 3,
    AntiAlias: 4,
    ClearTypeGridFit: 5
};
var SmoothingMode = {
    Invalid: -1,
    Default: 0,
    HighSpeed: 1,
    HighQuality: 2,
    None: 3,
    AntiAlias: 4
};
var InterpolationMode = {
    Invalid: -1,
    Default: 0,
    LowQuality: 1,
    HighQuality: 2,
    Bilinear: 3,
    Bicubic: 4,
    NearestNeighbor: 5,
    HighQualityBilinear: 6,
    HighQualityBicubic: 7
};
var PlaybackOrder = {
    Default: 0,
    Repeat: 1,
    Repeat1: 2,
    Random: 3,
    ShuffleT: 4,
    ShuffleA: 5,
    ShuffleF: 6
};
var AlbumArtId = {
    front: 0,
    back: 1,
    disc: 2,
    icon: 3,
    artist: 4
};
var ColorTypeDUI = {
    text: 0,
    background: 1,
    highlight: 2,
    selection: 3
};
var ColorTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};
var FontTypeCUI = {
    items: 0,
    labels: 1
};
var FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
};
