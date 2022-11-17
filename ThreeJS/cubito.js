//Escena
const scene = new THREE.Scene()

//Cubo
const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
const cube = new THREE.Mesh( geometry, material )
scene.add( cube )

//Camara
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.z = 5
scene.add(camera)

//Renderer
const canvas = document.querySelector('#mi_canvas')
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize( window.innerWidth, window.innerHeight )

renderer.render(scene, camera)


//Refrescar ventana
	function animate() {
		requestAnimationFrame( animate )

		cube.rotation.x += 0.01
		cube.rotation.y += 0.01

		renderer.render( scene, camera )
		renderer.setSize( window.innerWidth, window.innerHeight )
	};


animate()