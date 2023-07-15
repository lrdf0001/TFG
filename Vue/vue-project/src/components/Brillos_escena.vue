<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'


export default {
    name: 'Brillos',
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

    //========================= Escenas ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x8d9398);

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

    //========================= Luces =============================
        const color = 0xFFFFFF;
        const intensity = 1;

        const ambientLight = new THREE.AmbientLight(color, intensity);    
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(10, 10, 10);
        light.target.position.set(0, 0, 0);

        light.castShadow = true;
        light.shadow.mapSize.width = 1000,
        light.shadow.mapSize.height = 1000; 
        light.shadow.camera.near = 0.5; 
        light.shadow.camera.far = 500;

        scene.add(light.target);
        scene.add(light);

    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.x = 5.5;
        camera.position.y = 5.5;
        camera.position.z = 5.5;
        camera.lookAt(0,0,0);
        scene.add(camera);

    //========================== Modelos ==============================

        const pivot = new THREE.Object3D();
        scene.add(pivot);

        const model = {
            radius: 3,
            tubeRadius: 1,
            tubularSegments: 75,
            radialSegments: 50,
            p: 2,
            q: 3
        };
        
        var  slipknot;
        var geometry;

        var mat = new THREE.MeshStandardMaterial({
            color: 0xbcbcbc,
            emissive: 0x000000,
            roughness: 0.5,
            metalness: 1.0
        });

        const textureLoader = new THREE.TextureLoader();
        const baseColor = textureLoader.load('./src/assets/img/Wood/wood_basecolor.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 20, 3 );
        } );

        const baseAO = textureLoader.load('./src/assets/img/Wood/wood_ambientocclusion.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 20, 3 );
        } );

        const baseHeight = textureLoader.load('./src/assets/img/Wood/wood_height.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 20, 3 );
        } );

        const baseNormal = textureLoader.load('./src/assets/img/Wood/wood_normal.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 20, 3 );
        } );

        const baseRoughness = textureLoader.load('./src/assets/img/Wood/wood_roughness.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 20, 3 );
        } );

        const woodTexture = new THREE.MeshStandardMaterial({
            map: baseColor,
            aoMap: baseAO,
            bumpMap: baseHeight,
            bumpScale: 0.75,
            normalMap: baseNormal,
            roughnessMap: baseRoughness,
        });

        const madera = { bool:false };

        function generateTorus(){
            pivot.remove(slipknot);

            geometry = new THREE.TorusKnotGeometry(model.radius, model.tubeRadius,
                model.tubularSegments, model.radialSegments, model.p, model.q);

            if(madera.bool){
                slipknot = new THREE.Mesh(geometry, woodTexture);
            }else{
                slipknot = new THREE.Mesh(geometry, mat);
            }            

            slipknot.castShadow = true;
            slipknot.receiveShadow = true;
            
            pivot.add(slipknot);
        }
        generateTorus();


    //========================== Render =============================
        var canvas = document.querySelector('#mi_canvas');
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
        controls.target.set(0, 0, 0);
        controls.update();

    //============================ GUI ============================        

        const gui = new GUI( { autoPlace: false } );	
        var customContainer = document.querySelector('#gui').append(gui.domElement); 

        const folder = gui.addFolder( 'Geometria' );
        folder.add( model, 'radius', 1, 3 ).setValue(3).onChange( generateTorus ).name("Tamaño");
        folder.add( model, 'tubeRadius', 0.1, 1.5 ).setValue(1).onChange( generateTorus ).name("Radio");
        folder.add( model, 'tubularSegments', 20, 100, 1 ).step( 1 ).onChange( generateTorus ).name("Segmentos");
        folder.add( model, 'radialSegments', 3, 100, 1 ).onChange( generateTorus ).name("Radiales");
        //folder.add( model, 'p', 1, 3, 1 ).setValue(2).onChange( generateTorus ).name("Torsion 1");
        //folder.add( model, 'q', 1, 3, 1 ).setValue(3).onChange( generateTorus ).name("Torsion 2");

        const folder2 = gui.addFolder( 'Metal' );
        folder2.addColor(new ColorGUIHelper(mat, 'color'), 'value').name('Color');
        folder2.addColor(new ColorGUIHelper(mat, 'emissive'), 'value').name('Emisivo');
        folder2.add(mat, 'roughness', 0, 1, 0.1).setValue(0.5).name('Rugosidad');
        folder2.add(mat, 'metalness', 0, 1, 0.1).setValue(1).name('Metalico');    

        gui.add(madera, 'bool').name("Madera").onFinishChange(generateTorus);
    //========================= Visualiza =========================

        function animate() {

            pivot.rotation.y += 0.001;
            pivot.rotation.x += 0.001;
            
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
    <p>Texto explicativo de filtros de brillos</p>
</template>