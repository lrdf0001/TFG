import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

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

    //========================= Escena ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF);
        var canvas = document.querySelector('#mi_canvas');    
    
    
    //========================= Luces =============================
        const color = 0xFFFFFF;
        var ambientLight = new THREE.AmbientLight(color, 0.3);        
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(color, 0.8);
        light.position.set(1, 5, 0);
        light.target.position.set(0, 0, -2);
        scene.add(light);
        scene.add(light.target);

        light.shadow.mapSize.width = 1000,
        light.shadow.mapSize.height = 1000; 
        light.shadow.camera.near = 0.5; 
        light.shadow.camera.far = 500;

    
    
    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 25);
        camera.position.x = 7;
        camera.position.y = 3;
        camera.position.z = 7;
        camera.lookAt(0,0,0);
        scene.add(camera);

		scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );
    
    //========================== Modelos ==============================
        const gltfLoader = new GLTFLoader();
        const url = '../Models/SwordFish_II/swordfish_ii.glb';
        gltfLoader.load(url, (gltf) => {
        const root = gltf.scene;
        scene.add(root);      
        });

        const planoGeo = new THREE.CircleGeometry( 10, 32 ); 
        const planoMat = new THREE.MeshStandardMaterial({ color: 0x424949 });
        var plano = new THREE.Mesh(planoGeo, planoMat);
        scene.add(plano);
        plano.rotateX(-90*3.1415/180.0);
        plano.translateZ(-1.25);
        
    //========================== Render =============================
        
        const renderer = new THREE.WebGLRenderer({canvas: canvas});
    
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
    /*
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
        */
    
    //============================ GUI ============================
    /*
        const gui1 = new GUI( { autoPlace: false } );
        var customContainer = document.querySelector('#gui').append(gui1.domElement);
        
        const ambientalGUI = gui1.addFolder('Ambiental');
        ambientalGUI.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('Color');
        ambientalGUI.add(ambientLight, 'intensity', 0, 2, 0.01).name("Intensidad");
    */    
    
    //========================= Visualiza =========================
        const clock = new THREE.Clock();

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