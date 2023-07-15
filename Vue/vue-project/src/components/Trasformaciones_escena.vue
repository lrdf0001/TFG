<script>
import * as THREE from 'three';
import { GUI } from 'dat.gui'

export default {
name: 'Trasformaciones',
//data() {},
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
		scene.add(pivot)
		
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

		var trasladado = false;

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

		function trasladar(){
			cubo.position.x += traslacion.x - cubo.position.x;
			cubo.position.y += traslacion.y - cubo.position.y;
			cubo.position.z += traslacion.z - cubo.position.z;
		}

	//---------------------- Interfaz GUI ------------------------

		const gui1 = new GUI( { autoPlace: false } );	
		var customContainer = document.querySelector('#gui').append(gui1.domElement);

		const escaladoGUI = gui1.addFolder('1. Escalado');
		escaladoGUI.add(cubo.scale, 'x', 0, 3).name('Ancho').listen();
		escaladoGUI.add(cubo.scale, 'y', 0, 3).name('Alto').listen();
		escaladoGUI.add(cubo.scale, 'z', 0, 3).name('Largo').listen();
		
		const rotacionGUI = gui1.addFolder('2. Rotación');
		rotacionGUI.add(rotacionLocal, 'x', 0, 360, 10).name('x').onChange((value) => rotarCuboLocal());
		rotacionGUI.add(rotacionLocal, 'y', 0, 360, 10).name('y').onChange((value) => rotarCuboLocal());
		rotacionGUI.add(rotacionLocal, 'z', 0, 360, 10).name('z').onChange((value) => rotarCuboLocal());

		const traslacionGUI = gui1.addFolder('3. Traslación');
		traslacionGUI.add(traslacion, 'x', 0, 3).onChange((value) => trasladar()); //pivot2.translateOnAxis(new THREE.Vector3(1, 0, 0), traslacion.x - pivot2.position.x)
		traslacionGUI.add(traslacion, 'y', 0, 3).onChange((value) => trasladar()); //pivot2.translateOnAxis(new THREE.Vector3(0, 1, 0), traslacion.y - pivot2.position.y)
		traslacionGUI.add(traslacion, 'z', 0, 3).onChange((value) => trasladar()); //pivot2.translateOnAxis(new THREE.Vector3(0, 0, 1), traslacion.z - pivot2.position.z)

		const rotacionGUI2 = gui1.addFolder('4. Rotacion después de traslación');
		rotacionGUI2.add(rotacionOrigen, 'x', 0, 360, 10).name('x').onChange((value) => rotarCuboOrigen()); 
		rotacionGUI2.add(rotacionOrigen, 'y', 0, 360, 10).name('y').onChange((value) => rotarCuboOrigen());
		rotacionGUI2.add(rotacionOrigen, 'z', 0, 360, 10).name('z').onChange((value) => rotarCuboOrigen());		

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
	
},
	mounted() { this.main(); }
}
</script>


<template>
	<h3>Trasformaciones Afines</h3>
	<p>Una transformación afín es una transformación que se aplica a puntos y 
	vectores en un espacio afín. Preservan  ciertas propiedades geométricas:
		<ul>
			<li>Colinealidad.</li>
			<li>Proporcionalidad.</li>
		</ul>
	</p>
	<p>Ángulos y distancias no se mantienen, aunque sí la proporción de distancias.</p>

	<h4>Escalado</h4>
	<p>Modifica el tamaño de un objeto. Si se escala igual en los tres ejes tenemos un escalado uniforme.</p>

	<h4>Rotación</h4>
	<p>Se realiza una rotación angular sobre un determinado eje en 3D.</p>
	<p>Es una transformación rígida</p>

	<h4>Traslación</h4>
	<p>Es equivalente a la suma de un vector t a un punto. Aplicado a un objeto 
	(conjunto de puntos) es equivalente a moverlo rígidamente por el espacio.</p>
	<p>Es una transformación rígida.</p>

	<h4>Utilización</h4>
	<p>Estras transformaciones se aplican en el siguinete orden: escalado, rotación y traslación. En calculo de matrices
		se representa como: <i>M = T · R · S</i>.</p>
	<p>Si alteramos el orden de las trasformaciones podremos obtener resultados distintos, esto se debe a que el calculo de 
		matrices no es conmutativo. Para demostrarlo, se ha añadido un 4º apartado a la interfaz donde se pueden aplicar
		rotaciones después de la traslación, por ejemplo: <i>M = R' · T · R · S</i>.
	</p>
</template>
