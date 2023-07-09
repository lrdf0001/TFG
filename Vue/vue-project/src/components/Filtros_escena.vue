<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'

export default {
    name: 'Filtros',
    methods: {

    main: function(){

    //========================= Escenas ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1b2631);

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
        const color = 0xffffff;
        const intensity = 1;
        const ambientLight = new THREE.AmbientLight(color, intensity);
        const pointLight = new THREE.PointLight(0xd5d8dc , intensity);
        pointLight.position.set(3, 3, 3);
        scene.add(ambientLight);
        //scene.add(pointLight);

    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 6;
        camera.lookAt(0,0,0);
        scene.add(camera);

    //========================== Plano ==============================
        const planoGeo = new THREE.PlaneGeometry(10,10);
        var textura1 = new THREE.TextureLoader().load('./src/assets/img/red-and-green2.png');
        var mat = new THREE.MeshBasicMaterial( { 
            map: textura1
        } );
        var plano = new THREE.Mesh(planoGeo, mat);
        scene.add(plano);

        var textura2 = new THREE.TextureLoader().load('./src/assets/img/texture_grid.png');
        var mat2 = new THREE.MeshBasicMaterial( { 
            map: textura2
        } );
        var plano2 = new THREE.Mesh(planoGeo, mat2);

        var laTextura = textura1;

    //========================== Render =============================
        var canvas = document.querySelector('#mi_canvas');
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
        controls.target.set(0, 0, 0);
        controls.update();

    //============================ GUI ============================

        const data = {seleccion: 1}

        const options = {
            minFilters: {
                NearestFilter: THREE.NearestFilter,
                NearestMipMapLinearFilter: THREE.NearestMipMapLinearFilter,
                NearestMipMapNearestFilter: THREE.NearestMipMapNearestFilter,
                LinearFilter: THREE.LinearFilter,
                LinearMipMapLinearFilter: THREE.LinearMipMapLinearFilter,
                LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
            },
            magFilters: {
                NearestFilter: THREE.NearestFilter,
                LinearFilter: THREE.LinearFilter,
            },
            imagen:{
                opcion1: 1,
                opcion2: 2,
            },
        };

        function updateMinFilter() {
            if(data.seleccion == 1){
                textura1.minFilter = Number(laTextura.minFilter) ;
                textura1.needsUpdate = true
            }else{
                textura2.minFilter = Number(laTextura.minFilter) ;
                textura2.needsUpdate = true
            }
        }

        function updateMagFilter() {
            if(data.seleccion == 1){
                textura1.magFilter = Number(laTextura.magFilter);
                textura1.needsUpdate = true
            }else{
                textura2.magFilter = Number(laTextura.magFilter) ;
                textura2.needsUpdate = true
            }
        }

        function changeTexture(){
            console.log(data.seleccion);
            if(data.seleccion == 2){
                scene.remove(plano);
                scene.add(plano2);
            }else{
                scene.remove(plano2);
                scene.add(plano);		
            }
        }

        const gui = new GUI( { autoPlace: false } );	
        var customContainer = document.querySelector('#gui').append(gui.domElement); 

        const textureFolder = gui.addFolder('Filtros');
        textureFolder.add(laTextura, 'minFilter', options.minFilters).onChange(() => updateMinFilter());
        textureFolder.add(laTextura, 'magFilter', options.magFilters).onChange(() => updateMagFilter());
        
        textureFolder.add(data, 'seleccion', options.imagen).name('Textura').setValue(options.imagen.opcion1).onFinishChange(() => changeTexture());
        
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
    <p>Texto explicativo de filtros de texturas</p>
</template>
