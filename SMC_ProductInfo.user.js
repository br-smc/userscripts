// ==UserScript==
// @name        ProductInfo
// @namespace   SMCTools
// @version     2.22
// @description Displays information about products in SMC product repository
// @grant       none
// @include     http://smc*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @run-at      document-idle
// @downloadURL https://github.com/br-smc/userscripts/raw/master/SMC_ProductInfo.user.js
// ==/UserScript==

var Product = top.Product || {};

Product.Debug = (function(){
  var DEBUG = false;
  return {
    log: function(logOutput){
      if (DEBUG) {
        if( $.type(logOutput) == "object" ) {
          console.log("DBG:Product>> Object: " + logOutput);
          console.log(logOutput);
        } else {
          console.log("DBG:Product>> " + logOutput);
        }
      }
    }
  };
})();

Product.CHECK = (function() {
	return {
		IsProductPage: 	function(win) {
			if( $.isWindow(win) ) {
				var url = $(win.location).attr("href");
				if(
					url.indexOf("/plugin-transformer") > 0 &&
					url.indexOf("&objType=product&") > 0 &&
					url.indexOf("&trafo=HTML&") > 0
				) {
					return true;
				}
			}
			return false;
		}
	};
})();

Product.COLOR = {
	ONLINE: {
		FG: "#ffffff",
		BG: "#00a000",
		BGdark: "#008000",
	},
	OFFLINE: {
		FG: "#ffffff",
		BG: "#ff0000",
		BGdark: "#800000",
	},
	UNKNOWN: {
		FG: "#000000",
		BG: "#e0e0e0",
	},
	HIDDEN: {
		FG: "#ffffff",
		BG: "#ff0000",
		BGdark: "#800000",
	},
	VISIBLE: {
		FG: "#ffffff",
		BG: "#008000",
	},
	CUSTOM: {
		FG: "#000000",
		BG: "#ff8040",
	},
	NOTVALID: {
		BG: "#808080",
	},
};

Product.Info = (function(context) {
	function OnlineStatusOfProduct(context) {
		var OnlineStatus = null;
		$("tr:contains('online')", context).each(function(index) {
			switch($(this).text()) {
				case "onlinefalse": OnlineStatus = false; break;
				case "onlinetrue":  OnlineStatus = true;  break;
			}
		});
    Product.Debug.log("OnlineStatusOfProduct: " + OnlineStatus);
		return OnlineStatus;
	}
	
	function IsSAPExport(context) {
		var SAPExport = null;
		$("tr:contains('sap_export')", context).each(function(index) {
			switch($(this).text()) {
				case "sap_exportfalse": SAPExport = false; break;
				case "sap_exporttrue":  SAPExport = true;  break;
			}
		});
    Product.Debug.log("IsSAPExport: " + SAPExport);
		return SAPExport;
	}

	function IsProductHidden(context) {
		var HiddenProduct = null;
		$("tr:contains('hidehier')", context).each(function(index) {
			switch($(this).text()) {
				case "hidehier0": HiddenProduct = false; break;
				case "hidehier1": HiddenProduct = true;  break;
			}
		});
    Product.Debug.log("IsProductHidden: " + HiddenProduct);
		return HiddenProduct;
	}
	
	function IsHierarchyAssigned(context) {
    var HierarchyAssigned = null;
		if ( $("div:contains('Hierarchy:xxxxxxxxxx')", context).length > 0 ) {
			HierarchyAssigned = false;
		} else if ( $("div:contains('Hierarchy:')", context).length > 0 ) {
			HierarchyAssigned = true;
		}
    Product.Debug.log("IsHierarchyAssigned: " + HierarchyAssigned);
    return HierarchyAssigned;
	}
	
	function IsCustomizedProduct(context) {
    var CustomizedProduct = null;
		if ( $("p:contains('kunnr: *')", context).length > 0 ) {
			CustomizedProduct = false;
		} else if ( $("p:contains('kunnr:')", context).length > 0 ) {
			CustomizedProduct = true;
		}
    Product.Debug.log("IsCustomizedProduct: " + CustomizedProduct);
	}
	
	function GetSPart(context) {
		var SPart = "";
		$("tr:contains('spart')", context).each(function(index) {
			SPart = $(this).text().replace( "spart", "");
		});
    Product.Debug.log("SPart: " + SPart);
		return SPart;
	}
	
	var AddInfoToH1_leftpos = 0;
	function AddInfoToH1( text, popup, fgcolor, bgcolor, leftpos = undefined, context = undefined ) {
		if (typeof leftpos == 'undefined') {
			AddInfoToH1_leftpos += 8;
			leftpos = AddInfoToH1_leftpos;
		} else {
			AddInfoToH1_leftpos = leftpos;
		}
    if (typeof context == 'undefined') {
			Product.Debug.log("Context is undefined!");
			context = document;
		}
    
		if ( $("#ProductInfoBox", context).length == 0 ) {
			Product.Debug.log("#ProductInfoBox is missing and will be inserted.");
			$("h1", context).after( $("<div id='ProductInfoBox'></div>") );
			$("#ProductInfoBox", context).css({
				"position": 				"fixed",
				"width": 						"100%",
				"top": 							"8px",
				"right": 						"0px",
				"padding": 					"0",
				"margin": 		      "0"
			});
		}
		$("#ProductInfoBox", context).append(
				"<span " +
				"title='" + popup + "' " +
				"style='font-size: 8pt; color: " + fgcolor + "; " +
				"background-color: " + bgcolor + "; " +
				"padding: 0; " +
				"float: right; " +
				"margin: 0; " +
				"margin-right: 8px; " +
				"cursor: hand; " +
				"border: solid 1px #ffffff;'>"+
				"&nbsp;" + text + "&nbsp;" +
			"</span>");
	}

	return {
		Show: function(COLOR, context) {
			var STATUS_FGCOLOR = COLOR.UNKNOWN.FG;
			var STATUS_BGCOLOR = COLOR.UNKNOWN.BG;
			var STATUS;
			
      Product.Debug.log("context: " + context);
      Product.Debug.log(context);
			$("#ProductInfoBox", context).remove();
			
			if ( OnlineStatusOfProduct(context) === true ) {
				STATUS = "1";
			} else if ( OnlineStatusOfProduct(context) === false ) {
				STATUS = "0";
			} else {
				STATUS = "-";
			}
			if ( STATUS != "-" ) {
				if ( IsProductHidden(context) === true ) {
					STATUS += "1";
				} else {
					STATUS += "0";
				}
				if ( IsHierarchyAssigned(context) === true ) {
					STATUS += "1";
				} else {
					STATUS += "0";
				}
			} else {
				STATUS = "---";
			}

			// ============================================================
			// Informaation about product
			var PRODHIER = {
				FGCOLOR:	"",
				BGCOLOR:	"",
				TEXT:			"",
				TOOLTIP:	"",
			};
			var SWEBHIER = {
				FGCOLOR:	"",
				BGCOLOR:	"",
				TEXT:			"",
				TOOLTIP:	"",
			};
			switch (STATUS) {
				case "000": 
					PRODHIER.FGCOLOR = "";
					PRODHIER.BGCOLOR = "";
					PRODHIER.TEXT    = "";
					PRODHIER.TOOLTIP = "";
					SWEBHIER.FGCOLOR = "";
					SWEBHIER.BGCOLOR = "";
					SWEBHIER.TEXT    = "";
					SWEBHIER.TOOLTIP = "";
					break;
				case "001": break;
				case "010": break;
				case "011": break;
				case "101": break;
				case "110": break;
				case "101": break;
				case "111": break;
			}

			// ============================================================
			// online status of products
			if ( OnlineStatusOfProduct(context) === true ) {
				STATUS_FGCOLOR = COLOR.ONLINE.FG;
				STATUS_BGCOLOR = COLOR.ONLINE.BG;
				$("h1", context).prop("title", "WEB export flag of product is set!");
				AddInfoToH1( 
					"Homepage: <b>YES</b>", 
					"WEB export flag of product is set!",
					COLOR.ONLINE.FG,
					COLOR.ONLINE.BGdark,
					undefined,
					context
				);
			} else if ( OnlineStatusOfProduct(context) === false) {
				STATUS_FGCOLOR = COLOR.OFFLINE.FG;
				STATUS_BGCOLOR = COLOR.OFFLINE.BG;
				$("h1", context).prop("title", "WEB export flag of product is NOT set!");
				AddInfoToH1(
					"Homepage: <b>NO</b>", 
					"WEB export flag of product is set!",
					COLOR.OFFLINE.FG,
					COLOR.OFFLINE.BGdark,
					undefined,
					context
				);
			} else {
				AddInfoToH1(
					"Dummy/Placeholder product",
					"This product was not exported from SAP, \n" +
						"but created in SMC by an editor. \n" +
						"Probably it will only be used in datasheets \n" +
						"and never be exported to the B&R homepage.",
					COLOR.UNKNOWN.FG,
					COLOR.UNKNOWN.BG,
					undefined,
					context
				);
			}
			
			$("h1", context).css({
				"color":            STATUS_FGCOLOR,
				"background-color": STATUS_BGCOLOR,
				
				"position": 				"fixed",
				"width": 						"100%",
				"top": 							"0",
				"left": 						"0",
				"padding": 					"4px 0 4px 1.75em",
				"margin": 		      "0",
				"margin-bottom":		"4em"
			});
			$(".container-cms", context).css({
				"margin-top": 			"4em"
			});

			// ============================================================
			// Mark customer product
			var leftPos = 0;
			if ( IsCustomizedProduct(context) === true ) {
				leftPos += 8;
				AddInfoToH1(
					"CUSTOMER product (" + GetSPart(context) + ")",
					"On Homepage customer products are only displayed \nto logged in users with appropriate rights.",
					COLOR.CUSTOM.FG,
					COLOR.CUSTOM.BG,
					leftPos,
					context
				);
			}
			
			if ( OnlineStatusOfProduct(context) !== null ) {
				// ============================================================
				// Information about "Hide in Hierarchie"
				var hiddenInfo;
				var hiddenFGColor;
				var hiddenBGColor;
				var hiddenToolTip;
				
				leftPos += 8;
				if ( IsProductHidden(context) === true ) {
					hiddenInfo  = "HIDE in product hierarchy";
					hiddenFGColor = COLOR.HIDDEN.FG;
					if ( OnlineStatusOfProduct(context) == true ) {
						hiddenBGColor = COLOR.HIDDEN.BG;
						hiddenToolTip = "On Homepage product can NOT be found in section PRODUCTS, \nbut with the search function.";
					} else {
						hiddenBGColor = COLOR.NOTVALID.BG;
						hiddenToolTip = "This setting has no effect, \nbecause WEB export flag is NOT set.";
					}
				} else {
					hiddenInfo  = "SHOW in product hierarchy";
					hiddenFGColor = COLOR.VISIBLE.FG;
					if ( OnlineStatusOfProduct(context) == true ) {
						hiddenBGColor = COLOR.VISIBLE.BG;
						hiddenToolTip = "On Homepage product can be found in section PRODUCTS, \nand also with the search function.";
					} else {
						hiddenBGColor = COLOR.NOTVALID.BG;
						hiddenToolTip = "This setting has no effect, \nbecause WEB export flag is NOT set.";
					}
				}
				AddInfoToH1(
					hiddenInfo,
					hiddenToolTip,
					hiddenFGColor,
					hiddenBGColor,
					leftPos,
					context
				);

				// ============================================================
				// Ist Produkt in SAP WEB Marketing Hierarchie?
				if ( IsHierarchyAssigned() === false ) {
					leftPos += 8;
					AddInfoToH1(
						"NOT in SAP marketing hierarchy",
						"If product should be found in section PRODUCTS on homepage, \nin SAP the product has to be assigned to a WEB marketing hierarchy.",
						COLOR.HIDDEN.FG,
						COLOR.HIDDEN.BGdark,
						leftPos,
						context
					);
				}
			}
		}
	}
})();

Product.Data = (function() {
	var FILTER = {
		SAP: {
			Normkennzeichen:         "tr[smcid^='CL_NORMKZ_']",
			Motordaten:              "tr[smcid^='CL_MOTOR_']",
			Motorfamiliendaten:      "tr[smcid^='CL_MOT_FAM_']",
			Getriebedaten:           "tr[smcid^='CL_GETRIEBE_']",
			Getriebefamiliendaten:   "tr[smcid^='CL_GET_FAM_']",
			Produktbeschreibung:     "tr[smcid^='CL_PRODUKT_BESCHR_']",
			EPLAN:                   "tr[smcid^='EPLAN_P8_']"
		},
		TD_FIRST:	"td:first",
		TD_LAST:		"td:last"
	};
	
	return {
		FormatSAPData: function(context) {
			
      Product.Debug.log("context: " + context);
      Product.Debug.log(context);

			// ============================================================
			// certifications
			$(FILTER.SAP.Normkennzeichen, context).css({
				"color": "blue",
				"font-style": "italic"
			});
			$(FILTER.SAP.Normkennzeichen, context).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid blue 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid blue 2px"
				});
			});
			
			// ============================================================
			// motor data
			$(FILTER.SAP.Motordaten, context).css({
				"color": "darkblue",
				"font-style": "italic"
			});
			$(FILTER.SAP.Motordaten, context).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid darkblue 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid darkblue 2px"
				});
			});
			
			// ============================================================
			// motor family data
			$(FILTER.SAP.Motorfamiliendaten, context).css({
				"color": "#c06030",
				"font-style": "italic"
			});
			$(FILTER.SAP.Motorfamiliendaten, context).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid #c06030 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid #c06030 2px"
				});
			});
			
			// ============================================================
			// gear data
			$(FILTER.SAP.Getriebedaten, context).css({
				"color": "darkblue",
				"font-style": "italic"
			});
			$(FILTER.SAP.Getriebedaten, context).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid darkblue 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid darkblue 2px"
				});
			});
			
			// ============================================================
			// gear family data
			$(FILTER.SAP.Getriebefamiliendaten, context).css({
				"color": "#c06030",
				"font-style": "italic"
			});
			$(FILTER.SAP.Getriebefamiliendaten, context).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid #c06030 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid #c06030 2px"
				});
			});
			
			// ============================================================
			// EPLAN data
			$(FILTER.SAP.EPLAN, context).css({
				"color": "#c06030",
				"font-style": "italic"
			});
			$(FILTER.SAP.EPLAN, context).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid #f08030 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid #f08030 2px"
				});
			});
		}
	};
})();

Product.Update = (function(){
  return {
		All: function(repeat) {
      if( Product.CHECK.IsProductPage(top) ) {
        Product.Debug.log("Start Info.Show");
        Product.Info.Show(Product.COLOR, document);
        Product.Debug.log("Finished Info.Show");
        Product.Debug.log("Start Data.FormatSAPData");
        Product.Data.FormatSAPData(document);
        Product.Debug.log("Finished Data.FormatSAPData");
      } else {
        $('iframe[id^="ifContent"]').each( function(index) {
          if( 
            $(this).is(":hidden") === false && 
            $(this).get(0).contentDocument.readyState == "complete" && 
            Product.CHECK.IsProductPage($(this).get(0).contentWindow) 
          ) {
            if( $("#ProductInfoBox", $(this).get(0).contentDocument).length == 0 ) {
              var context;
              //context = $(this).get(0).contentDocument;
              context = $(this).contents().find("body");
              Product.Debug.log("Start Info.Show");
              Product.Info.Show(Product.COLOR, context);
              Product.Debug.log("Finished Info.Show");
              Product.Debug.log("Start Data.FormatSAPData");
              Product.Data.FormatSAPData(context);
              Product.Debug.log("Finished Data.FormatSAPData");
            }
          }
        });
        if (typeof repeat !== 'undefined') {
          top.setTimeout( function(){ Product.Update.All(repeat); }, repeat);
        }
      }
		}
	};
})();

$(document).ready(function(){
  if (self == top) Product.Update.All(1000);
});
