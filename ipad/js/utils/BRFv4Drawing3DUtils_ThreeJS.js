(function() {
	"use strict";

	var d3d					= brfv4.example.drawing3d;
	var defaultValue 		= brfv4.defaultValue;

	d3d.setup = function(canvas) {

		d3d.stage			= canvas;
		d3d.scene			= new THREE.Scene();

		d3d.camera			= new THREE.OrthographicCamera(
			d3d.stage.width  / -2, d3d.stage.width  / 2,
			d3d.stage.height /  2, d3d.stage.height / -2,  50, 10000 );

		d3d.renderer		= new THREE.WebGLRenderer(
			{alpha: true, canvas: d3d.stage, antialias: true});

		d3d.pointLight		= new THREE.PointLight(0xffffff, 0.75, 10000);
		d3d.baseNodes		= [];
		d3d.modelZ			= 4000;

		d3d.renderer.setClearColor(0x000000, 0); // the default
		d3d.renderer.setPixelRatio(window.devicePixelRatio);
		d3d.renderer.setSize(d3d.stage.width, d3d.stage.height, true);

		d3d.scene.add(new THREE.AmbientLight(0xffffff, 0.65));
		d3d.scene.add(d3d.pointLight);

		d3d.occlusionObjects = [];
		d3d.renderWidth 	= d3d.stage.width;
		d3d.renderHeight 	= d3d.stage.height;
	};

	d3d.updateLayout = function(width, height) {

		d3d.renderWidth 	= width;
		d3d.renderHeight 	= height;

		d3d.renderer.setSize(width, height, true);

		d3d.camera.left		= width  / -2;
		d3d.camera.right	= width  /  2;
		d3d.camera.top		= height /  2;
		d3d.camera.bottom	= height / -2;

		d3d.camera.position.set(0, 0, 0);
		d3d.camera.lookAt(new THREE.Vector3(0, 0, 1));
		d3d.camera.updateProjectionMatrix();
	};

	d3d.update = function(index, face, show) {

		if(index >= d3d.baseNodes.length) {
			return;
		}

		var baseNode = d3d.baseNodes[index];
		if(!baseNode) return;

		if (show) {

			var s =  (face.scale / 180);
			var x = -(face.translationX - (d3d.renderWidth  * 0.5));
			var y = -(face.translationY - (d3d.renderHeight * 0.5));
			var z =  d3d.modelZ;

			var rx = THREE.Math.radToDeg(-face.rotationX);
			var ry = THREE.Math.radToDeg(-face.rotationY);
			var rz = THREE.Math.radToDeg( face.rotationZ);

			var rya = ry < 0 ? -ry : ry;
			ry = ry * 0.90;

			baseNode.visible = true;
			baseNode.position.set(x, y, z);
			baseNode.scale.set(s, s, s);
			baseNode.rotation.set(
				THREE.Math.degToRad(rx),
				THREE.Math.degToRad(ry),
				THREE.Math.degToRad(rz)
			);
		} else {
			baseNode.visible = false;				// Hide the 3d object, if no face was tracked.
		}
	};

	d3d.render = function() {
		d3d.renderer.render(d3d.scene, d3d.camera);	// Render the threejs scene.
	};

	d3d.addBaseNodes = function(maxFaces) {

		var containers = d3d.baseNodes;
		var i;
		var group;

		for(i = containers.length; i < maxFaces; i++) {
			group = new THREE.Group();
			group.visible = false;
			containers.push(group);
			d3d.scene.add(group);
		}

		for(i = containers.length - 1; i > maxFaces; i--) {
			group = containers[k];
			d3d.scene.remove(group);
		}
	};

	d3d.loadOcclusionHead = function(url, maxFaces) {

		d3d.addBaseNodes(maxFaces);

		var containers = d3d.baseNodes;
		var loader = new THREE.ObjectLoader();

		loader.load(url, (function(model) {
			// d3d.model = model;

			for(var k = 0; k < containers.length; k++) {
				var mesh = model.clone();
				mesh.position.set(model.position.x, model.position.y, model.position.z);
				mesh.material.colorWrite = false;
				mesh.renderOrder = 0;
				
				d3d.occlusionObjects.push(mesh);
				containers[k].add(mesh);
			}

			d3d.render();

		}));
	};

	d3d.loadModel = function(url, maxFaces) {

		d3d.addBaseNodes(maxFaces);

		var containers = d3d.baseNodes;
		var loader = new THREE.ObjectLoader();

		loader.load(url, (function(model) {
			// d3d.model = model;

			for(var k = 0; k < containers.length; k++) {
				var mesh = model.clone();
				mesh.position.set(model.position.x, model.position.y, model.position.z);
				mesh.renderOrder = 2;
				containers[k].add(mesh);
			}

			d3d.render();

		}));
	};

	d3d.showOcclusionObjects = function(showThem) {

		for(var k = 0; k < d3d.occlusionObjects.length; k++) {
			var mesh = d3d.occlusionObjects[k];
			mesh.material.colorWrite = showThem;
		}
	};

	d3d.hideAll = function() {
		for(var k = 0; k < d3d.baseNodes.length; k++) {
			var baseNode = d3d.baseNodes[k];
			baseNode.visible = false;
		}
		d3d.render();
	};

	d3d.removeAll = function() {
		for(var k = 0; k < d3d.baseNodes.length; k++) {
			var baseNode = d3d.baseNodes[k];
			for(var j = baseNode.children.length - 1; j >= 0; j--) {
				baseNode.remove(baseNode.children[j]);
			}
		}
		d3d.render();
	};
})();
