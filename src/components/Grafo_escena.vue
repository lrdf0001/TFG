<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
//import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export default {
    name: 'Grafo',
    methods: {

    main: function(){

    //========================= Escena ============================
        const scene = new THREE.Scene();

        scene.background = new THREE.Color(0x151f60);
        /*
        const loader = new THREE.TextureLoader();
        const bgTexture = loader.load('./src/assets/img/space.jpg');
        scene.background = bgTexture;
        */

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
        var ambientLight = new THREE.AmbientLight( 0xaed6f1 , intensity);        
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(color, 0.5);
        light.position.set(5, 10, 2);
        light.target.position.set(-0, 0, 0);
        scene.add(light);        
        scene.add(light.target);

        light.castShadow = true;
        light.shadow.mapSize.width = 1000,
        light.shadow.mapSize.height = 1000; 
        light.shadow.camera.near = 0.5; 
        light.shadow.camera.far = 500;
    
    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.x = 7;
        camera.position.y = 7;
        camera.position.z = 7;
        camera.lookAt(0,0,0);
        scene.add(camera);
    
    //========================== Modelos ==============================

    //------------------------ Toon Material --------------------------
        
        const threeTone = new THREE.TextureLoader().load('/img/gradientMaps/threeTone.jpg');
        threeTone.minFilter = THREE.NearestFilter;
        threeTone.magFilter = THREE.NearestFilter;

        const yellowToon = new THREE.MeshToonMaterial( { color: 0xf7dc6f });
        yellowToon.gradientMap = threeTone;

        const blackToon = new THREE.MeshToonMaterial( { color: 0x212f3d });
        blackToon.gradientMap = threeTone;

    //-------------------------- Hombro ----------------------------
        const dataHombro = {
            radius: 0.3,
            widthSegments: 15,
            heightSegments: 15,
            x: 90,
            y: 90,
            z: 90
        };
        const esferaGeo = new THREE.SphereGeometry(dataHombro.radius, dataHombro.widthSegments, dataHombro.heightSegments);
        const hombro = new THREE.Mesh( esferaGeo, blackToon );
        scene.add(hombro);
        hombro.castShadow = true;
        hombro.receiveShadow = false;
    
    //-------------------------- Brazo ----------------------------
        const dataBrazo = {
            radiusTop: 0.3,  
            radiusBottom: 0.3,
            height: 1.5,
            radialSegments: 15,
            heightSegments: 15
        };
        const cylinderGeo = new THREE.CylinderGeometry(dataBrazo.radiusTop, dataBrazo.radiusBottom, 
            dataBrazo.height, dataBrazo.radialSegments, dataBrazo.heightSegments);
        const brazo = new THREE.Mesh(cylinderGeo, yellowToon);
        brazo.translateY(0.75);
        hombro.add(brazo);
        brazo.castShadow = true;
        brazo.receiveShadow = false;
    
    //-------------------------- Codo ----------------------------
        const dataCodo = {
            radius: 0.3,
            widthSegments: 15,
            heightSegments: 15,
            x: 0,
            y: 0,
            z: 0
        };

        const codoGeo = new THREE.SphereGeometry(dataCodo.radius, dataCodo.widthSegments, dataCodo.heightSegments);
        const codo = new THREE.Mesh( codoGeo, blackToon );
        codo.translateY(1.5);
        hombro.add(codo);
        codo.castShadow = true;
        codo.receiveShadow = false;
    
    //-------------------------- Antebrazo ----------------------------
        const dataAntebrazo = {
            radiusTop: 0.2,  
            radiusBottom: 0.3,
            height: 1.5,
            radialSegments: 15,
            heightSegments: 15
        };

        const antebrazoGeo = new THREE.CylinderGeometry(dataAntebrazo.radiusTop, dataAntebrazo.radiusBottom, 
            dataAntebrazo.height, dataAntebrazo.radialSegments, dataAntebrazo.heightSegments);
        const antebrazo = new THREE.Mesh(antebrazoGeo, yellowToon);
        antebrazo.translateY(0.75);
        codo.add(antebrazo);
        antebrazo.castShadow = true;
        antebrazo.receiveShadow = false;
    
    //-------------------------- Muñeca ----------------------------
        const dataMuneca = {
            radius: 0.2,
            widthSegments: 15,
            heightSegments: 15,
            y: 0,
        };
        const munecaGeo = new THREE.SphereGeometry(dataMuneca.radius, dataMuneca.widthSegments, dataMuneca.heightSegments);
        const muneca = new THREE.Mesh( munecaGeo, blackToon );
        muneca.translateY(1.5);
        codo.add(muneca);
        muneca.castShadow = true;
        muneca.receiveShadow = false;

    //-------------------------- Mano ----------------------------
        const manoGeo = new THREE.BoxGeometry( 0.15, 0.15, 0.5 );
        const mano = new THREE.Mesh( manoGeo, yellowToon );
        mano.translateY(0.25);
        muneca.add(mano);
        mano.castShadow = true;
        mano.receiveShadow = false;

        const dedoGeo = new THREE.BoxGeometry( 0.15, 0.5, 0.15 );
        const dedo1 = new THREE.Mesh( dedoGeo, yellowToon );
        muneca.add(dedo1);
        dedo1.translateY(0.4);
        dedo1.translateZ(0.25);
        dedo1.castShadow = true;
        dedo1.receiveShadow = true;

        const dedo2 = new THREE.Mesh( dedoGeo, yellowToon );
        muneca.add(dedo2);
        dedo2.translateY(0.4);
        dedo2.translateZ(-0.25);
        dedo2.castShadow = true;
        dedo2.receiveShadow = false;

    //-------------------------- Rover ----------------------------
    /*
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

        mtlLoader.load('./src/assets/Models/Rover/rover.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            
            objLoader.load('./src/assets/Models/Rover/rover.obj', (root) => {
                scene.add(root);

                root.traverse(function(node){
                    if(node.isMesh){
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                root.scale.x = 4;
                root.scale.y = 4;
                root.scale.z = 4;
                root.translateY(-2.5);
                root.translateX(1.3);
                root.rotateY(degToRad(180));
            });
        });

        //-------------------------- Luna ----------------------------
        const mtlLoader2 = new MTLLoader();
        const objLoader2 = new OBJLoader();

        mtlLoader2.load('./src/assets/Models/Moon/1226 moon.mtl', (mtl) => {
            mtl.preload();
            objLoader2.setMaterials(mtl);
            
            objLoader2.load('./src/assets/Models/Moon/1226 moon.obj', (root) => {
                scene.add(root);

                root.traverse(function(node){
                    if(node.isMesh){
                        node.castShadow = false;
                        node.receiveShadow = true;
                    }
                });
                root.scale.x = 0.5;
                root.scale.y = 0.5;
                root.scale.z = 0.5;
                root.translateY(-39.1);
            });
        });
        */

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
        const hombroGUI = {x:90, y:90, z:90};
        const codoGUI = {x:270, y:270, z:270};
        const munecaGUI = {y: 90};
        const animacion = { play: false};

        function degToRad(deg){
            return (3.1415 * deg) / 180.0;
        }

        function animar(){
            if(hombroGUI.x < 145 && hombroGUI.z < 145){
                hombroGUI.x += 0.1;
                hombroGUI.z += 0.1;

                rotarHombro();                
            }

            if(codoGUI.x > 220 && codoGUI.z > 220){
                codoGUI.x -= 0.1;
                codoGUI.z -= 0.1;

                rotarCodo();
            }

            if(munecaGUI.y < 180){
                munecaGUI.y += 0.15;

                rotarMuneca();
            }

            gui.updateDisplay();
        }

        function rotarHombro(){
            var angX = -(dataHombro.x - hombroGUI.x);
            dataHombro.x += angX;
            hombro.rotateX(degToRad(angX));

            var angY = -(dataHombro.y - hombroGUI.y);
            dataHombro.y += angY;
            hombro.rotateY(degToRad(angY));

            var angZ = -(dataHombro.z - hombroGUI.z);
            dataHombro.z += angZ;
            hombro.rotateZ(degToRad(angZ));
        }

        function rotarCodo(){
            var angX = -(dataCodo.x - codoGUI.x);
            dataCodo.x += angX;
            codo.rotateX(degToRad(angX));

            var angY = -(dataCodo.y - codoGUI.y);
            dataCodo.y += angY;
            codo.rotateY(degToRad(angY));

            var angZ = -(dataCodo.z - codoGUI.z);
            dataCodo.z += angZ;
            codo.rotateZ(degToRad(angZ));
        }

        function rotarMuneca(){
            var angY = -(dataMuneca.y - munecaGUI.y);
            dataMuneca.y += angY;
            muneca.rotateY(degToRad(angY));
        }

        const gui = new GUI( { autoPlace: false } );
        var customContainer = document.querySelector('#gui').append(gui.domElement);
    
        const hombroFolder = gui.addFolder( 'Rotacion Hombro' );
        hombroFolder.add(hombroGUI, 'x', 0, 180, 5).name('x').setValue(90).onChange((value) => rotarHombro());
        hombroFolder.add(hombroGUI, 'y', 0, 180, 5).name('y').setValue(90).onChange((value) => rotarHombro());
        hombroFolder.add(hombroGUI, 'z', 45, 145, 5).name('z').setValue(90).onChange((value) => rotarHombro());

        const codoFolder = gui.addFolder( 'Rotacion Codo' );
        codoFolder.add(codoGUI, 'x', 220, 330, 5).name('x').setValue(270).onChange((value) => rotarCodo());
        //codoFolder.add(codoGUI, 'y', 180, 360, 5).name('y').setValue(270).onChange((value) => rotarCodo());
        codoFolder.add(codoGUI, 'z', 220, 330, 5).name('z').setValue(270).onChange((value) => rotarCodo());

        const munecaFolder = gui.addFolder( 'Rotacion Muñeca' );
        munecaFolder.add(munecaGUI, 'y', 0, 180, 5).name('y').setValue(90).onChange((value) => rotarMuneca());
        
        gui.add(animacion, 'play').name("Animar");

    //========================= Visualiza =========================
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame( animate );

            if(animacion.play) animar();
    
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
    <h3>Grafo de escena</h3>
    <p>Es posible dividir en partes y articular objetos mediante una <b>jerarquía de objetos</b> y 
        transformaciones asociadas a cada una de las partes de dicho objeto. Para construir una 
        jerarquía de objetos eficiente y generalizar la construcción de objetos articulados se 
        implementa un <b>grafo de escena</b>.</p>

    <p>Para ello se construyen dos tipos de nodos:
        <ul>
            <li><b>Nodo hoja</b>: con la geometría.</li>
            <li><b>Nodos intermedios</b>: soporte para los distintos hijos y transformaciones.
                Transformación del sistema de coordenadas local al de mundo y transformación relativa al padre.</li>
        </ul>
    </p>
    
    <p>Si lo plantemos como si fuera un brazo, el grafo sería el siguiente:</p>
    <img src="../assets/img/grafo_escena.png" alt="Grafo de escena" width="45%" height="auto">
</template>
