// ==UserScript==
// @name        GUI
// @namespace   https://github.com/br-smc/userscripts
// @version     3.10
// @description Change some SMC GUI elements
// @author      Guido Erlinger
// @grant       none
// @match       http://smc.br-automation.com/
// @match       http://smc-qs.br-automation.co.at/
// @downloadURL https://github.com/br-smc/userscripts/raw/master/SMC_GUI.user.js
// @updateURL   https://github.com/br-smc/userscripts/raw/master/SMC_GUI.meta.js
// @run-at      document-idle
// ==/UserScript==

console.log("TEST");

var GUI = top.GUI || {};

GUI.MAIN = (function(){
  return {
    Format: function() {
			if (location.host == "smc-qs.br-automation.co.at") {
				$('head').append(`
					<style type="text/css">
						.smc-ct > .x-panel-header > .x-panel-header-text {
							color: #800000 !important;
						}
						.smc-ct > .x-panel-header > .x-panel-header-text:before {
							content: "" !important;
						}
                        .smc-top-tabs > .x-tab-panel-header {
							background-color: #eeee33 !important;
                        }
                        .smc-top-tabs > .x-tab-panel-header ul.x-tab-strip-top {
							background-color: #eeee33 !important;
                        }
					</style>`
				);
			}
    }
  };
})();

GUI.ExplorerPaginator = (function(){
  return {
    Format: function() {
      $('head').append(`
        <style type='text/css'>
          .paginator-folder {
            margin-top: 4px;
            margin-right: 2px;
          }
          .paginator-folder .page,
          .paginator-folder .page-selected,
          .paginator-folder .page-arrow,
          .paginator-folder .page-arrow-disabled {
            background-color: #e0e0ff;
            color: #8080ff;
            border-style:  solid;
            border-radius: 4px;
            padding-top: 2px;
            padding-bottom: 2px;
          }
          .paginator-folder .page-selected {
            background-color: #d0d0ff;
            color: #6060ff;
          }
          .paginator-folder .page-arrow-disabled {
            background-color: #e7e7e7;
            color: #b0b0b0;
          }
          .paginator-folder .page:hover,
          .paginator-folder .page-arrow:hover {
            border-color: #8080ff;
            border-style: solid;
          }
        </style>`
      );
    }
  };
})();

$(document).ready(function(){
  GUI.MAIN.Format();
  GUI.ExplorerPaginator.Format();
});