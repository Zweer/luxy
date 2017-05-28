(function() {
	"use strict";

	if(typeof QuickSettings === "undefined") return;

	var example	= brfv4.example;
	var dom		= example.dom;
	var gui		= example.gui;

	var urlMap 	= {
		"Choose": [],
		"HTML5/Javascript":				"https://www.dropbox.com/s/ypiqndeaakby7bm/170524_BRFv4_JS_TK240517_v4.0b31_trial.zip?dl=0",
		"native C++ for macOS/OpenCV":	"https://www.dropbox.com/s/9evqzpwojqel657/170524_BRFv4_MAC_TK240517_v4.0b31_trial.zip?dl=0"
	};
	var labels = [];
	for (var key in urlMap) { labels.push(key); } // Fill in the labels.

	function onExampleLoaded() {
		example.reinit();
	}

	function onExampleDownload(data) {

		var url = urlMap[data.value];

		if(url) {
			if(typeof url === "string") {
				window.open([url]);
			}
		}
	}

	function onClick(e) {
		window.open("http://www.tastenkunst.com/#/contact");
	}

	if(!gui.downloadChooser) {

		QuickSettings.useExtStyleSheet();

		gui.downloadChooser = QuickSettings.create(
			7, 225, "Download trial SDKs (beta)", dom.createDiv("_settingsLeft"))
			.setWidth(200)
			.addHTML("Disclaimer", "Notice that these examples may change.<br/><br/>" +
				"The packages for macOS (Xcode project) and Windows (Visual Studio project) " +
				"need an installed OpenCV 3.2. for the camera handling.<br/><br/>" +
				"Contact us for a license at:")
			.addButton("www.tastenkunst.com/#/contact", onClick)
			.addDropDown("_download", labels, onExampleDownload)
			.hideTitle("_download");
	}
})();