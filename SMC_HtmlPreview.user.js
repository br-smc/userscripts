// ==UserScript==
// @name        HTML-Preview
// @namespace   https://github.com/br-smc/userscripts
// @version     0.2
// @description Displays information about characterizations
// @author      Guido Erlinger
// @grant       none
// @match       http://smc.br-automation.com/plugin-transformer?*
// @match       http://smc-qs.br-automation.co.at/plugin-transformer?*
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://github.com/br-smc/userscripts/raw/master/SMC_HtmlPreview.user.js
// @updateURL   https://github.com/br-smc/userscripts/raw/master/SMC_HtmlPreview.meta.js
// @run-at      document-idle
// ==/UserScript==

var HtmlPreview = top.HtmlPreview || {};

HtmlPreview.Debug = (function () {
    var DEBUG = true;
    return {
        log: function (logOutput) {
            if (DEBUG) {
                if ($.type(logOutput) == "object") {
                    console.log("DBG:Html >> Object: " + logOutput);
                    console.log(logOutput);
                } else {
                    console.log("DBG:Html >> " + logOutput);
                }
            }
        }
    };
})();

HtmlPreview.FILTER = {
    METAFILTER:  ".metafilter",
    PRELIMINARY: "[title*='Preliminary']",
};

HtmlPreview.COLOR = {
    PRELIMINARY: {
        FG: "#800000",
        BG: "#FFEEEE",
        BORDER: "#800000",
        BGdark: "#800000",
    },
    UNKNOWN: {
        FG: "#000000",
        BG: "#e0e0e0",
    },
};

HtmlPreview.CHECK = (function () {
    return {
        IsHtmlPreviewPage: function (win) {
            if ($.isWindow(win)) {
                var url = $(win.location).attr("href");
                if (
                    url.indexOf("/plugin-transformer") > 0 &&
                    url.indexOf("&objType=doc&") > 0 &&
                    url.indexOf("&trafo=HTML") > 0
                ) {
                    return true;
                }
            }
            return false;
        }
    };
})();

HtmlPreview.Info = (function (context) {
    function CountPRELIMINARY(context) {
        var cntPRE = 0;
        $(HtmlPreview.FILTER.PRELIMINARY, context).each(function (index) {
            cntPRE++;
        });
        HtmlPreview.Debug.log("Amount of PRELIMINARY elements: " + cntPRE);
        return cntPRE;
    }

    var AddInfoToH1_leftpos = 0;
    function AddInfoToH1(text, popup, fgcolor, bgcolor, leftpos = undefined, context = undefined) {
        if (typeof leftpos == 'undefined') {
            AddInfoToH1_leftpos += 8;
            leftpos = AddInfoToH1_leftpos;
        } else {
            AddInfoToH1_leftpos = leftpos;
        }
        if (typeof context == 'undefined') {
            HtmlPreview.Debug.log("Context is undefined!");
            context = document;
        }

        if ($("#Html", context).length == 0) {
            HtmlPreview.Debug.log("#Html is missing and will be inserted.");
            $("h1", context).after($("<div id='Html'></div>"));
            $("#Html", context).css({
                "position": "fixed",
                "width": "100%",
                "top": "8px",
                "right": "0px",
                "padding": "0",
                "margin": "0"
            });
        }
        $("#Html", context).append(
            "<span " +
            "title='" + popup + "' " +
            "style='font-size: 8pt; color: " + fgcolor + "; " +
            "background-color: " + bgcolor + "; " +
            "padding: 0; " +
            "float: right; " +
            "margin: 0; " +
            "margin-right: 8px; " +
            "cursor: hand; " +
            "border: solid 1px #ffffff;'>" +
            "&nbsp;" + text + "&nbsp;" +
            "</span>");
    }

    return {
        Show: function (COLOR, context) {
            var STATUS_FGCOLOR = COLOR.PRELIMINARY.FG;
            var STATUS_BGCOLOR = COLOR.PRELIMINARY.BG;
            var cntPRE;

            HtmlPreview.Debug.log("context: " + context);
            HtmlPreview.Debug.log(context);

            cntPRE = CountPRELIMINARY();
            if (cntPRE > 0 ) {
                $("#HtmlPreviewInfoBox", context).remove();

                $("h1", context).css({
                    "color": STATUS_FGCOLOR,
                    "background-color": STATUS_BGCOLOR,
                    "position": "fixed",
                    "width": "100%",
                    "top": "0",
                    "left": "0",
                    "padding": "4px 0 4px 1.75em",
                    "margin": "0",
                    "margin-bottom": "4em"
                });
                $(".container-cms", context).css({
                    "margin-top": "4em"
                });
                var leftPos = 0;

                AddInfoToH1("Found PRELEMINARY content: " + cntPRE, "test", "white", COLOR.PRELIMINARY.BGdark)
            }
        }
    }
})();

HtmlPreview.Content = (function () {
    return {
        FormatPRELIMINARY: function (context) {

            HtmlPreview.Debug.log("context: " + context);
            HtmlPreview.Debug.log(context);

            // ============================================================
            // PRELIMINARY content
            $(HtmlPreview.FILTER.PRELIMINARY, context).css({
                "background-color": HtmlPreview.COLOR.PRELIMINARY.BG,
                "border": "2px solid " + HtmlPreview.COLOR.PRELIMINARY.BORDER,
                "margin": 4px,
                "padding": 4px,
                "border-radius": 4px
            });
        }
    };
})();

HtmlPreview.Update = (function () {
    return {
        All: function (repeat) {
            var HtmlPreviewWindow = null;
            if (HtmlPreview.CHECK.IsHtmlPreviewPage(self)) HtmlPreviewWindow = self;
            if (HtmlPreviewWindow == null) {
                HtmlPreview.Debug.log("Invalid HtmlPreview window!");
            } else {
                HtmlPreview.Debug.log("Start Info.Show");
                HtmlPreview.Info.Show(HtmlPreview.COLOR, document);
                HtmlPreview.Debug.log("Finished Info.Show");
                HtmlPreview.Debug.log("Start Content.FormatPRELIMINARY");
                HtmlPreview.Content.FormatPRELIMINARY(document);
                HtmlPreview.Debug.log("Finished Content.FormatPRELIMINARY");
            }
        }
    };
})();

HtmlPreview.Debug.log("Initzialization done!");
HtmlPreview.Debug.log("Attach function to document.ready");

$(document).ready(function () {
    HtmlPreview.Debug.log("jquery: Document is ready!");
    HtmlPreview.Update.All(2000);
});