//const { Vector3 } = require("three");

function main(){

//========================= Escenas ============================
	const scene = new THREE.Scene();


//========================== Ejes =============================

//-------------------------- Eje X ----------------------------
	const ejeXvertices = [];
	ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
	ejeXvertices.push( new THREE.Vector3( 3, 0, 0 ) );
	const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );

	const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
	const ejeX = new THREE.Line( geometriaX, colorEjeX );

	scene.add(ejeX);

//-------------------------- Eje Y ----------------------------
	const ejeYvertices = [];
	ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
	ejeYvertices.push( new THREE.Vector3(  0, 3, 0 ) );
	const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );

	const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
	const ejeY = new THREE.Line( geometriaY, colorEjeY );

	scene.add(ejeY);

//-------------------------- Eje Z ----------------------------
	const ejeZvertices = [];
	ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
	ejeZvertices.push( new THREE.Vector3(  0, 0, 3 ) );
	const colorEjeZ = new THREE.LineBasicMaterial( { color:   0x3498db  } );
	
	const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices );
	const ejeZ = new THREE.Line( geometriaZ, colorEjeZ );

	scene.add(ejeZ);
	
//---------------------- Activar/desactivar ejes ------------------------	
	var ejes = true;
	function verEjes(booleano){
		if(booleano){
			scene.add(ejeX);
			scene.add(ejeY);
			scene.add(ejeZ);
			ejes = false;
		}else{
			scene.remove(ejeX);
			scene.remove(ejeY);
			scene.remove(ejeZ);
			ejes = true;
		}
	}

//========================= Luces =============================
	const color = 0xFFFFFF;
	const intensity = 1;
	const ambientLight = new THREE.AmbientLight(color, intensity);
	const pointLight = new THREE.PointLight(color, intensity);
	pointLight.position.set(0, 7, 0);
	scene.add(ambientLight);
	scene.add(pointLight);

//========================= Camara =============================
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20);
	camera.position.x = 3;
	camera.position.y = 3;
	camera.position.z = 3;
	camera.lookAt(0,0,0);
	scene.add(camera);

//========================== Cubo ==============================
	
	const geometriaCaja = new THREE.BoxGeometry( 1, 1, 1 );
	//const wireframe = new THREE.WireframeGeometry( geometriaCaja );
	
	//var mat = new THREE.LineBasicMaterial( { color: 0x673ab7  } );
	var mat = new THREE.MeshToonMaterial( { color: 0x673ab7  } );
	
	//const line = new THREE.LineSegments( wireframe, mat );
	const cubo = new THREE.Mesh( geometriaCaja, mat );

	scene.add( cubo );

//========================== Render =============================
	var canvas = document.querySelector('#mi_canvas');
	const renderer = new THREE.WebGLRenderer({canvas: canvas});
	//renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render(scene, camera);

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}
	
//========================= Eventos ============================

//------------------------- Teclado ----------------------------
	function keyFunction(e) {
		switch (e.key){
			case "e":
				verEjes(ejes);
			break;
			case "a":
				scene.add( cubo );
			break;
			case "q":
				scene.remove( cubo );
			break;
			
		}
	}
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);

//============================ GUI ============================

	function degToRad(deg){
		return 3.1415 * deg / 180.0;
	}

	let rotacion = { x: 0.0, y: 0.0, z: 0.0};
	let traslacion = {x: 0.0, y: 0.0, z: 0.0};

	const gui1 = new dat.GUI( { autoPlace: false } );	
	var customContainer = document.querySelector('#gui').append(gui1.domElement);
	
	const rotacionGUI = gui1.addFolder('Rotacion');
	rotacionGUI.add(rotacion, 'x', 0, 360, 10).name('x').onFinishChange((value) => cubo.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), degToRad(rotacion.x)));
	rotacionGUI.add(rotacion, 'y', 0, 360, 10).name('y').onFinishChange((value) => cubo.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(rotacion.y)));
	rotacionGUI.add(rotacion, 'z', 0, 360, 10).name('z').onFinishChange((value) => cubo.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), degToRad(rotacion.z)));

	
	const traslacionGUI = gui1.addFolder('Traslacion');
	traslacionGUI.add(traslacion, 'x', 0, 3, 0.5).onFinishChange((value) => cubo.translateOnAxis(new THREE.Vector3(1, 0, 0), traslacion.x - cubo.position.x));
	traslacionGUI.add(traslacion, 'y', 0, 3, 0.5).onFinishChange((value) => cubo.translateOnAxis(new THREE.Vector3(0, 1, 0), traslacion.y - cubo.position.y));
	traslacionGUI.add(traslacion, 'z', 0, 3, 0.5).onFinishChange((value) => cubo.translateOnAxis(new THREE.Vector3(0, 0, 1), traslacion.z - cubo.position.z));
		

	const escaladoGUI = gui1.addFolder('Escalado');
	escaladoGUI.add(cubo.scale, 'x', 0, 3).name('Ancho').listen();
	escaladoGUI.add(cubo.scale, 'y', 0, 3).name('Alto').listen();
	escaladoGUI.add(cubo.scale, 'z', 0, 3).name('Largo').listen();

	gui1.add(cubo.material, 'wireframe').listen();

//========================= Visualiza =========================

	function animate() {
		requestAnimationFrame( animate );

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render( scene, camera );
	};


	animate()
}

window.addEventListener('load', main);