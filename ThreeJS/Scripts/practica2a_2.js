function main(){

//========================= Escena ============================
	const scene = new THREE.Scene()

//========================== Ejes =============================

//-------------------------- Eje X ----------------------------
	const ejeXvertices = []
	ejeXvertices.push( new THREE.Vector3( - 100, 0, 0 ) )
	ejeXvertices.push( new THREE.Vector3(  100, 0, 0 ) )
	const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } )

	const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices )
	const ejeX = new THREE.Line( geometriaX, colorEjeX )

	scene.add(ejeX)

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

const color = 0xFFFFFF
const intensity = 1
const ambientLight = new THREE.AmbientLight(color, intensity)
const pointLight = new THREE.PointLight(color, intensity)
pointLight.position.set(-3, 10, 3)
scene.add(ambientLight)
scene.add(pointLight)


//========================= Camara =============================
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20 )
	camera.position.x = 5
	camera.position.y = 5
	camera.position.z = 5
	camera.lookAt(0,0,0)
	scene.add(camera)


//========================== Modelo =============================

	//---------------------- CajaZapatos ----------------------
	class CajaZapatos{
		constructor(caja, tapa) {
			this.caja = caja;
			this.tapa = tapa;
			this.tapa.translateY(0.5);
		}
		
		trasladarY(y){
			this.caja.translateY(y);
			this.tapa.translateY(y);
		}
		
		getcaja(){ return this.caja;}
		gettapa(){ return this.tapa;}
	}
	

	//Geometria y material
	const geometriaCaja = new THREE.BoxGeometry( 1, 1, 2 );
	const materialCaja = new THREE.MeshToonMaterial( { color:  0x0066FF  } );

	const materialTapa = new THREE.MeshToonMaterial( { color:  0x23689b  } );
	const geometriaTapa = new THREE.BoxGeometry( 1.15, 0.25, 2.15 );
	
	//Variables para trasladar las cajas en el ejeY
	const dy = 1.125;
	
	//---------------------- Estructura Datos ----------------------
	mapcajas = new Map();
	for(let j=0; j<3; j++){
		unacaja = new THREE.Mesh( geometriaCaja, materialCaja );
		unatapa = new THREE.Mesh( geometriaTapa, materialTapa );
		
		cajazapatos = new CajaZapatos(unacaja, unatapa);
		cajazapatos.trasladarY(dy*j);
		
		clave = dy*j; //Usamos las coordenadas como clave
		mapcajas.set(clave, cajazapatos);
	}
	
	//---------------------- Puesta en escena ----------------------
	
	// Para saber el número de cajas en la pila
	numY = 1;
	
	// Vincula las cajas creadas con la escena
	function vercajas(){
		for(let j=0; j<numY; j++){
			clave = dy*j;
			scene.add( mapcajas.get(clave).getcaja() );
			scene.add( mapcajas.get(clave).gettapa() );
		}
	}
	
	// Limpia la escena, quita las todas las cajas
	function clearCajas(){
		for(let j=0; j<numY; j++){	
			clave = dy*j;
			scene.remove( mapcajas.get(clave).getcaja() );
			scene.remove( mapcajas.get(clave).gettapa() );
			
		}
	}

	
//========================== Render =============================
	const canvas = document.querySelector('#mi_canvas')
	const renderer = new THREE.WebGLRenderer({canvas: canvas})
	renderer.setSize( window.innerWidth, window.innerHeight )

	renderer.render(scene, camera)

//========================= Eventos ============================
	
	//------------------------- Teclado ----------------------------	
	function keyFunction(e) {
		switch (e.key){
			case "e":
				verEjes(ejes);
			break;
			case "y":
				if (numY < 3) numY++;
			break;
			case "Y":
				if (numY > 1) numY--;
			break;				
		}
	}
	document.getElementById("cuerpo").addEventListener("keypress", keyFunction);

//========================= Visualiza =========================

	function animate() {
		requestAnimationFrame( animate )
	
		vercajas();
		
		camera.aspect = window.innerWidth / window.innerHeight;			
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.render( scene, camera);
		
		clearCajas();
	};

animate();

}

window.addEventListener('load', main);