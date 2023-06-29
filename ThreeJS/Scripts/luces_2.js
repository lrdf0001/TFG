import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';


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

function main(){

    //========================= Escenas ============================
        const scene = new THREE.Scene();  
        scene.background = new THREE.Color(0x85c1e9);
        var canvas = document.querySelector('#mi_canvas2');
    
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
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 5, 0);
        light.target.position.set(-5, 0, 0);
        light.castShadow = true;
        scene.add(light);
        scene.add(light.target);

        light.shadow.mapSize.width = 1000,
        light.shadow.mapSize.height = 1000; 
        light.shadow.camera.near = 0.5; 
        light.shadow.camera.far = 500;

        const helper = new THREE.CameraHelper( light.shadow.camera );
        scene.add( helper );

        
        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);        
        scene.add(ambientLight);
        
    
    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20);
        camera.position.x = 3;
        camera.position.y = 3;
        camera.position.z = 3;
        camera.lookAt(0,0,0);
        scene.add(camera);        
    
    //========================== Modelos ==============================

        //Tree Assets by Ben Desai [CC-BY] via Poly Pizza
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        mtlLoader.load('../Models/Tree Assets/materials.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            
            objLoader.load('../Models/Tree Assets/model.obj', (root) => {
                scene.add(root);

                root.traverse(function(node){
                    if(node.isMesh)
                        node.castShadow = true;
                        node.receiveShadow = true;
                });

                root.scale.x = 4;
                root.scale.y = 4;
                root.scale.z = 4;
              });
        });
    
    //========================== Render =============================
        
        const renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        //renderer.setSize( window.innerWidth, window.innerHeight );
    
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
        var customContainer = document.querySelector('#gui2').append(gui1.domElement);
        
        const direccionalGUI = gui1.addFolder('Direccional');
        direccionalGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('Color');
        direccionalGUI.add(light, 'intensity', 0, 2, 0.01).name("Intensidad");
        direccionalGUI.add(light.target.position, 'x', -10, 10);
        direccionalGUI.add(light.target.position, 'z', -10, 10);
    
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
    
    window.addEventListener('load', main);