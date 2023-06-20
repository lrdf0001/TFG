function main(){
	
//========================= Escena ============================
	const scene = new THREE.Scene()

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
	const ejeYvertices = []
	ejeYvertices.push( new THREE.Vector3( 0, -100, 0 ) )
	ejeYvertices.push( new THREE.Vector3(  0, 100, 0 ) )
	const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } )

	const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices )
	const ejeY = new THREE.Line( geometriaY, colorEjeY )

	scene.add(ejeY)

//-------------------------- Eje Z ----------------------------
	const ejeZvertices = []
	ejeZvertices.push( new THREE.Vector3( 0, 0, -100 ) )
	ejeZvertices.push( new THREE.Vector3(  0, 0, 100 ) )
	const colorEjeZ = new THREE.LineBasicMaterial( { color:   0x3498db  } )
	
	const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices )
	const ejeZ = new THREE.Line( geometriaZ, colorEjeZ )

	scene.add(ejeZ)
	
	//---------------------- Activar/desactivar ejes ------------------------	
		var ejes = false;
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
	const ambientLight = new THREE.AmbientLight(color, 0.2);
	const pointLight = new THREE.PointLight(color, intensity);
	pointLight.position.set(0, 0, 0);
	scene.add(ambientLight);
	scene.add(pointLight);
	
//========================= Camaras =============================

	//---------------------- Perspectiva ------------------------
	var fov = 75;
	var near = 0.1;	
	var far = 50;
	var cameraPersp = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far );
	
	cameraPersp.position.x = 11;
	cameraPersp.position.y = 5;
	cameraPersp.position.z = 11;
	cameraPersp.lookAt(0,0,0);
	scene.add(cameraPersp);

//========================== Modelo =============================
	
	/*
	const geometriaCubo = new THREE.BoxGeometry( 1, 1, 1 );
	const materialCubo = new THREE.MeshToonMaterial( { color:  0x8bc34a  } );
	cubo = new THREE.Mesh(geometriaCubo, materialCubo);
	scene.add(cubo)
	*/
	
	const objects = [];
	
	//---------------------- Sistema Solar ------------------------
	const sistemaSolar = new THREE.Object3D();
	scene.add(sistemaSolar);
	objects.push(sistemaSolar);
	
		//-------------------------- Sol ------------------------------
		const solGeometria = new THREE.SphereBufferGeometry(1, 6, 6);
		const solMaterial = new THREE.MeshToonMaterial( { color: 0xFFFF00});
		sol = new THREE.Mesh(solGeometria, solMaterial);
		sol.scale.set(5, 5, 5);
		sistemaSolar.add(sol);
		objects.push(sol);
	
			//------------------------- Tierra ---------------------------
			const tierraOrbita = new THREE.Object3D();
			tierraOrbita.position.x = 10;
			sistemaSolar.add(tierraOrbita);
			objects.push(tierraOrbita);
			
			const tierraGeometria = new THREE.SphereBufferGeometry(1, 6, 6);
			const tierraMaterial = new THREE.MeshToonMaterial({color: 0x2233FF});
			const tierra = new THREE.Mesh(tierraGeometria, tierraMaterial);
			tierraOrbita.add(tierra);
			objects.push(tierra);
	
				//------------------------- Luna ---------------------------
				const lunaOrbita = new THREE.Object3D();
				lunaOrbita.position.x = 2;
				tierraOrbita.add(lunaOrbita);
				
				const lunaGeometria = new THREE.SphereBufferGeometry(1, 6, 6);
				const lunaMaterial = new THREE.MeshToonMaterial({color: 0x888888});
				const luna = new THREE.Mesh(lunaGeometria, lunaMaterial);
				luna.scale.set(.5, .5, .5);
				lunaOrbita.add(luna);
				objects.push(luna);
	
	
	
//========================== Render =============================
	const canvas = document.querySelector('#mi_canvas');
	const renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render(scene, cameraPersp);
	
//========================= Eventos ============================
	
	// Play y Pause de la animación
	const Animacion = {
		PLAY: 'PLAY',
		PAUSE: 'PAUSE'
	}
	
	var animado = Animacion.PLAY;
	
	//------------------------- Teclado ----------------------------
	function keyFunction(e) {
		switch (e.key){
			case "e":
				verEjes(ejes);
			break;
			
			case "p":
				animado = Animacion.PLAY;
			break;
			
			case "P":
				animado = Animacion.PAUSE;
			break;
		}
	}
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);
	
//========================= Visualiza =========================

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	var ang = 0.01;
	
	function animate() {
		requestAnimationFrame( animate );
		
		if(animado == Animacion.PLAY){
			objects.forEach((obj) => {
				obj.rotation.y += 0.01;
			});
		}
		
		cameraPersp.aspect = window.innerWidth / window.innerHeight;			
		cameraPersp.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.render( scene, cameraPersp);		
	};

animate();

}

//window.addEventListener('load', main);