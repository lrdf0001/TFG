<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export default {
    name: 'Direccional',
    methods: {

    main: function(){
            class ColorGUIHelper {
                constructor(object, prop) {
                    this.object = object;
                    this.prop = prop;
                }
                get value() {
                    return `#${this.object[this.prop].getHexString()}`;
                }
                set value(hexString) {
                    this.object[this.prop].set(hexString);
                }
            }

            function degToRad(deg){
                    return (3.1415 * deg) / 180.0;
            }

        //========================= Escenas ============================
            const scene = new THREE.Scene();  
            scene.background = new THREE.Color(0x85c1e9);
            var canvas = document.querySelector('#mi_canvas');
        
        //========================== Ejes =============================
        
        //-------------------------- Eje X ----------------------------
            const ejeXvertices = [];
            ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
            ejeXvertices.push( new THREE.Vector3( 2, 0, 0 ) );
            const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );
        
            const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
            const ejeX = new THREE.Line( geometriaX, colorEjeX );
        
            scene.add(ejeX);
        
        //-------------------------- Eje Y ----------------------------
            const ejeYvertices = [];
            ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
            ejeYvertices.push( new THREE.Vector3(  0, 2, 0 ) );
            const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );
        
            const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
            const ejeY = new THREE.Line( geometriaY, colorEjeY );
        
            scene.add(ejeY);
        
        //-------------------------- Eje Z ----------------------------
            const ejeZvertices = [];
            ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
            ejeZvertices.push( new THREE.Vector3(  0, 0, 2 ) );
            const colorEjeZ = new THREE.LineBasicMaterial( { color:   0x3498db  } );
            
            const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices );
            const ejeZ = new THREE.Line( geometriaZ, colorEjeZ );
        
            scene.add(ejeZ);
        
        //========================= Luces ============================= 
            const pivot = new THREE.Object3D();
            scene.add(pivot);

            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 6, 0);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;
            
            pivot.add(light);
            pivot.add(light.target);

            light.shadow.mapSize.width = 800,
            light.shadow.mapSize.height = 800; 
            light.shadow.camera.near = 0.5; 
            light.shadow.camera.far = 500;
            light.shadow.bias = - 0.0001;
            
            const helper = new THREE.CameraHelper( light.shadow.camera );
            scene.add( helper );            
            
            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);        
            scene.add(ambientLight);            
        
        //========================= Camara =============================
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 40);
            camera.position.x = 3.5;
            camera.position.y = 3.5;
            camera.position.z = 3.5;
            camera.lookAt(0,0,0);
            scene.add(camera);        
        
        //========================== Modelos ==============================

            //Tree Assets by Ben Desai [CC-BY] via Poly Pizza
            const gltfLoader = new GLTFLoader();
            gltfLoader.load('/trees.glb', (gltf) => {
                const root = gltf.scene;

                root.traverse( function( node ) {
                    if ( node.isMesh ) { 
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                } );

                scene.add(root);
            });


        //========================== Render =============================
            
            const renderer = new THREE.WebGLRenderer({canvas: canvas});
            renderer.shadowMap.enabled = true;
            renderer.shadowMapSoft = true;
        
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

            const rotacionGUI = {x: 90, z: 90};
            const rotacionPivot = {x: 90, z: 90};

            function rotateLigth(){
                var angX = -(rotacionPivot.x - rotacionGUI.x);
                rotacionPivot.x += angX;
                pivot.rotateX(degToRad(angX));

                var angZ = -(rotacionPivot.z - rotacionGUI.z);
                rotacionPivot.z += angZ;
                pivot.rotateZ(degToRad(angZ));
            }
        
            const gui1 = new GUI( { autoPlace: false } );
            var customContainer = document.querySelector('#gui').append(gui1.domElement);
            
            const direccionalGUI = gui1.addFolder('Direccional');
            direccionalGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('Color');
            direccionalGUI.add(light, 'intensity', 0, 2, 0.01).name("Intensidad");
            //direccionalGUI.add(light.target.position, 'x', -10, 10);
            //direccionalGUI.add(light.target.position, 'z', -10, 10);
            direccionalGUI.add(rotacionGUI, 'x', 0, 180).setValue(90).onChange(rotateLigth);
            direccionalGUI.add(rotacionGUI, 'z', 0, 180).setValue(90).onChange(rotateLigth);
        
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
  mounted() {
      this.main();
  }
}
</script>


<template>
    <h3>Luz direccional</h3>
    <p>Este modelo de iluminación simulan grandes fuentes luminosas que se encuentran a una gran distancia,
        como puede ser el Sol.</p>
    <img class="center" src="../assets/img/Teoria/direccional.png" alt="Esquema luz direccional" width="25%" height="auto">
    <p>Como parámetros tiene:
        <ul>
            <li><b>Intensidad</b> de la luz.</li>
            <li><b>Dirección</b> u objetivo donde enfocar la luz.</li>
        </ul>
        Hay modelos que permiten establecer el tamaño del área de iluminación, en este caso se representa con unas
        líneas amarillas.
    </p>
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
