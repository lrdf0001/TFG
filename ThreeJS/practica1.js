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
	
//========================= Camara =============================
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 15 );
	camera.position.x = 2;
	camera.position.y = 2;
	camera.position.z = 5;
	camera.lookAt(0,0,0);
	scene.add(camera);

//========================== Cubo ==============================
	
	const geometriaCaja = new THREE.BoxGeometry( 1, 1, 1 );
	const wireframe = new THREE.WireframeGeometry( geometriaCaja );
	var mat = new THREE.LineBasicMaterial( { color: 0x673ab7  } );
	const line = new THREE.LineSegments( wireframe, mat );

	scene.add( line );

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
			
			
			line.rotation.x += 0.01;
			line.rotation.y += 0.01;
			
			camera.aspect = window.innerWidth / window.innerHeight;			
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.render( scene, camera);
		};


	animate()
}

window.addEventListener('load', main);