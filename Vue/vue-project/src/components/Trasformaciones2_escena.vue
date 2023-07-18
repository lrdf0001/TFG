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

	//============================ GUI ============================

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
            aplicarTrasformaciones: function(){

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
                
                transfromM.identity();           
            },

            reset: function(){
                cubo.matrix.identity().decompose(cubo.position, cubo.quaternion, cubo.scale);
            }
        }

	//---------------------- Interfaz GUI ------------------------

		const gui1 = new GUI( { autoPlace: false } );	
		var customContainer = document.querySelector('#gui').append(gui1.domElement);

		const escaladoGUI = gui1.addFolder('1. Escalado');
		escaladoGUI.add(escalado, 'x', 0, 3, 0.1).setValue(1).name('Ancho');
		escaladoGUI.add(escalado, 'y', 0, 3, 0.1).setValue(1).name('Alto');
		escaladoGUI.add(escalado, 'z', 0, 3, 0.1).setValue(1).name('Largo');
		
		const rotacionGUI = gui1.addFolder('2. Rotación');
		rotacionGUI.add(rotacion, 'x', -180, 180, 1).setValue(0).name('x');
		rotacionGUI.add(rotacion, 'y', -180, 180, 1).setValue(0).name('y');
		rotacionGUI.add(rotacion, 'z', -180, 180, 1).setValue(0).name('z');

		const traslacionGUI = gui1.addFolder('3. Traslación');
		traslacionGUI.add(traslacion, 'x', -3, 3).setValue(0);
		traslacionGUI.add(traslacion, 'y', -3, 3).setValue(0);
		traslacionGUI.add(traslacion, 'z', -3, 3).setValue(0);
        
        gui1.add(options, 'aplicarTrasformaciones').name("Aplicar");
        gui1.add(options, 'reset').name("Reset");


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
	
</template>