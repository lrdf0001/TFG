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


//========================== Caja =============================
const geometriaCaja = new THREE.BoxGeometry( 1, 1, 2 )
const materialCaja = new THREE.MeshToonMaterial( { color:    0x0066FF    } )

const materialTapa = new THREE.MeshToonMaterial( { color:    0x23689b    } )
const geometriaTapa = new THREE.BoxGeometry( 1.15, 0.25, 2.15 )

miscajas = []
cont = 0
for(let k=0; k<3; k++){
	for(let j=0; j<3; j++){
		for (let i=0; i<3; i++){		
		
			caja = new THREE.Mesh( geometriaCaja, materialCaja )
			tapa = new THREE.Mesh( geometriaTapa, materialTapa )
			tapa.translateY(0.5)
			
			caja.translateX(1.4*i)
			tapa.translateX(1.4*i)
			caja.translateY(1.125*j)
			tapa.translateY(1.125*j)
			caja.translateZ(-2.2*k)
			tapa.translateZ(-2.2*k)
			
			miscajas[cont]=caja 
			cont++
			miscajas[cont]=tapa
			cont++
			
			scene.add( caja )
			scene.add( tapa )
		}
	}
}


//========================== Render =============================
const canvas = document.querySelector('#mi_canvas')
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize( window.innerWidth, window.innerHeight )

renderer.render(scene, camera)

//------------------------- Visualiza ----------------------------

	function animate() {
		requestAnimationFrame( animate )
	
		/*
		miscajas[2].rotateX(0.01) //Caja
		
		miscajas[3].translateY(-0.5)
		miscajas[3].rotateX(0.01) //Tapa
		miscajas[3].translateY(0.5)
		*/
		
		renderer.render( scene, camera )
		renderer.setSize( window.innerWidth, window.innerHeight )
	};


animate()