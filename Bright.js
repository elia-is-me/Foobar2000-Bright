// ==PREPROCESSOR==
// @version "v1.4"
// @feature "watch-metadb"
// @feature "dragdrop"
// @import "E:\GitHub\Foobar2000-Bright\import\common\common5.js"
// ==/PREPROCESSOR==



var prop, playlistViewer, ListManager;

var time222 = (new Date()).getTime();
var repaint_f1 = repaint_f2 = repaint_f = false;
var repaint_main1 = repaint_main2 = repaint_main = false;

//////////////////////////////////////////////////////////////////////////////

prop = new function() {

    this.Panel = {
        smoothScroll: window.GetProperty("Panel.smoothScroll", true),
        refreshInterval: window.GetProperty("Panel.refreshInterval", 30),
        tooltip: false, // not prepared
        vimStyle: true, // vim style keyboard shortcuts.
        customColor: true,
        customFonts: true,
    };

    this.Style = {
        colorScheme: window.GetProperty("Style.colorScheme", "white"),
        fontName: window.GetProperty("Style.fontName", "segoe ui"),
        fontSize: window.GetProperty("Style.fontSize", 14),
    };

    this.PLST = {
        groupBy: window.GetProperty("PLST.groupBy", 0),
        autoCollapse: window.GetProperty("PLST.autoCollapse", false),
        rowHeight: window.GetProperty("PLST.rowHeight", 35),
        scrollStep: 3,
        enableMood: window.GetProperty("PLST.enableMood", true),
        moodMode: window.GetProperty("PLST.moodMode", 1),
    };

    this.Color = { };

    this.Font = { };


}();


function getColor() {
    // 基本颜色
    prop.Color = {
        txt: eval(window.GetProperty("Color.Text", "RGB(0, 0, 0)")),
        bg: eval(window.GetProperty("Color.Bg", "RGB(255, 255, 255)")),
        bgSel: eval(window.GetProperty("Color.Bg_Sel", "RGB(66, 133, 244)"))
    };
    // 计算选中文字颜色
    if (Luminance(prop.Color.bgSel) > 0.6) {
        prop.Color.txtSel = RGB(0, 0, 0);
    } else {
        prop.Color.txtSel = RGB(255, 255, 255);
    }
    // 其它颜色
}

function getFont() {

    prop.Font.list = gdi.Font(prop.Style.fontName, prop.Style.fontSize);

    if (utils.CheckFont("segoe mdl2 assets")) {
        prop.Font.mdl2 = gdi.Font(prop.Style.fontName, prop.Style.fontSize - 2);
    } else if (true) {
        // user defined font collection
    }
}


plstViewer = new function () {

    var list_dr = [];
    var list = plman.GetPlaylistItems(-1);
    var tf_string = fb.TitleFormat("%album artist%^^%album%^^%discnumber%^^[$num(%tracknumber%,2)]^^%title%^^[%artist%]^^$if2(%rating%,0)^^%length%");

    var research = false,
        research_k = 0;
    var research_count = 0;
    var scroll = scroll_ = scroll__ = scroll___ = 0;


    this.showNowPlaying = false;

    this.repaint = function () {

        repaint_main1 = repaint_main2;
        fb.trace(list_dr.length);
        fb.trace("repaint playlist" + " research " + research);

    }

    this.getList = function(start, compare, force) {

        var Time = fb.CreateProfiler();

        if (start == null) {
            start = 0;
            list_dr = [];
            list = plman.GetPlaylistItems(plman.ActivePlaylist);
        };

        var temp = "",  metadb;
        var k = start, total = list.Count;
        while (k < total) {
            metadb = list.Item(k);
            temp = tf_string.EvalWithMetadb(metadb).split("^^");
            list_dr.push({
                metadb: metadb,
                string: temp,
            });
            k++;
            if (!force && Time.Time > 30) {
                research = true;
                research_k = k;
                research_count++;
                this.repaint();
                return;
            }
        }

        this.repaint();
        research_count = 0;
        plman.SetActivePlaylistContext();

    }

    var time_dl,
        time_s = fb.CreateProfiler();

    this.onTimer = function() {
        time_dl = time_s.Time;
        time_s.Reset();
        // Research
        if (research) {
            research = false;
            this.getList(research_k, "");
            return false;
        }

        // Show now playing
        if (this.showNowPlaying) {
            if (plman.PlayingPlaylist == plman.ActivePlaylist) {
                try {
                    var playingIdx = plman.GetPlayingItemLocation().PlaylistItemIndex;
                    if (playingIdx >= 0) {
                    }
                } catch (e) {
                    fb.trace(e);
                }
            }
            this.showNowPlaying = false;
        }

        // Check scroll
        scroll = this.checkScroll(scroll);

        if (Math.abs(scroll - scroll_) > 0.5) {
            if (prop.Panel.smoothScroll) {
                scroll___ += (scroll - scroll___) * (1 - Math.pow(0.9, time_dl / 4));
                scroll__ += (scroll___ - scroll__) * (1 - Math.pow(0,9, time_dl / 4));
                scroll_ += (scroll__ - scroll_) * (1 - Math.pow(0,9, time_dl / 4));
            } else {
                scroll_ = scroll;
            }
            time_s.Reset();
            fb.trace("on timer");
            return true;
        }

        return false;
    }

    this.checkScroll = function(scroll___) {
        scroll___ = Math.round(scroll___ / this.rowHeight) * this.rowHeight;
        if (scroll___ > (this.totalHeight - this.h + this.rowHeight)) 
            scroll___ = Math.round((this.totalHeight - this.h + this.rowHeight) / this.rowHeight - 0.5) * this.rowHeight;
        if (this.totalHeight < this.h || scroll___ < 0)
            scroll___ = 0;
        return scroll___;
    }

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    this.totalHeight = 0;
    this.hasScrollbar = false;
    this.rowHeight = prop.PLST.rowHeight;


    this.setSize = function (x, y, w, h) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.w = w || this.w;
        this.h = h || this.h;
        //
        this.totalHeight = list_dr.length * this.rowHeight;
        this.hasScrollbar = this.totalHeight > this.h;
    }

    this.getPlayingIdx = function (a, b) {
        try {
            var playingItem = plman.GetPlayingItemLocation();
            var playingIdx = -1;
            if (playingItem.IsValid && playingItem.PlaylistIndex == plman.ActivePlaylist) {
                playingIdx = playingItem.PlaylistItemIndex;
            }
            for (var i = a; i < b; i++) {
                if (playingIdx == i)
                    break;
            }
            return playingIdx;
        } catch (e) {};
        return -1;
    }

    this.draw = function(gr) {

        // do not draw bg here

        var start_ = 0, end_ = 0;
        var ry, rx = this.x + 10,
            rw = this.w - 20 - (this.hasScrollbar ? 10 : 0);

        start_ = Math.round(scroll_ / this.rowHeight + 0.4);
        end_ = Math.round((scroll_ + this.h) / this.rowHeight - 0.5);
        end_ = (list_dr.length < end_) ? list_dr.length : end_;

        for (var i = start_; i < end_; i++) {
            // calc row y;
            ry = this.y + this.rowHeight * i - scroll_;

            // Odd/Even
            gr.FillSolidRect(rx, ry, rw, this.rowHeight, i % 2 ? 0x09ffffff : 0x09000000);
        }

    }



    var __this__ = this;
    window.SetTimeout(function () {
        list = plman.GetPlaylistItems(plman.ActivePlaylist);
        scroll = 0;
        __this__.getList();
        __this__.repaint();
    }, 100);


}();




var ww, wh;
var marginTop = 115;
var tmp_out;


function on_size() {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) {
        return;
    }

    plstViewer.setSize(0, marginTop, ww, wh - marginTop);

    repaint_main1 = repaint_main2;
    repaint_f1 = repaint_f2;
    tmp_out = window.SetInterval(function () {
        if (window.IsVisible) {
            repaint_main1 = repaint_main2;
            repaint_f1 = repaint_f2;
            tmp_out && window.ClearInterval(tmp_out);
        }
    }, 500);

}


function on_paint(gr) {
    if (!repaint_main && !repaint_f) {
        repaint_main = repaint_f = true;
    }
    if (repaint_main) {
        repaint_main = false;
        gr.FillSolidRect(0, marginTop, ww, wh - marginTop, 0x20000000);
        plstViewer.draw(gr);
    }
    if (repaint_f) {
        repaint_f = false;
    }
}



window.SetInterval(function () {

    var d = new Date();
    if (d.getTime() - time222 < prop.Panel.refreshInterval - 1)
        return;
    else 
        time222 = d.getTime();

    var repaint_1 = false,
        repaint_2 = false;

    if (repaint_f1 == repaint_f2) {
        repaint_f2 = !repaint_f1;
        repaint_1 = true;
    }
    if (repaint_main1 == repaint_main2) {
        repaint_main2 = !repaint_main1;
        repaint_2 = true;
    }
    
    // ONTIMER functions

    repaint_2 = plstViewer.onTimer();

    // handle repaint
    if (repaint_1 && repaint_2) {
        repaint_main = true;
        repaint_f = true;
        fb.trace("full repaint");
        window.Repaint();
    } else if (repaint_1) {
        repaint_f = true;
        fb.trace("repaint_f");
        window.RepaintRect(0, 0, ww, marginTop, true);
    } else if (repaint_2) {
        repaint_main = true;
        fb.trace("repaint_main");
        (wh > marginTop) && 
            window.RepaintRect(0, marginTop, ww, wh - marginTop, true);
    }
}, 1000);





//vim: set sw=4 ts=4 ft=javascript fileencoding=utf-8 bomb et:
