<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'

export default {

name: 'Trasformaciones',

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
		const colorEjeX = new THREE.LineBasicMaterial( { color: 0x943126 } );

		const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
		const ejeX = new THREE.Line( geometriaX, colorEjeX );

		scene.add(ejeX);

		const _ejeXvertices = [];
		_ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		_ejeXvertices.push( new THREE.Vector3( -3, 0, 0 ) );
		const _colorEjeX = new THREE.LineDashedMaterial( { 
			color: 0x943126 ,
			dashSize: 0.4,
			gapSize: 0.15 } );
		const _geometriaX = new THREE.BufferGeometry().setFromPoints( _ejeXvertices );
		const _ejeX = new THREE.Line( _geometriaX, _colorEjeX );
		_ejeX.computeLineDistances();
		scene.add(_ejeX);

	//-------------------------- Eje Y ----------------------------
		const ejeYvertices = [];
		ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		ejeYvertices.push( new THREE.Vector3(  0, 3, 0 ) );
		const colorEjeY = new THREE.LineBasicMaterial( { color: 0x2ecc71 } );

		const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
		const ejeY = new THREE.Line( geometriaY, colorEjeY );

		scene.add(ejeY);

		const _ejeYvertices = [];
		_ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		_ejeYvertices.push( new THREE.Vector3(  0, -3, 0 ) );
		const _colorEjeY = new THREE.LineDashedMaterial( { 
			color: 0x2ecc71 ,
			dashSize: 0.4,
			gapSize: 0.15 } );
		const _geometriaY = new THREE.BufferGeometry().setFromPoints( _ejeYvertices );
		const _ejeY = new THREE.Line( _geometriaY, _colorEjeY );
		_ejeY.computeLineDistances();
		scene.add(_ejeY);

	//-------------------------- Eje Z ----------------------------
		const ejeZvertices = [];
		ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		ejeZvertices.push( new THREE.Vector3(  0, 0, 3 ) );
		const colorEjeZ = new THREE.LineBasicMaterial( { color: 0x3498db } );
		
		const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices );
		const ejeZ = new THREE.Line( geometriaZ, colorEjeZ );

		scene.add(ejeZ);

		const _ejeZvertices = [];
		_ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
		_ejeZvertices.push( new THREE.Vector3(  0, 0, -3 ) );
		const _colorEjeZ = new THREE.LineDashedMaterial( { 
			color: 0x3498db ,
			dashSize: 0.4,
			gapSize: 0.15 } );
		const _geometriaZ = new THREE.BufferGeometry().setFromPoints( _ejeZvertices );
		const _ejeZ = new THREE.Line( _geometriaZ, _colorEjeZ );
		_ejeZ.computeLineDistances();
		scene.add(_ejeZ);

	//========================= Luces =============================
		const color = 0xFFFFFF;
		const intensity = 1;
		
		const ambientLight = new THREE.AmbientLight(color, intensity);
		scene.add(ambientLight);
		
		const pointLight = new THREE.PointLight(color, intensity);
		pointLight.position.set(0, 7, 0);
		scene.add(pointLight);		

	//========================= Camara =============================
		const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20);
		camera.position.x = 3;
		camera.position.y = 3;
		camera.position.z = 3;
		camera.lookAt(0,0,0);
		scene.add(camera);

	//========================== Cubo ==============================
		const geometriaCaja = new THREE.BoxGeometry( 1, 1, 1 );	
		var mat = new THREE.MeshPhongMaterial( { color: 0x673ab7  } );	
		
        const cubo = new THREE.Mesh( geometriaCaja, mat );

        //cubo.matrixAutoUpdate = false;

		scene.add( cubo );

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

	//========================= Controls =============================
	const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();

	//============================ GUI ============================

	const gui1 = new GUI( { autoPlace: false } );	
	var customContainer = document.querySelector('#gui').append(gui1.domElement);

	//---------------------- Variables Auxiliares ------------------------
		const transfromM = new THREE.Matrix4();
        transfromM.identity();

        const traslacion = new THREE.Vector3();
        const rotacion = new THREE.Vector3();
        const escalado = new THREE.Vector3();

	//---------------------- Funciones Auxiliares ------------------------
        
        function degToRad(deg){
			return 3.1415 * deg / 180.0;
		}

        var options = {
            aplicar: function(){

                // Traslacion
                const T = new THREE.Matrix4();
                T.makeTranslation(traslacion.x, traslacion.y, traslacion.z);
                transfromM.multiply(T);

                // Rotacion
                const Rx = new THREE.Matrix4();
                Rx.makeRotationX(degToRad(rotacion.x));
                transfromM.multiply(Rx);

                const Ry = new THREE.Matrix4();
                Ry.makeRotationY(degToRad(rotacion.y));
                transfromM.multiply(Ry);

                const Rz = new THREE.Matrix4();
                Rz.makeRotationZ(degToRad(rotacion.z));
                transfromM.multiply(Rz);                

                // Escalado
                const S = new THREE.Matrix4();
                S.makeScale(escalado.x, escalado.y, escalado.z);
                transfromM.multiply(S);                
                
                // Aplicar
                cubo.applyMatrix4(transfromM);
                
				// Reiniciar variables
                transfromM.identity();
				traslacion.set(0,0,0);
				rotacion.set(0,0,0);
				escalado.set(1,1,1);
				
				gui1.updateDisplay();
            },

            reset: function(){
                cubo.matrix.identity().decompose(cubo.position, cubo.quaternion, cubo.scale);
            }
        }

	//---------------------- Interfaz GUI ------------------------

		const escaladoGUI = gui1.addFolder('1. Escalado');
		escaladoGUI.add(escalado, 'x', 0.1, 3, 0.1).setValue(1).name('Ancho');
		escaladoGUI.add(escalado, 'y', 0.1, 3, 0.1).setValue(1).name('Alto');
		escaladoGUI.add(escalado, 'z', 0.1, 3, 0.1).setValue(1).name('Largo');
		
		const rotacionGUI = gui1.addFolder('2. Rotación');
		rotacionGUI.add(rotacion, 'x', -180, 180, 1).setValue(0).name('x');
		rotacionGUI.add(rotacion, 'y', -180, 180, 1).setValue(0).name('y');
		rotacionGUI.add(rotacion, 'z', -180, 180, 1).setValue(0).name('z');

		const traslacionGUI = gui1.addFolder('3. Traslación');
		traslacionGUI.add(traslacion, 'x', -3, 3, 0.1).setValue(0);
		traslacionGUI.add(traslacion, 'y', -3, 3, 0.1).setValue(0);
		traslacionGUI.add(traslacion, 'z', -3, 3, 0.1).setValue(0);
        
        gui1.add(options, 'aplicar').name("Aplicar");
        gui1.add(options, 'reset').name("Reset");


		gui1.add(cubo.material, 'wireframe').name("Wireframe").listen();
		

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
	<h3>Transformaciones Afines</h3>
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
	<img class="center" src="../assets/img/Teoria/scale.png" alt="Matriz escalado" width="20%" height="auto">

	<h4>Rotación</h4>
	<p>Se realiza una rotación angular sobre un determinado eje en 3D.</p>
	<p>Es una transformación rígida, es decir, que no cambia el tamaño o la forma de una figura.</p>
	<img class="center" src="../assets/img/Teoria/rotacion.jpg" alt="Matriz rotacion" width="25%" height="auto">

	<h4>Traslación</h4>
	<p>Es equivalente a la suma de un vector a un punto. Aplicado a un objeto 
	(conjunto de puntos) es equivalente a moverlo rígidamente por el espacio.</p>
	<p>También es una transformación rígida.</p>
	<img class="center" src="../assets/img/Teoria/translation.png" alt="Matriz traslación" width="20%" height="auto">

	<h4>Pila de matrices</h4>
	<p>Cada una de estas funciones genera la correspondiente <b>matriz en 4x4</b>. Estas matrices de 
		transfomación se aplican sobre la matriz de transformacion del modelo (M) que inicialmente
		es la matriz de identidad.</p>
	<p>Cada llamada a una transformación geométrica (T) implica una multiplicación (composición) por 
		la matriz modelo actual: <i>M = M · T</i></p>
	<p>Estas transfomaciones se almacenan en una <b>pila</b>, por lo que se aplican en orden LIFO 
		(último en entrar, primero en salir), por este motivo el orden habitual para multiplicar 
		las matrices es: <i>M = T · R · S</i>, primero se aplica el escalado, luego la rotación y por 
		último se traslada. Si se altera este orden, el resultado es distinto, ya que la operación de 
		multiplicación en matrices <b>no es conmutativa</b>.</p>
	
	<h4>Uso</h4>
	<p>Estas transformaciones se aplican en el siguinete orden: escalado, rotación y traslación. En calculo de matrices
		se representa como: <i>M = T · R · S</i>.</p>
	<p>Para aplicar transformaciones al cubo, hay que desplegar los controles de la izquierda, modificar los parámetros y clicar en
		<i>Aplicar</i>. Las transformaciones son acumulativas y se aplican respecto a la transformación anterior. Si no se desea
		aplicar un tipo de transformación basta con poner sus parámetros por defecto: 1 para el escadado, y 0 para rotación y traslación.
	</p>
	<p>Y si se quiere volver a la posición inicial, basta con pulsar <i>Reset</i>.</p>
</template>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

img {
  border: 0 none;
  display: inline-block;
  height: auto;
  max-width: 100%;
  vertical-align: middle;
  padding-left: 1em;
}

</style>