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
	pointLight.position.set(-3, 5, 5);
	scene.add(ambientLight);
	scene.add(pointLight);

//========================= Camaras =============================

	//---------------------- Perspectiva ------------------------
	var fov = 75;
	
	var cameraPersp;

	function creaPersp(){
		cameraPersp = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 0.1, 20 );
	}
	
	creaPersp();
	cameraPersp.position.x = 3;
	cameraPersp.position.y = 2;
	cameraPersp.position.z = 4;
	cameraPersp.lookAt(0,0,0);
	scene.add(cameraPersp);	
	
	//---------------------- Paralela ------------------------
	const left = -6;
	const right = 6;  
	const top = 4;
	const bottom = -4; 
	var near = 0.01;
	const far = 20;
	var cameraOrtho;

	function creaOrtho(){
		cameraOrtho	= new THREE.OrthographicCamera(left, right, top, bottom, near, far);	
	}
	
	creaOrtho();
	cameraOrtho.position.x = 3;
	cameraOrtho.position.y = 2;
	cameraOrtho.position.z = 4;
	cameraOrtho.lookAt(0,0,0);
	scene.add(cameraOrtho);

	
//========================== Modelo =============================

	const geometriaParalelepipedo = new THREE.BoxGeometry( 1, 2, 4 );
	const materialParalelepipedo = new THREE.MeshToonMaterial( { color:  0x8bc34a  } );
	paralelepipedo = new THREE.Mesh(geometriaParalelepipedo, materialParalelepipedo);
	scene.add(paralelepipedo)
	
	const geometriaCilidro = new THREE.CylinderGeometry( 0.25, 0.25, 4, 32, 3 );
	const materialCilidro = new THREE.MeshToonMaterial( {color: 0x1e88e5 } );
	const cilindro1 = new THREE.Mesh( geometriaCilidro, materialCilidro );
	const cilindro2 = new THREE.Mesh( geometriaCilidro, materialCilidro );
	
	cilindro1.rotateX(-40);
	cilindro2.rotateX(40);
	
	scene.add( cilindro1 );	
	scene.add( cilindro2 );

//========================== Render =============================
	const canvas = document.querySelector('#mi_canvas');
	const renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render(scene, cameraOrtho);
	
	var paralela = true;

//========================= Eventos ============================
	
	//------------------------- Teclado ----------------------------	
	function keyFunction(e) {
		switch (e.key){
			case "e":
				verEjes(ejes);
			break;
			
			case "p":
				paralela = !paralela;
			break;
			
			case "x":
			case "X":
				cameraOrtho.position.x = 4;
				cameraOrtho.position.y = 0;
				cameraOrtho.position.z = 0;
				cameraOrtho.lookAt(0,0,0);
				
				cameraPersp.position.x = 4;
				cameraPersp.position.y = 0;
				cameraPersp.position.z = 0;
				cameraPersp.lookAt(0,0,0);
			break;
			
			case "y":
			case "Y":
				cameraOrtho.position.x = 0;
				cameraOrtho.position.y = 4;
				cameraOrtho.position.z = 0;
				cameraOrtho.lookAt(0,0,0);
				
				cameraPersp.position.x = 0;
				cameraPersp.position.y = 4;
				cameraPersp.position.z = 0;
				cameraPersp.lookAt(0,0,0);
			break;
			
			case "z":
			case "Z":
				cameraOrtho.position.x = 0;
				cameraOrtho.position.y = 0;
				cameraOrtho.position.z = 4;
				cameraOrtho.lookAt(0,0,0);
				
				cameraPersp.position.x = 0;
				cameraPersp.position.y = 0;
				cameraPersp.position.z = 4;
				cameraPersp.lookAt(0,0,0);
			break;
			
			case "c":
			case "C":
				cameraOrtho.position.x = 3;
				cameraOrtho.position.y = 2;
				cameraOrtho.position.z = 4;
				cameraOrtho.lookAt(0,0,0);
				
				cameraPersp.position.x = 3;
				cameraPersp.position.y = 2;
				cameraPersp.position.z = 4;
				cameraPersp.lookAt(0,0,0);
			break;
		}
	}
	
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);

//========================= Visualiza =========================

	function animate() {
		requestAnimationFrame( animate );
	
		if(paralela){
			renderer.render( scene, cameraOrtho);
		}else{
			renderer.render( scene, cameraPersp);
		}
		
		renderer.setSize( window.innerWidth, window.innerHeight );
		
	};

animate();

}

window.addEventListener('load', main);