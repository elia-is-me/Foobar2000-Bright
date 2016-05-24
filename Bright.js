// vim: set ft=javascript fileencoding=utf-8 bomb et:
//
// ==PREPROCESSOR==
// @name "Bright"
// @version ""
// @author "Elia >> elia-is-me.github.io"
// @feature "dragdrop"
// @feature "v1.4"
// @feature "watch-metadb"
// ==/PREPROCESSOR==
//
//
// Readme:
//
//
//
//


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
}

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
	return RGB((1 - c[3]) * b[0] + c[3] * c[0], (1 - c[3]) * b[1] + c[3] * c[1], (1 - c[3]) * b[2] + c[3] * c[2]);
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

function sqrt(a) {
	return Math.sqrt(a);
}

function pow(a, b) {
	var c = b ? b : 2;
	return Math.pow(a, c);
}

// if Luminance(c) > 0.6, c is light; else dark.
function Luminance(color) {
	color = toRGB(color);
	return (0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]) / 255.0;
};

var Seeker = function (nob_img, getfunc, setfunc) {
    this.nobImg = nob_img ? nob_img : null;
    this.getPos = (typeof getfunc == "function" ? getfunc : function(){});
    this.setPos = (typeof setfunc == "function" ? setfunc : function(){});
    this.pos = this.getPos();
    this.isDrag = false;
    this.x, this.y, this.w, this.h;
    // 
    this.draw = function (gr, x, y, w, h, y_offset, color1, color2) {
        if (h <= y_offset * 2) {
            y_offset = 0;
        }
        gr.FillSolidRect(x, y+y_offset, w, h-y_offset*2, color2);
        if (this.pos > 0 && this.pos <= 1) {
            gr.FillSolidRect(x, y+y_offset, w*this.pos, h-y_offset*2, color1);
        }
        if (this.nobImg) {
            var img_w = this.nobImg.Width;
            if (this.pos < 0) {
                this.pos = 0;
            }
            gr.DrawImage(this.nobImg, x+w*this.pos-img_w/2, (h-img_w)/2+y, img_w, img_w, 0, 0, img_w, img_w, 0, 255);
        }
        this.x = x; this.y = y; this.w = w; this.h = h;
    }
    this.repaint = function () {
        window.Repaint();
    }
    this.update = function() {
        this.pos = this.getPos();
        this.repaint();
    }
    this.isMouseOver = function(x, y) {
        var l = (this.nobImg ? this.nobImg.Width/2 : 0);
        return (x > this.x-l && x < this.x + this.w + l && y > this.y && y < this.y + this.h);
    }
    this.down = function(x, y, mask) {
        if (this.isMouseOver(x, y)) {
            this.isDrag = true;
            this.move(x, y);
        }
        return this.isDrag;
    }
    this.up = function() {
        this.isDrag = false;
    }
    this.move = function (x, y) {
        if (this.isDrag) {
            x -= this.x;
            this.pos = x < 0 ? 0 : x > this.w ? 1 : x / this.w;
            this.setPos(this.pos);
            this.repaint();
        }
    }
}

var Button = function(func, tiptext) {
    this.func = func;
    this.state = 0;
    this.isDown = false;
    //this.tiptext = tiptext;
    this.draw = function (gr, img, x, y) {
        this.x = x; this.y = y;
        this.w = img.Width; this.h = img.Height;
        var alpha = 0;
        alpha = (this.state == 2 ? 100 : (this.state == 1 ? 200 : 255));
        gr.DrawImage(img, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
    }
    this.repaint = function() {
        window.RepaintRect(this.x, this.y, this.w+1, this.h+1);
    }
    this.isMouseOver = function (x, y) {
        return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
    }
    this.changeState = function (s) {
        if (s == this.state) { return; }
        this.state = s;
        this.repaint();
    }
    this.down = function (x, y) {
        if (this.isMouseOver(x, y)) {
            this.changeState(2);
            return true;
        } else {
            return false;
        }
    }
    this.up = function (x, y) {
        if (this.isMouseOver(x, y)) {
            this.changeState(1);
            return true;
        } else {
            this.changeState(0);
            return false;
        }
    }
    this.move = function (x, y) {
        if (this.state == 2) {
            return;
        } else {
            if (this.isMouseOver(x, y)) {
                this.changeState(1);
            } else {
                this.changeState(0);
            }
        }
    }
    this.leave = function () {
        this.changeState(0);
    }
    this.onClick = function (x, y) {
        if (!this.func || typeof this.func != "function") {
            return;
        }
        this.func(x, y);
    }
}


function prepare_images() {
    // nob images
    var w = 10;
    images.nob = gdi.CreateImage(w, w);
    g = images.nob.GetGraphics();
    g.SetSmoothingMode(2);
    g.FillEllipse(1, 1, 7, 7, colors.text);
    g.SetSmoothingMode(0);
    images.nob.ReleaseGraphics(g);
}

function get_fonts() {
    var font_;
    fonts.name = fb.TitleFormat(prop.font_name).Eval(true);
    //
    if (!utils.CheckFont(fonts._name)) {
        try {
            font_ = (window.InstanceType == 1 ? window.GetFontDUI(3) : window.GetFontCUI(0));
            fonts.name = font_.Name;
            fonts.size = font_.Size;
        } catch (e) {
            fonts.name = "Segoe UI";
            fonts.size = 12;
        }
    }
    fonts.time = gdi.Font(prop.font_name, 12);
}

function get_colors() {
    if (prop.custom_color) {
        // ...
    } else if (window.InstanceType == 1) {
        colors.text = window.GetColorDUI(ColorTypeDUI.text);
        colors.back = window.GetColorDUI(ColorTypeDUI.background);
        colors.back_sel = window.GetColorDUI(ColorTypeDUI.selection);
        colors.high = window.GetColorDUI(ColorTypeDUI.highlight);
        if (Luminance(combineColors(colors.back, setAlpha(colors.back_sel, prop.sel_alpha))) > 0.6) {
            colors.text_sel = RGB(30, 30, 30);
        } else {
            colors.text_sel = RGB(235, 235, 235);
        }
    } else {
        colors.text = window.GetColorCUI(ColorTypeCUI.text);
        colors.text_sel = window.GetColorCUI(ColorTypeCUI.selection_text);
        colors.back = window.GetColorCUI(ColorTypeCUI.background);
        colors.back_sel = window.GetColorCUI(ColorTypeCUI.selection_background);
        colors.high = window.GetColorCUI(ColorTypeCUI.active_item_frame);
    }
    return;
}




////////////////////////////////////////////////////////////////////////////////////////////

var prop = {
    font_name: window.GetProperty("Font Name", "Segoe UI"),
    custom_color: window.GetProperty("Custom Color", false),
}




var AlbumArtId={front:0,back:1,disc:2,icon:3,artist:4};
var ColorTypeDUI={text:0,background:1,highlight:2,selection:3};
var ColorTypeCUI={text:0,selection_text:1,inactive_selection_text:2,background:3,selection_background:4,inactive_selection_background:5,active_item_frame:6};
var FontTypeCUI={items:0,labels:1};
var FontTypeDUI={defaults:0,tabs:1,lists:2,playlists:3,statusbar:4,console:5};

var images = {}, colors = {}, fonts = {};



prepare_images();

var b1 = Button();
var s1 = Seeker();



