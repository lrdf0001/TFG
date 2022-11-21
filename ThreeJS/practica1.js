
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


//========================= Camara =============================
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 15 )
camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0,0,0)
scene.add(camera)


//========================== Caja =============================

const geometriaCaja = new THREE.BoxGeometry( 1, 1, 2 )
const materialCaja = new THREE.MeshBasicMaterial( { color:    0x239b56   } )
const caja = new THREE.Mesh( geometriaCaja, materialCaja )
scene.add( caja )

const geometriaTapa = new THREE.BoxGeometry( 1.15, 0.25, 2.15 )
const materialTapa = new THREE.MeshBasicMaterial( { color:    0x239b56   } )
const tapa = new THREE.Mesh( geometriaTapa, materialTapa )
tapa.translateY(0.5)
scene.add( tapa )


//========================== Render =============================
const canvas = document.querySelector('#mi_canvas')
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize( window.innerWidth, window.innerHeight )

renderer.render(scene, camera)

//------------------------- Visualiza ----------------------------

	function animate() {
		requestAnimationFrame( animate )
	
		
		caja.rotation.x += 0.01
		caja.rotation.y += 0.01
		
		tapa.translateY(-0.5)
		tapa.rotation.x += 0.01
		tapa.rotation.y += 0.01
		tapa.translateY(0.5)
		
		
		renderer.render( scene, camera )
		renderer.setSize( window.innerWidth, window.innerHeight )
	};


animate()