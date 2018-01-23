// ==UserScript==
// @name        GUI
// @namespace   SMCTools
// @version     2.22
// @description Displays information about products in SMC product repository
// @grant       none
// @include     http://smc*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @run-at      document-idle
// @downloadUrl https://github.com/br-smc/userscripts/raw/master/SMC_GUI.user.js
// ==/UserScript==

var GUI = window.GUI || {};

GUI.MAIN = (function(){
	return {
		Format: function() {
			$('head').append(`
				<style type="text/css">
					.smc-doc, .title_ct_icon.doc, .smc-media-image-container.doc {
						background-image: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDggNDgiPjxwb2x5Z29uIGZpbGw9IiNkZGQiIHBvaW50cz0iNDAsNDUgOCw0NSA4LDMgMzAsMyA0MCwxMyIvPjxwb2x5Z29uIGZpbGw9IiNiYmIiIHBvaW50cz0iMzguNSwxNCAyOSwxNCAyOSw0LjUiLz48ZyBmaWxsPSIjODg4Ij48cmVjdCB4PSIxNiIgeT0iMjEiIHdpZHRoPSIxNyIgaGVpZ2h0PSIyIi8+PHJlY3QgeD0iMTYiIHk9IjI1IiB3aWR0aD0iMTMiIGhlaWdodD0iMiIvPjxyZWN0IHg9IjE2IiB5PSIyOSIgd2lkdGg9IjE3IiBoZWlnaHQ9IjIiLz48cmVjdCB4PSIxNiIgeT0iMzMiIHdpZHRoPSIxMyIgaGVpZ2h0PSIyIi8+PC9nPjwvc3ZnPg==") !important;
					}
				</style>`
			);
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
						border-style:  outset;
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
  setTimeout(function(){
    GUI.MAIN.Format();
    GUI.ExplorerPaginator.Format();
  }, 1000);
});
