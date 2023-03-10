
function main(){

//========================= Escenas ============================
	const scene = new THREE.Scene();


//========================== Ejes =============================

//-------------------------- Eje X ----------------------------
		const ejeXvertices = [];
		ejeXvertices.push( new THREE.Vector3( - 100, 0, 0 ) );
		ejeXvertices.push( new THREE.Vector3(  100, 0, 0 ) );
		const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );

		const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
		const ejeX = new THREE.Line( geometriaX, colorEjeX );

		scene.add(ejeX);

//-------------------------- Eje Y ----------------------------
		const ejeYvertices = [];
		ejeYvertices.push( new THREE.Vector3( 0, -100, 0 ) );
		ejeYvertices.push( new THREE.Vector3(  0, 100, 0 ) );
		const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );

		const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
		const ejeY = new THREE.Line( geometriaY, colorEjeY );

		scene.add(ejeY);

//-------------------------- Eje Z ----------------------------
		const ejeZvertices = [];
		ejeZvertices.push( new THREE.Vector3( 0, 0, -100 ) );
		ejeZvertices.push( new THREE.Vector3(  0, 0, 100 ) );
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
const color = 0xFFFFFF
const intensity = 1
const ambientLight = new THREE.AmbientLight(0x404040)
const pointLight = new THREE.PointLight(color, intensity, 5, 2 )
pointLight.position.set(1, 1, 1)
scene.add(ambientLight)
scene.add(pointLight)

//const dat = require('dat.gui');
const gui = new dat.GUI();
//gui.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
gui.add(pointLight, 'intensity', 0, 2, 0.01);
	
//========================= Camara =============================
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 15 );
camera.position.x = 5;
camera.position.y = 3;
camera.position.z = 5;
camera.lookAt(0,0,0);
scene.add(camera);
	
//========================== Plano ==============================
const geometry = new THREE.PlaneGeometry( 3, 3, 4, 3 ); // width : Float, height : Float, widthSegments : Integer, heightSegments : Integer
//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( {color: 0x7f0000 , side: THREE.DoubleSide, shininess:120} );
const plane = new THREE.Mesh( geometry, material );
plane.rotateX(90*3.14/180);

var distancia = 1.5;
const direccion = new THREE.Vector3( 1, 1, 0 );
plane.translateOnAxis(direccion, distancia);

scene.add( plane );

//========================== Render =============================
var canvas = document.querySelector('#mi_canvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.render(scene, camera);
	
//========================= Eventos ============================

//------------------------- Teclado ----------------------------
	function keyFunction(e) {
		switch (e.key){
			case "e":
				verEjes(ejes);
			break;
			case "a":
				scene.add( line );
			break;
			case "q":
				scene.remove( line );
			break;
			
		}
	}
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);


//========================= Visualiza =========================

		function animate() {
			requestAnimationFrame( animate );
			
			camera.aspect = window.innerWidth / window.innerHeight;			
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.render( scene, camera);
		};


	animate()
}

window.addEventListener('load', main);