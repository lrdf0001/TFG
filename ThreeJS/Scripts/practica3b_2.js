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
	pointLight.position.set(-2, 5, 10);
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
	
//========================= Auxiliar ============================
	
	function degToRad (deg){
		return deg * 3.14 / 180.0;
	};

//========================== Modelo =============================
	
	const objects = [];
	
	//---------------------- Brazo ------------------------
	const brazo = new THREE.Object3D();
	scene.add(brazo);
	objects.push(brazo);
	
		//------------------------- Hombro ------------------------------
		const hombroGeometria = new THREE.SphereBufferGeometry(1, 6, 6);
		const hombroMaterial = new THREE.MeshToonMaterial( { color: 0x2233FF});
		hombro = new THREE.Mesh(hombroGeometria, hombroMaterial);
		hombro.rotateX(degToRad(90));
		brazo.add(hombro);
		objects.push(hombro);
		
			//------------------------- Brazo Posterior ------------------------------
			const geometriaCubo = new THREE.BoxGeometry( 1, 1, 5 );
			const materialCubo = new THREE.MeshToonMaterial( { color:  0x2233FF  } );
			posterior = new THREE.Mesh(geometriaCubo, materialCubo);
			posterior.translateZ(2.5);
			hombro.add(posterior);
			
			//------------------------- Codo ------------------------------
			const codoGeometria = new THREE.SphereBufferGeometry(1, 6, 6);
			const codoMaterial = new THREE.MeshToonMaterial( { color: 0x2233FF});
			codo = new THREE.Mesh(codoGeometria, codoMaterial);
			codo.translateZ(5);
			hombro.add(codo);
			//objects.push(codo);
			
				//------------------------- Brazo Anterior ------------------------------
				anterior = new THREE.Mesh(geometriaCubo, materialCubo);
				anterior.translateZ(2.5);
				codo.add(anterior);
				
				//------------------------- Mano ------------------------------
				const manoGeometria = new THREE.SphereBufferGeometry(0.95, 6, 6);
				const manoMaterial = new THREE.MeshToonMaterial( { color: 0xffe082});
				mano = new THREE.Mesh(manoGeometria, manoMaterial);
				mano.translateZ(5);
				codo.add(mano);
				
					//------------------------- Dedos ------------------------------
					dedoGeometria = new THREE.BoxGeometry( 0.2, 0.2, 1.3 );
					dedoMaterial = new THREE.MeshToonMaterial( { color: 0xffe082 });
					
					//Indice					
					dedo = new THREE.Mesh(dedoGeometria, dedoMaterial);
					dedo.rotateY(0.9);
					dedo.translateZ(1.4);					
					mano.add(dedo);					
					
					//Corazon
					dedoGeometria = new THREE.BoxGeometry( 0.2, 0.2, 1.5 );					
					dedo2 = new THREE.Mesh(dedoGeometria, dedoMaterial);
					dedo2.rotateY(0.5);
					dedo2.translateZ(1.5);					
					mano.add(dedo2);
					
					//Anular
					dedoGeometria = new THREE.BoxGeometry( 0.2, 0.2, 1.4 );
					dedo3 = new THREE.Mesh(dedoGeometria, dedoMaterial);
					dedo3.translateZ(1.4);					
					mano.add(dedo3);
					
					//Menique
					dedoGeometria = new THREE.BoxGeometry( 0.2, 0.2, 1.2 );
					dedo4 = new THREE.Mesh(dedoGeometria, dedoMaterial);
					dedo4.rotateY(-0.60);
					dedo4.translateZ(1.2);					
					mano.add(dedo4);
					
					//Pulgar
					dedoGeometria = new THREE.BoxGeometry( 0.75, 0.25, 0.25 );
					dedo5 = new THREE.Mesh(dedoGeometria, dedoMaterial);
					dedo5.translateX(1.25);				
					mano.add(dedo5);

//========================= Animacion ===========================
	
	var angHombro = 90;
	var topeHombroBajo = true;
	var topeHombroArriba = false;
	
	var angMano = 0;
	var izq = false;
	var der = false;
	
	function saludoAnimacion(){
		
		if(topeHombroBajo){//Si el brazo esta bajado, lo levantamos
			hombro.rotateX(degToRad(-0.75));
			codo.rotateX(degToRad(-0.75));
			angHombro = angHombro - 0.75;
		}else{
			if(topeHombroArriba){//Si el brazo esta arriba y ha saludado, lo bajamos
				hombro.rotateX(degToRad(0.75));
				codo.rotateX(degToRad(0.75));
				angHombro = angHombro + 0.75;
			}
		}
				
		if(angHombro == 0){ // Si el brazo se ha levantado
			topeHombroBajo = false;
		}else
			if(angHombro == 90){ // Si se ha bajado
				topeHombroBajo = true;
				topeHombroArriba = false;
			}
			
		if(!topeHombroBajo && !topeHombroArriba){ // No está abajo, se ha levantado pero no ha saludado
			if(angMano<=20 && !izq){// giramos la mano para la izquierda
				mano.rotateY(degToRad(0.75));
				angMano = angMano + 0.75;
			}else{
				izq=true; // Si se ha girado para la izquierda...
				
				if(angMano>=-35 && !der){ // ... ahora la giramos para la derecha.
					mano.rotateY(degToRad(-0.75));
					angMano = angMano - 0.75;
				}else{ // La devolvemos a la posicion original
					der=true;
					mano.rotateY(degToRad(0.75));
					angMano = angMano + 0.75;
					
					if(angMano == 0){ // Y se dispone a bajar el brazo
						topeHombroArriba = true;
						izq=false;
						der=false;
					}
						
				}
			}			
			
		}
	}
	
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
			
			case "b":
				brazo.rotateY(degToRad(5));
			break;
			
			case "B":
				brazo.rotateY(degToRad(-5));
			break;
			
			case "i":
			case "I":
				if(animado == Animacion.PAUSE)
					saludoAnimacion()
			break;
		}
	}
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);
	
//========================= Visualiza =========================
	
	var ang = 0.01;
	
	function animate() {
		requestAnimationFrame( animate );		
		
		if(animado == Animacion.PLAY){
			saludoAnimacion()
		}		
		
		cameraPersp.aspect = window.innerWidth / window.innerHeight;			
		cameraPersp.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.render( scene, cameraPersp);		
	};

animate();

}

window.addEventListener('load', main);