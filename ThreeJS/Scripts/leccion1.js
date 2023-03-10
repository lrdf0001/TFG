function main(){

    //========================= Escena ============================
        const scene = new THREE.Scene()
    
    //========================== Ejes =============================
    
    //-------------------------- Eje X ----------------------------
        const ejeXvertices = []
        ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) )
        ejeXvertices.push( new THREE.Vector3( 5, 0, 0 ) )
        const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } )
    
        const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices )
        const ejeX = new THREE.Line( geometriaX, colorEjeX )
    
        scene.add(ejeX)
    
    //-------------------------- Eje Y ----------------------------
        const ejeYvertices = []
        ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) )
        ejeYvertices.push( new THREE.Vector3(  0, 5, 0 ) )
        const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } )
    
        const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices )
        const ejeY = new THREE.Line( geometriaY, colorEjeY )
    
        scene.add(ejeY)
    
    //-------------------------- Eje Z ----------------------------
        const ejeZvertices = []
        ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) )
        ejeZvertices.push( new THREE.Vector3(  0, 0, 5 ) )
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
const ambientLight = new THREE.AmbientLight(color, intensity);
const pointLight = new THREE.PointLight(color, intensity);
pointLight.position.set(0, 7, 0);
scene.add(ambientLight);
scene.add(pointLight);

//========================= Camara =============================
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20 );
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(0,0,0);
scene.add(camera);

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
		
		rotarY(y){
			this.caja.rotateY(y);
			this.tapa.rotateY(y);
		}
		
		getcaja(){ return this.caja;}
		gettapa(){ return this.tapa;}
		setColor(r, g, b){
			this.caja.material.color.setRGB(r,g,b);
			this.tapa.material.color.setRGB(r,g,b);
		}
	}

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

    const cajazapatos = new CajaZapatos(unacaja, unatapa);

    scene.add( cajazapatos );

//========================== Render =============================
	const canvas = document.querySelector('#mi_canvas');
	const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
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
			
		}
	}

	document.addEventListener("keypress", keyFunction);

//========================= Visualiza =========================
	
	//vercajas();
	function animate() {
		requestAnimationFrame( animate )

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		
		renderer.render( scene, camera );
		
	};

animate();

}