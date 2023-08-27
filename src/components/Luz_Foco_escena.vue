<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export default {
    name: 'Focal',
    methods: {

    main: function(){
        class DegRadHelper {
            constructor(obj, prop) {
                this.obj = obj;
                this.prop = prop;
            }
            get value() {
                return THREE.MathUtils.radToDeg(this.obj[this.prop]);
            }
            set value(v) {
                this.obj[this.prop] = THREE.MathUtils.degToRad(v);
            }
        }

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

        //========================= Escenas ============================
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0d123f );
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
            
            var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);        
            scene.add(ambientLight);        

            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.SpotLight(color, intensity);
            light.position.set(0, 4.3, -2.5);
            scene.add(light);
            scene.add(light.target);

            light.castShadow = true;
            light.shadow.mapSize.width = 512; // default
            light.shadow.mapSize.height = 512; // default
            light.shadow.camera.near = 0.5; // default
            light.shadow.camera.far = 500; // default
            light.shadow.focus = 1; // default 
            
            const targetObject = new THREE.Object3D(); 
            scene.add(targetObject);
            targetObject.translateZ(-2);
            light.target = targetObject;
        
        //========================= Camara =============================
            const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.x = 8;
            camera.position.y = 6;
            camera.position.z = 8;
            camera.lookAt(0,0,0);
            scene.add(camera);        
        
        //========================== Modelos ==============================

            const mtlLoader = new MTLLoader();
            const objLoader = new OBJLoader();
            
            //./src/assets/Models/Taxi/Taxi.mtl
            mtlLoader.load('./src/assets/Models/Taxi/Taxi.mtl', (mtl) => {

                mtl.preload();
                objLoader.setMaterials(mtl);
                
                objLoader.load('./src/assets/Models/Taxi/Taxi.obj', (root) => {
                    scene.add(root);
                    
                    root.rotateY(-90*3.1415/180.0);
                    root.translateY(-1);
                    root.translateX(-1.5);
                    root.translateZ(1);

                    root.traverse(function(node){
                        if(node.isMesh)
                            node.castShadow = true;
                            node.receiveShadow = false;
                    });
                });
            });
            

            const mtlLoader2 = new MTLLoader();
            const objLoader2 = new OBJLoader();

            mtlLoader2.load('./src/assets/Models/Road2/road.mtl', (mtl) => {
                mtl.preload();
                objLoader2.setMaterials(mtl);
                
                objLoader2.load('./src/assets/Models/Road2/road.obj', (root) => {
                    scene.add(root);
                    
                    root.scale.x = 15;
                    root.scale.y = 15;
                    root.scale.z = 15;
                    root.translateY(-1);

                    root.traverse(function(node){
                        if(node.isMesh)
                            node.receiveShadow = true;
                    });
                });
            });

            const mtlLoader3 = new MTLLoader();
            const objLoader3 = new OBJLoader();

            mtlLoader3.load('./src/assets/Models/Police Car/Cop.mtl', (mtl) => {
                mtl.preload();
                objLoader3.setMaterials(mtl);
                
                objLoader3.load('./src/assets/Models/Police Car/Cop.obj', (root) => {
                    scene.add(root);
                    
                    root.rotateY(90*3.1415/180.0);
                    root.translateY(-0.9);
                    root.translateX(-1.5);
                    root.translateZ(1);

                    root.traverse(function(node){
                        if(node.isMesh)
                            node.castShadow = true;
                            node.receiveShadow = false;
                    });
                });
            });

            const mtlLoader4 = new MTLLoader();
            const objLoader4 = new OBJLoader();

            mtlLoader4.load('./src/assets/Models/LampPost/lamp_post.mtl', (mtl) => {
                mtl.preload();
                objLoader4.setMaterials(mtl);
                
                objLoader4.load('./src/assets/Models/LampPost/lamp_post.obj', (root) => {
                    scene.add(root);
                    root.translateY(-1);
                    root.translateZ(-4);

                    root.traverse(function(node){
                        if(node.isMesh){
                            node.castShadow = true;
                            node.receiveShadow = false;
                        }
                    });
                });
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

            const helper = new THREE.SpotLightHelper(light);
            scene.add(helper);

            function updateLight() {
                light.target.updateMatrixWorld();
                helper.update();
            }
        
            const gui1 = new GUI( { autoPlace: false } );
            var customContainer = document.querySelector('#gui').append(gui1.domElement);
            
            const focalGUI = gui1.addFolder('Focal');
            focalGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('Color');
            focalGUI.add(light, 'intensity', 0, 2, 0.01).name("Intensidad");
            focalGUI.add(light, 'distance', 1, 40).onChange( helper.update()).name("Atenuacion");
            focalGUI.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').setValue(60).onChange(updateLight).name("Angulo");
            focalGUI.add(light, 'penumbra', 0, 1, 0.01).setValue(0.1).name("Penumbra");         
        
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
    <h3>Foco</h3>
    <p>Un foco al igual que la luz puntual es una fuente luminosa situada en un punto en concreto, 
        con la diferencia que solo ilumina en un rango y dirección.</p>
    <p>Los parametros que definen a esta luz son:
        <ul>
            <li><b>Intensidad</b>.</li>
            <li><b>Posicion</b>.</li>
            <li><b>Atenuación</b>, pérdida intensidad conforme más se aleja de la fuente.</li>
            <li><b>Ángulo</b> de apertura.</li>
            <li><b>Penumbra</b>, degradado de la sombra que se aplica en la frontera que delimita el ángulo de apertura.</li>
        </ul>
    </p>
</template>
