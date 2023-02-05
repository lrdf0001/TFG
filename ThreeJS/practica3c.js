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
pointLight.position.set(0, 7, 0)
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
		
		trasladarX(x){
			this.caja.translateX(x);
			this.tapa.translateX(x);
		}
		
		trasladarY(y){
			this.caja.translateY(y);
			this.tapa.translateY(y);
		}
		
		trasladarZ(z){
			this.caja.translateZ(z);
			this.tapa.translateZ(z);
		}
		
		getcaja(){ return this.caja;}
		gettapa(){ return this.tapa;}
		setColor(r, g, b){
			this.caja.material.color.setRGB(r,g,b);
			this.tapa.material.color.setRGB(r,g,b);
		}
	}
	
	//Variables para trasladar las cajas en los 3 ejes
	const dx = 1.4; 
	const dy = 1.125;
	const dz = 2.3;
	
	//---------------------- Estructura Datos ----------------------
	mapcajas = new Map();
	for(let k=0; k<3; k++){
		for(let j=0; j<3; j++){
			for (let i=0; i<3; i++){
				
				//Geometria y material
				const geometriaCaja = new THREE.BoxGeometry( 1, 1, 2 );
				const materialCaja = new THREE.MeshToonMaterial();

				const materialTapa = new THREE.MeshToonMaterial();
				const geometriaTapa = new THREE.BoxGeometry( 1.15, 0.25, 2.15 );
				
				//Caja y Tapa
				const unacaja = new THREE.Mesh( geometriaCaja, materialCaja);
				const unatapa = new THREE.Mesh( geometriaTapa, materialTapa );
				unacaja.material.color.setRGB( ((i+1)/10), ((j+1)/10), ((k+1)/10) );// Asignamos colores según la numeracion
				unatapa.material.color.setRGB( ((i+1)/10), ((j+1)/10), ((k+1)/10) );
				
				//Objeto completo
				clave = (i+1)*100 + (j+1)*10 + (k+1); //Usamos el color como clave
				const cajazapatos = new CajaZapatos(unacaja, unatapa);
				
				//Disposicion en la escena
				cajazapatos.trasladarX(dx*i);
				cajazapatos.trasladarY(dy*j);
				cajazapatos.trasladarZ(-dz*k);				
				
				mapcajas.set(clave, cajazapatos);//Lo guardamos en la eedd
			}
		}
	}
	
	//---------------------- Puesta en escena ----------------------
	
	// Para saber el número de pilas de cajas en cada dimension
	numZ = 3;
	numY = 3;
	numX = 3;
	
	// Vincula las cajas creadas con la escena
	function vercajas(){
		for(let k=0; k<numZ; k++){
			for(let j=0; j<numY; j++){
				for (let i=0; i<numX; i++){	
					clave = (i+1)*100 + (j+1)*10 + (k+1);
					scene.add( mapcajas.get(clave).getcaja() );
					scene.add( mapcajas.get(clave).gettapa() );
				}
			}
		}
	}
	
	// Limpia la escena, quita las todas las cajas
	function clearCajas(){		
		for(let k=0; k<numZ; k++){
			for(let j=0; j<numY; j++){
				for (let i=0; i<numX; i++){	
					clave = (i+1)*100 + (j+1)*10 + (k+1);
					scene.remove( mapcajas.get(clave).getcaja() );
					scene.remove( mapcajas.get(clave).gettapa() );
				}
			}
		}
	}

//========================== Render =============================
	const canvas = document.querySelector('#mi_canvas');
	const renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize( window.innerWidth, window.innerHeight );
	

	renderer.render(scene, camera);	
	
//========================= Eventos ============================
	
	//------------------------- Puntero ----------------------------
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();
	var seleccionado = null;
	var I, J, K;
	
	function quitarSeleccion(_seleccionado){
		
		const anterior = _seleccionado;
		K = _seleccionado % 10; _seleccionado -= K; K -= 1;
		J = _seleccionado % 100; _seleccionado -= J; J = J/10 - 1;
		I = _seleccionado % 1000 / 100 - 1; 
		//console.log("Inv:", I, J, K);
		mapcajas.get(anterior).setColor( ((I+1)/10), ((J+1)/10), ((K+1)/10));
	}
	
	function onPointerMove( event ) {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components
		pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		raycaster.setFromCamera( pointer, camera );
		
		const intersects = raycaster.intersectObjects( scene.children );		
		
		if(seleccionado) quitarSeleccion(seleccionado);
		
		if(0 < intersects.length){
			
			I = intersects[ 0 ].object.material.color.r * 10 - 1;
			J = intersects[ 0 ].object.material.color.g * 10 - 1;
			K = intersects[ 0 ].object.material.color.b * 10 - 1;
			seleccionado = (I+1)*100 + (J+1)*10 + (K+1);
			
			clearCajas();
			
			mapcajas.get(seleccionado).setColor( 0.9, 0.1, 0.1);
			
			vercajas();			
			//console.log(I, J, K);			
		}
		else{			
			seleccionado = null;
		}
	}
	
	//window.addEventListener( "mousemove", onPointerMove );
	document.addEventListener("mousedown", onPointerMove);
	
	//------------------------- Teclado ----------------------------	
	function keyFunction(e) {
		switch (e.key){
			case "e":
				verEjes(ejes);
			break;
			
			case "x":				
				if (numX < 3){
					if(seleccionado) quitarSeleccion(seleccionado);
					clearCajas();
					numX++;
					seleccionado = null;
				}
			break;
			
			case "y":
				if (numY < 3){
					if(seleccionado) quitarSeleccion(seleccionado);
					clearCajas();
					numY++;
					seleccionado = null;
				}
			break;
			
			case "z":
				if (numZ < 3){
					if(seleccionado) quitarSeleccion(seleccionado);
					clearCajas();
					numZ++;
					seleccionado = null;
				}
			break;
			
			case "X":
				if (numX > 1){
					if(seleccionado) quitarSeleccion(seleccionado);
					clearCajas();
					numX--;
					seleccionado = null;
				}				
			break;
			
			case "Y":			
				if (numY > 1){
					if(seleccionado) quitarSeleccion(seleccionado);
					clearCajas();
					numY--;
					seleccionado = null;
				}
			break;
			
			case "Z":
				if (numZ > 1){
					if(seleccionado) quitarSeleccion(seleccionado);
					clearCajas();
					numZ--;
					seleccionado = null;
				}
			break;				
		}
	}
	document.addEventListener("keypress", keyFunction);
	
//========================= Visualiza =========================
	
	//vercajas();
	function animate() {
		requestAnimationFrame( animate )
	
		vercajas();
		
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.render( scene, camera );
		
		//clearCajas();
	};

animate();

}


window.addEventListener('load', main);
