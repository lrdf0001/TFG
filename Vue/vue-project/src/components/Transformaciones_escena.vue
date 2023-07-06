<script>
import * as THREE from 'three';
import { GUI } from 'dat.gui'

export default {
name: 'Ambiental',
data() {},
methods: {
	main:function(){

	//========================= Escenas ============================
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x1b2631);
		var canvas = document.querySelector('#mi_canvas');

	//========================== Ejes =============================

	//-------------------------- Eje X ----------------------------
		const ejeXvertices = [];
		ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		ejeXvertices.push( new THREE.Vector3( 3, 0, 0 ) );
		const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );

		const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
		const ejeX = new THREE.Line( geometriaX, colorEjeX );

		scene.add(ejeX);

	//-------------------------- Eje Y ----------------------------
		const ejeYvertices = [];
		ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		ejeYvertices.push( new THREE.Vector3(  0, 3, 0 ) );
		const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );

		const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
		const ejeY = new THREE.Line( geometriaY, colorEjeY );

		scene.add(ejeY);

	//-------------------------- Eje Z ----------------------------
		const ejeZvertices = [];
		ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		ejeZvertices.push( new THREE.Vector3(  0, 0, 3 ) );
		const colorEjeZ = new THREE.LineBasicMaterial( { color:   0x3498db  } );
		
		const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices );
		const ejeZ = new THREE.Line( geometriaZ, colorEjeZ );

		scene.add(ejeZ);
		
	//---------------------- Activar/desactivar ejes ------------------------	
		var ejes = true;
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
		const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20);
		camera.position.x = 3;
		camera.position.y = 3;
		camera.position.z = 3;
		camera.lookAt(0,0,0);
		scene.add(camera);

	//========================== Cubo ==============================

		const pivot = new THREE.Object3D();
		scene.add(pivot);
		
		const geometriaCaja = new THREE.BoxGeometry( 1, 1, 1 );	
		var mat = new THREE.MeshToonMaterial( { color: 0x673ab7  } );	
		const cubo = new THREE.Mesh( geometriaCaja, mat );
		pivot.add( cubo );

	//========================== Render =============================
		
		const renderer = new THREE.WebGLRenderer({canvas: canvas});    
		renderer.render(scene, camera);
		

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

	//============================ GUI ============================

	//---------------------- Variables Auxiliares ------------------------
		const rotacionLocal = { x: 0.0, y: 0.0, z: 0.0};
		const rotacionActualLocal = { x: 0.0, y: 0.0, z: 0.0};

		const rotacionOrigen = { x: 0.0, y: 0.0, z: 0.0};
		const rotacionOrigenActual = { x: 0.0, y: 0.0, z: 0.0};

		const traslacion = {x: 0.0, y: 0.0, z: 0.0};

	//---------------------- Funciones Auxiliares ------------------------

		function degToRad(deg){
			return 3.1415 * deg / 180.0;
		}

		function rotarCuboLocal(){
			var angX = -(rotacionActualLocal.x - rotacionLocal.x);
			rotacionActualLocal.x += angX;
			cubo.rotateX(degToRad(angX));

			var angY = -(rotacionActualLocal.y - rotacionLocal.y);
			rotacionActualLocal.y += angY;
			cubo.rotateY(degToRad(angY));

			var angZ = -(rotacionActualLocal.z - rotacionLocal.z);
			rotacionActualLocal.z += angZ;
			cubo.rotateZ(degToRad(angZ));
		}

		function rotarCuboOrigen(){
			var angX = -(rotacionOrigenActual.x - rotacionOrigen.x);
			rotacionOrigenActual.x += angX;
			pivot.rotateX(degToRad(angX));

			var angY = -(rotacionOrigenActual.y - rotacionOrigen.y);
			rotacionOrigenActual.y += angY;
			pivot.rotateY(degToRad(angY));

			var angZ = -(rotacionOrigenActual.z - rotacionOrigen.z);
			rotacionOrigenActual.z += angZ;
			pivot.rotateZ(degToRad(angZ));
		}

	//---------------------- Interfaz GUI ------------------------

		const gui1 = new GUI( { autoPlace: false } );	
		var customContainer = document.querySelector('#gui').append(gui1.domElement);
		
		const rotacionGUI = gui1.addFolder('Rotacion local');
		rotacionGUI.add(rotacionLocal, 'x', 0, 360, 10).name('x').onChange((value) => rotarCuboLocal());
		rotacionGUI.add(rotacionLocal, 'y', 0, 360, 10).name('y').onChange((value) => rotarCuboLocal());
		rotacionGUI.add(rotacionLocal, 'z', 0, 360, 10).name('z').onChange((value) => rotarCuboLocal());

		const rotacionGUI2 = gui1.addFolder('Rotacion respecto al origen');
		rotacionGUI2.add(rotacionOrigen, 'x', 0, 360, 10).name('x').onChange((value) => rotarCuboOrigen());
		rotacionGUI2.add(rotacionOrigen, 'y', 0, 360, 10).name('y').onChange((value) => rotarCuboOrigen());
		rotacionGUI2.add(rotacionOrigen, 'z', 0, 360, 10).name('z').onChange((value) => rotarCuboOrigen());
		
		const traslacionGUI = gui1.addFolder('Traslacion');
		traslacionGUI.add(traslacion, 'x', 0, 3, 0.25).onChange((value) => cubo.translateOnAxis(new THREE.Vector3(1, 0, 0), traslacion.x - cubo.position.x));
		traslacionGUI.add(traslacion, 'y', 0, 3, 0.25).onChange((value) => cubo.translateOnAxis(new THREE.Vector3(0, 1, 0), traslacion.y - cubo.position.y));
		traslacionGUI.add(traslacion, 'z', 0, 3, 0.25).onChange((value) => cubo.translateOnAxis(new THREE.Vector3(0, 0, 1), traslacion.z - cubo.position.z));
			

		const escaladoGUI = gui1.addFolder('Escalado');
		escaladoGUI.add(cubo.scale, 'x', 0, 3).name('Ancho').listen();
		escaladoGUI.add(cubo.scale, 'y', 0, 3).name('Alto').listen();
		escaladoGUI.add(cubo.scale, 'z', 0, 3).name('Largo').listen();

		gui1.add(cubo.material, 'wireframe').listen();

	//========================= Visualiza =========================

		function animate() {
			requestAnimationFrame( animate );

			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
			}

			renderer.render( scene, camera );
		};


		animate()
	}
//window.addEventListener('load', main);
},
	mounted() { this.main(); }
}
</script>


<template>
	<div class="p-4 p-md-5 mb-4">
		<div id="lienzo" class="px-0 col-md-6">
		<div id="gui"></div>
		<canvas id="mi_canvas" class="rounded"></canvas>
		</div>
	</div>
	<p>Texto explicativo de la primera escena</p>
</template>


<style>
body {
  margin: 0;
  font-family: var(--bs-body-font-family);
  font-size: var(--bs-body-font-size);
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
  color: var(--bs-body-color);
  text-align: var(--bs-body-text-align);
  background-color: var(--bs-body-bg);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * .5);
  padding-left: calc(var(--bs-gutter-x) * .5);
  margin-right: auto;
  margin-left: auto;
}

.blog-header {
  border-bottom: 1px solid #e5e5e5;
}

.lh-1 {
  line-height: 1!important;
}

.py-1 {
  padding-top: 0.25rem!important;
  padding-bottom: 0.25rem!important;
}

.py-3 {
  padding-top: 1rem!important;
  padding-bottom: 1rem!important;
}

.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-.5 * var(--bs-gutter-x));
  margin-left: calc(-.5 * var(--bs-gutter-x));
}

.flex-nowrap {
  flex-wrap: nowrap!important;
}

.justify-content-between {
  justify-content: space-between!important;
}

.align-items-center {
  align-items: center!important;
}

.text-center {
  text-align: center!important;
}

.col-4 {
  flex: 0 0 auto;
  width: 33.33333333%;
}

.blog-header-logo {
  font-family: "Playfair Display", Georgia, "Times New Roman", serif/*rtl:Amiri, Georgia, "Times New Roman", serif*/;
  font-size: 2.25rem;
}

.text-dark {
  --bs-text-opacity: 1;
  color: rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important;
}

.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.justify-content-between {
  justify-content: space-between!important;
}

.d-flex {
  display: flex!important;
}

.nav {
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;

  --bs-nav-link-padding-x: 1rem;
  --bs-nav-link-padding-y: 0.5rem;
  --bs-nav-link-font-weight: ;
  --bs-nav-link-color: var(--bs-link-color);
  --bs-nav-link-hover-color: var(--bs-link-hover-color);
  --bs-nav-link-disabled-color: var(--bs-secondary-color);

  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
}

.p-2 {
  padding: 0.5rem!important;
}

.link-secondary {
  color: #6c757d!important;
}

.mb-2 {
  margin-bottom: 0.5rem!important;
}

.p-md-5 {
  padding: 3rem!important;
}

.rounded {
  /*border: 2px solid red;*/
  border-radius: 25px;
}

.p-4 {
  padding: 1.5rem!important;
}

.mb-4 {
  margin-bottom: 1.5rem!important;
}

.px-0 {
  padding-right: 0!important;
  padding-left: 0!important;
}

/*@media (min-width: 768px)*/
.col-md-6 {
  flex: 0 0 auto;
  width: 100%;
}

*, ::after, ::before {
  box-sizing: border-box;
}

div {
  display: block;
}

header {
    display: block;
}

#mi_canvas {
  width: 100%;
  display: block;
}

#lienzo{ 
  position: relative;
}

#gui { 
  position: absolute;
  top: 2px; left: 30px;
}
</style>