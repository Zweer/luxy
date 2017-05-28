(function() {
	"use strict";

	if(typeof QuickSettings === "undefined") return;

	var example	= brfv4.example;
	var dom		= example.dom;
	var gui		= example.gui;

	var urlMap 	= {
		"Webcam Setup":		"webcam",
		"Picture Setup":	"picture"
	};
	var labels = [];
	for (var key in urlMap) { labels.push(key); } // Fill in the labels.

	function onSetupChosen(data) {
		example.init(urlMap[data.value]);
	}

	if(!gui.setupChooser) {

		QuickSettings.useExtStyleSheet();

		gui.setupChooser = QuickSettings.create(
			7, 7, "Setup Chooser", dom.createDiv("_settingsLeft"))
			.setWidth(300)
			.addHTML("Switch between setups", "Choose either webcam or loaded picture.<br/><br/>Make sure you opened the https:// URL. Otherwise the webcam may not start in Chrome.")
			.addDropDown("_setup", labels, onSetupChosen)
			.hideTitle("_setup");
	}
})();