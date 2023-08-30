<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
//import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export default {
name: 'Ambiental',

methods: {

    main:function main(){

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

    //========================= Escena ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5499c7);
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
        const color = 0xFFFFFF;
        const intensity = 1;
        var ambientLight = new THREE.AmbientLight(color, intensity);        
        scene.add(ambientLight);

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0x82e0aa ;  // light green
        const  hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(hemisphereLight);
  
  
    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20);
        camera.position.x = 4;
        camera.position.y = 3;
        camera.position.z = 4;
        camera.lookAt(0,0,0);
        scene.add(camera);
  
    //========================== Modelos ==============================
        /*
        let mixer;
        const loader = new FBXLoader();
        loader.load( './src/assets/Models/Whale/Whale.fbx', function ( object ) { //Whale by Quaternius via Poly Pizza

            mixer = new THREE.AnimationMixer( object );

            const action = mixer.clipAction( object.animations[ 0 ] );
            action.play();

            scene.add( object );
            object.scale.x = 0.005;
            object.scale.y = 0.005;
            object.scale.z = 0.005;
        } );
        */

        let mixer;
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('/whale.glb', (gltf) => {
            const root = gltf.scene;

            mixer = new THREE.AnimationMixer( root );
            const action = mixer.clipAction( root.animations[ 0 ] );
            action.play();

            root.scale.x = 0.005;
            root.scale.y = 0.005;
            root.scale.z = 0.005;

            scene.add(root);
        });

        /*
        const fontLoader = new FontLoader();
        fontLoader.load(
            '/helvetiker_regular.typeface.json',
            (droidfont) => {
                const textGeometry =  new TextGeometry('Ambiental', {
                    font: droidfont,
                    size: 1,
                    height: 1,
                });
                const textMaterial = new THREE.MeshStandardMaterial( { 
                    color: 0xe5e7e9,
                    emissive: 0x000000,
                    roughness: 0.6,
                    metalness: 0.6 
                } );
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                
                scene.add(textMesh);
                
                textMesh.translateX(-3.5);
                textMesh.translateZ(-0.5);
                textMesh.castShadow = true;
                textMesh.receiveShadow = true;
            }
        );

        const grassGeometry = new THREE.BoxGeometry( 10, 0.25, 7 );
        const grassMat = new THREE.MeshStandardMaterial({
            color: 0x66bb6a,
            emissive: 0x000000,
            roughness: 0.6,
            metalness: 0.6
        });		
        const hierba = new THREE.Mesh( grassGeometry, grassMat );
        scene.add(hierba);
        hierba.translateY(-0.125);
        hierba.receiveShadow = true;

        const groundGeometry = new THREE.BoxGeometry( 10, 0.5, 7 );	
        const groundMat = new THREE.MeshPhongMaterial( { color: 0xdc7633 } );		
        const ground = new THREE.Mesh( groundGeometry, groundMat );
        scene.add(ground);
        ground.translateY(-0.5);

        const stoneGeometry = new THREE.BoxGeometry( 10, 0.75, 7 );	
        const stoneMat = new THREE.MeshPhongMaterial( { color: 0xabb2b9 } );		
        const stone = new THREE.Mesh( stoneGeometry, stoneMat );
        scene.add(stone);
        stone.translateY(-1.125);
        */
      
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
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
  
    //============================ GUI ============================
  
        const gui1 = new GUI( { autoPlace: false } );
        var customContainer = document.querySelector('#gui').append(gui1.domElement);
        
        const ambientalGUI = gui1.addFolder('Ambiental');
        ambientalGUI.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('Color');
        ambientalGUI.add(ambientLight, 'intensity', 0, 2, 0.01).name("Intensidad");

        const hemisphereGUI = gui1.addFolder('Hemisferio');
        hemisphereGUI.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('Superior');
        hemisphereGUI.addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value').name('Inferior');
        hemisphereGUI.add(hemisphereLight, 'intensity', 0, 2, 0.01).name("Intensidad");
  
  //========================= Visualiza =========================
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame( animate );

            const delta = clock.getDelta();
            if ( mixer ) mixer.update( delta );            
    
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
    <h3>Luz ambiente</h3>
    <p>Fuente luminosa difusa no direccional, resultado de la reflexión de la 
        luz en el entorno de la escena.</p>
    <p>Viene dado por dos parámetros:
        <ul>
            <li><b>Intensidad</b> de la luz.</li>
            <li><b>Coeficiente</b> (K) de reflexión.</li>
        </ul>
    </p>
    <p>En este caso se permite modificar tanto la intensidad como el color de la luz.</p>

    <h3>Luz de hemisferio</h3>
    <p>Es una variante de la luz ambiental y se puede combinar con esta. Representa la luz reflejada por el cielo, 
        que incide desde arriba, y la luz reflejada por el suelo, que indice desde abajo.
    </p>
</template>

