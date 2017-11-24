// ==UserScript==
// @name        ProductInfo
// @namespace   SMCTools
// @version     2.00
// @description Displays information about products in SMC product repository
// @grant       none
// @include     */plugin-transformer?*&objType=product&*&trafo=HTML*&*
// @run-at      document-idle
// ==/UserScript==

var ProductInfo = window.ProductInfo || {};

ProductInfo.COLOR = {
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

ProductInfo.ProductInfo = (function() {
	function OnlineStatusOfProduct() {
		var OnlineStatus = null;
		$("tr:contains('online')").each(function(index) {
			switch($(this).text()) {
				case "onlinefalse": OnlineStatus = false; break;
				case "onlinetrue":  OnlineStatus = true;  break;
			}
		});
		return OnlineStatus;
	}
	
	function IsSAPExport() {
		var SAPExport = null;
		$("tr:contains('sap_export')").each(function(index) {
			switch($(this).text()) {
				case "sap_exportfalse": SAPExport = false; break;
				case "sap_exporttrue":  SAPExport = true;  break;
			}
		});
		return SAPExport;
	}

	function IsProductHidden() {
		var HiddenProduct = null;
		$("tr:contains('hidehier')").each(function(index) {
			switch($(this).text()) {
				case "hidehier0": HiddenProduct = false; break;
				case "hidehier1": HiddenProduct = true;  break;
			}
		});
		return HiddenProduct;
	}
	
	function IsHierarchyAssigned() {
		if ( $("div:contains('Hierarchy:xxxxxxxxxx')").length > 0 ) {
			return false;
		} else if ( $("div:contains('Hierarchy:')").length > 0 ) {
			return true;
		} return null;
	}
	
	function IsCustomizedProduct() {
		if ( $("p:contains('kunnr: *')").length > 0 ) {
			return false;
		} else if ( $("p:contains('kunnr:')").length > 0 ) {
			return true;
		} else return null;
	}
	
	function GetSPart() {
		var SPart = "";
		$("tr:contains('spart')").each(function(index) {
			SPart = $(this).text().replace( "spart", "");
		});
		return SPart;
	}
	
	var AddInfoToH1_leftpos = 0;
	function AddInfoToH1( text, popup, fgcolor, bgcolor, leftpos ) {
		if (typeof leftpos === 'undefined') {
			AddInfoToH1_leftpos += 8;
			leftpos = AddInfoToH1_leftpos;
		} else {
			AddInfoToH1_leftpos = leftpos;
		}
		if ( $("#ProductInfoBox").length == 0 ) {
			$("<div id='ProductInfoBox'></div>").insertAfter("h1");
			$("#ProductInfoBox").css({
				"position": 				"fixed",
				"width": 						"100%",
				"top": 							"8px",
				"right": 						"0px",
				"padding": 					"0",
				"margin": 		      "0"
			});
		}
		$("#ProductInfoBox").append(
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
		Show: function(COLOR) {
			var STATUS_FGCOLOR = COLOR.UNKNOWN.FG;
			var STATUS_BGCOLOR = COLOR.UNKNOWN.BG;
			
			var STATUS;
			if ( OnlineStatusOfProduct() === true ) {
				STATUS = "1";
			} else if ( OnlineStatusOfProduct() === false ) {
				STATUS = "0";
			} else {
				STATUS = "-";
			}
			if ( STATUS != "-" ) {
				if ( IsProductHidden() === true ) {
					STATUS += "1";
				} else {
					STATUS += "0";
				}
				if ( IsHierarchyAssigned() === true ) {
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
			if ( OnlineStatusOfProduct() === true ) {
				STATUS_FGCOLOR = COLOR.ONLINE.FG;
				STATUS_BGCOLOR = COLOR.ONLINE.BG;
				$("h1").prop("title", "WEB export flag of product is set!");
				AddInfoToH1( 
					"Homepage: <b>YES</b>", 
					"WEB export flag of product is set!",
					COLOR.ONLINE.FG,
					COLOR.ONLINE.BGdark
				);
			} else if ( OnlineStatusOfProduct() === false) {
				STATUS_FGCOLOR = COLOR.OFFLINE.FG;
				STATUS_BGCOLOR = COLOR.OFFLINE.BG;
				$("h1").prop("title", "WEB export flag of product is NOT set!");
				AddInfoToH1(
					"Homepage: <b>NO</b>", 
					"WEB export flag of product is set!",
					COLOR.OFFLINE.FG,
					COLOR.OFFLINE.BGdark
				);
			} else {
				AddInfoToH1(
					"Dummy/Placeholder product",
					"This product was not exported from SAP, \n" +
						"but created in SMC by an editor. \n" +
						"Probably it will only be used in datasheets \n" +
						"and never be exported to the B&R homepage.",
					COLOR.UNKNOWN.FG,
					COLOR.UNKNOWN.BG
				);
			}
			
			$("h1").css({
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
			$(".container-cms").css({
				"margin-top": 			"4em"
			});

			// ============================================================
			// Mark customer product
			var leftPos = 0;
			if ( IsCustomizedProduct() === true ) {
				leftPos += 8;
				AddInfoToH1(
					"CUSTOMER product (" + GetSPart() + ")",
					"On Homepage customer products are only displayed \nto logged in users with appropriate rights.",
					COLOR.CUSTOM.FG,
					COLOR.CUSTOM.BG,
					leftPos
				);
			}
			
			if ( OnlineStatusOfProduct() !== null ) {
				// ============================================================
				// Information about "Hide in Hierarchie"
				var hiddenInfo;
				var hiddenFGColor;
				var hiddenBGColor;
				var hiddenToolTip;
				
				leftPos += 8;
				if ( IsProductHidden() === true ) {
					hiddenInfo  = "HIDE in product hierarchy";
					hiddenFGColor = COLOR.HIDDEN.FG;
					if ( OnlineStatusOfProduct() == true ) {
						hiddenBGColor = COLOR.HIDDEN.BG;
						hiddenToolTip = "On Homepage product can NOT be found in section PRODUCTS, \nbut with the search function.";
					} else {
						hiddenBGColor = COLOR.NOTVALID.BG;
						hiddenToolTip = "This setting has no effect, \nbecause WEB export flag is NOT set.";
					}
				} else {
					hiddenInfo  = "SHOW in product hierarchy";
					hiddenFGColor = COLOR.VISIBLE.FG;
					if ( OnlineStatusOfProduct() == true ) {
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
					leftPos
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
						leftPos
					);
				}
			}
		}
	}
})();

ProductInfo.ProductData = (function() {
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
		FormatSAPData: function() {
			
			// ============================================================
			// certifications
			$(FILTER.SAP.Normkennzeichen).css({
				"color": "blue",
				"font-style": "italic"
			});
			$(FILTER.SAP.Normkennzeichen).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid blue 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid blue 2px"
				});
			});
			
			// ============================================================
			// motor data
			$(FILTER.SAP.Motordaten).css({
				"color": "darkblue",
				"font-style": "italic"
			});
			$(FILTER.SAP.Motordaten).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid darkblue 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid darkblue 2px"
				});
			});
			
			// ============================================================
			// motor family data
			$(FILTER.SAP.Motorfamiliendaten).css({
				"color": "#c06030",
				"font-style": "italic"
			});
			$(FILTER.SAP.Motorfamiliendaten).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid #c06030 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid #c06030 2px"
				});
			});
			
			// ============================================================
			// gear data
			$(FILTER.SAP.Getriebedaten).css({
				"color": "darkblue",
				"font-style": "italic"
			});
			$(FILTER.SAP.Getriebedaten).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid darkblue 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid darkblue 2px"
				});
			});
			
			// ============================================================
			// gear family data
			$(FILTER.SAP.Getriebefamiliendaten).css({
				"color": "#c06030",
				"font-style": "italic"
			});
			$(FILTER.SAP.Getriebefamiliendaten).each( function(index) {
				$(FILTER.TD_FIRST, this).css({
					"border-left": "solid #c06030 2px"
				});
				$(FILTER.TD_LAST, this).css({
					"border-right": "solid #c06030 2px"
				});
			});
			
			// ============================================================
			// EPLAN data
			$(FILTER.SAP.EPLAN).css({
				"color": "#c06030",
				"font-style": "italic"
			});
			$(FILTER.SAP.EPLAN).each( function(index) {
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

ProductInfo.ProductInfo.Show(ProductInfo.COLOR);
ProductInfo.ProductData.FormatSAPData(ProductInfo.COLOR);
