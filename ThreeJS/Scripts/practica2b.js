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
	pointLight.position.set(-3, 4.5, 5);
	scene.add(ambientLight);
	scene.add(pointLight);

//========================= Camaras =============================

	//---------------------- Perspectiva ------------------------
	var fov = 75;
	var near = 0.1;	
	var far = 20;
	var cameraPersp = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far );
	
	cameraPersp.position.x = 3;
	cameraPersp.position.y = 2;
	cameraPersp.position.z = 4;
	cameraPersp.lookAt(0,0,0);
	scene.add(cameraPersp);	
	
	//---------------------- Paralela ------------------------
	var left = -6;
	var right = 6;  
	var top = 4;
	var bottom = -4; 
	
	var cameraOrtho = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
	cameraOrtho.position.x = 3;
	cameraOrtho.position.y = 2;
	cameraOrtho.position.z = 4;
	cameraOrtho.lookAt(0,0,0);
	scene.add(cameraOrtho);

	//---------------------- Vistas ------------------------
	
	// Enum para indicar sobre que eje esta la camara
	const PosicionCamara = {
		PERFIL: 'PERFIL',
		PLANTA: 'PLANTA',
		ALZADO: 'ALZADO',
		PERSP: 'PERSP'
	};
	
	var camaraPOS = PosicionCamara.PERSP;
	
	function setPos(unaCamara){
		switch(camaraPOS){
			case 'PERFIL':
				unaCamara.position.x = 4;
				unaCamara.position.y = 0;
				unaCamara.position.z = 0;
			break;

			case 'PLANTA':
				unaCamara.position.x = 0;
				unaCamara.position.y = 4;
				unaCamara.position.z = 0;
			break;
			
			case 'ALZADO':
				unaCamara.position.x = 0;
				unaCamara.position.y = 0;
				unaCamara.position.z = 4;
			break;
			
			default:
				unaCamara.position.x = 3;
				unaCamara.position.y = 2;
				unaCamara.position.z = 4;
			break;
		}
			
		unaCamara.lookAt(0,0,0);
	}
	
	//---------------------- Funciones Auxiliares ------------------------
	function creaPersp(){
		scene.remove(cameraPersp);
		
		cameraPersp = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, 20 );
		setPos(cameraPersp);
		scene.add(cameraPersp);
	}
	
	function creaOrtho(){
		scene.remove(cameraOrtho);
		
		cameraOrtho = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
		setPos(cameraOrtho);
		scene.add(cameraOrtho);		
	}
	
	//---------------------- Zoom ------------------------
	function zoom(factor){
		if(factor){
			//Reducimos la distancia entre planos para hacer zoom+ con la camara paralela
			if(top > 0.5){
				left = left + 0.25;
				right = right - 0.25 ;
				top = top - 0.25;
				bottom = bottom + 0.25;
			}			
			
			//Reducimos el ángulo de vision para hacer zoom+ con la camara perspectiva
			if(fov > 10)
				fov = fov - 5;
			
		}else{
			//Ampliamos la distancia entre planos para hacer zoom- con la camara paralela
			if(top < 10){
				left = left - 0.25;
				right = right + 0.25 ;
				top = top + 0.25;
				bottom = bottom - 0.25;
			}
			
			//Ampliamos el ángulo de vision para hacer zoom- con la camara perspectiva
			if(fov < 175)
				fov = fov + 5;			
		}
		//Redefinimos las camaras
		creaOrtho();
		creaPersp();	
	}
	
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
				camaraPOS = PosicionCamara.PERFIL;
				setPos(cameraPersp);
				setPos(cameraOrtho);
			break;
			
			case "y":
			case "Y":
				camaraPOS = PosicionCamara.PLANTA;
				setPos(cameraPersp);
				setPos(cameraOrtho);
			break;
			
			case "z":
			case "Z":
				camaraPOS = PosicionCamara.ALZADO;
				setPos(cameraPersp);
				setPos(cameraOrtho);
			break;
			
			case "c":
			case "C":
				camaraPOS = PosicionCamara.PERSP;
				setPos(cameraPersp);
				setPos(cameraOrtho);
			break;
			
			case "+":
				zoom(1);
			break;
			
			case "-":
				zoom(0);
			break;
			
			case "n":
				near = near + 0.25;
				creaOrtho();
				creaPersp();
			break;
			
			case "N":
				if (near > 0.1) near = near - 0.25;
				creaOrtho();
				creaPersp();
			break;
		}
	}
	
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);

//========================= Visualiza =========================

	function animate() {
		requestAnimationFrame( animate );		
		
		if(paralela){
			cameraOrtho.aspect = window.innerWidth / window.innerHeight;			
			cameraOrtho.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.render( scene, cameraOrtho);			
			
		}else{
			cameraPersp.aspect = window.innerWidth / window.innerHeight;			
			cameraPersp.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.render( scene, cameraPersp);		
		}	
		
		
	};

animate();

}

window.addEventListener('load', main);