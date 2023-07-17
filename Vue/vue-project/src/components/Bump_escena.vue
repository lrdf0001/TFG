
<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'

export default {
    name: 'Texturas',
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
        const color = 0xFFFFFF;
        const intensity = 1;

        const ambientLight = new THREE.AmbientLight(color, intensity);    
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 5, 5);
        light.target.position.set(-5, 0, -5);

        light.castShadow = true;

        scene.add(light.target);
        scene.add(light);

    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.x = 3;
        camera.position.y = 3;
        camera.position.z = 3;
        camera.lookAt(0,0,0);
        scene.add(camera);

    //========================== Modelos ==============================

    //-------------------------- Materiales ----------------------------
        const loader = new THREE.TextureLoader();

        const textura1 = loader.load('./src/assets/img/bricks/P4_BaseColor.png');
        const bump1 = loader.load('./src/assets/img/bricks/P4_Ao.png');
        var material1 = new THREE.MeshStandardMaterial({
            map: textura1,
            bumpMap: bump1
        });

        const textura2 = loader.load('./src/assets/img/bricks/rocks.png');
        const bump2 = loader.load('./src/assets/img/bricks/rock_bump2.png');
        var material2 = new THREE.MeshStandardMaterial({
            map: textura2,
            bumpMap: bump2
        });

        var elMaterial = material1;

    //-------------------------- Cubo ----------------------------
        const cubeGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);

        var cubo = new THREE.Mesh(cubeGeo, material1);
        cubo.castShadow = true;
        cubo.receiveShadow = true;

        scene.add(cubo);

    //-------------------------- Esfera ----------------------------
        const sphereGeo = new THREE.SphereGeometry(1.5, 30, 30);
        var esfera = new THREE.Mesh(sphereGeo, material1);
        esfera.castShadow = true;
        esfera.receiveShadow = true;


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
        
        const select = {model: 0, text: 1};

        const options = {
            modelos:{
                cubo:   0,
                esfera: 1
            },
            texturas:{
                ladrillos:  1,
                rocas:      2
            }
        }

        function actualizarBump(){
            if(select.text == 1){
                material1.bumpScale = elMaterial.bumpScale;
                material1.needsUpdate = true
            }else{
                material2.bumpScale = elMaterial.bumpScale;
                material2.needsUpdate = true
            }
        }
        
        function cambiarModelo(){
            if(select.model == 1){
                scene.remove(cubo);
                scene.add(esfera);
            }else if(select.model == 0){
                scene.remove(esfera);
                scene.add(cubo);
            }
        }

        function cambiarTextura(){
            if(select.text == 1){
                esfera.material = material1;
                cubo.material = material1;
            }else{
                esfera.material = material2;
                cubo.material = material2;
            }
            actualizarBump()
        }

        const gui = new GUI( { autoPlace: false } );	
        var customContainer = document.querySelector('#gui').append(gui.domElement); 

        const textureFolder = gui.addFolder('BumpMap');
        textureFolder.add(elMaterial, 'bumpScale', 0.0, 1.0, 0.1 ).name('Detalle').setValue(1.0).onChange(() => actualizarBump());
        textureFolder.add(select, 'model', options.modelos).name('Modelo').onFinishChange(() => cambiarModelo());
        textureFolder.add(select, 'text', options.texturas).name('Textura').onFinishChange(() => cambiarTextura());


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
    <h3>Bump Mapping</h3>
    <p>En los modelos 3D existen tres niveles de detalle:
        <ul>
            <li>Los detalles a <b>macroescala</b> se representan 
                a través de la geometría de los modelos (vértices, aristas y caras).</li>
            <li>Los detalles a <b>mesoescala</b> ocupan un pequeño número de píxeles. Se introducen 
                perturbaciones en el cálculo de la iluminación de los fragmentos para simular,
                a través de las variaciones de color, detalles:  modificar la normal a la superficie.</li>
            <li>Los detalles a <b>microescala</b> son más pequeños que un píxel. Los modelos de 
                reflexión que estudiamos representan el comportamiento de la superficie 
                de los objetos ante los rayos de luz.</li>            
        </ul>

        Para representar detalles a mesoescala se han desarrollado diferentes técnicas que se agrupan 
        bajo el nombre genérico de <b>bump mapping</b>.
    </p>
    <p>Una propuesta consiste en utilizar un <b>mapa de alturas</b> (heightfield). Esto no es más que 
        una textura en escala de grises, en la que los valores más claros representan una mayor altura,
        y los valores más oscuros una altura menor.</p>
    <p>En la actualidad, la propuesta más utilizada es el <b>normal mapping</b>. En este método, lo que se 
        guarda en la textura son directamente las normales a utilizar, codificadas como un color RGB. 
        Para cada fragmento, se recupera del mapa de normales el vector normal a utilizar en el cálculo 
        de iluminación, evitando así el tener que calcular los vectores de desplazamiento.</p>
    <div class="row">
        <div id="small-img" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 center">
            <ul class="sin_punto">
            <li>
                <img src="../assets/img/bricks/P4_Ao.png" class="img-responsive inline-block" alt="Heightfield" />
            </li>
            <li>
                <img src="../assets/img/bricks/P4_Normal.png" class="img-responsive inline-block" alt="Normal map" />
            </li>
            </ul>
        </div>
    </div>
</template>


<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}
.row li {
  width: 33.3%;
  float: left;
}

img {
  border: 0 none;
  display: inline-block;
  height: auto;
  max-width: 100%;
  vertical-align: middle;
  padding-left: 1em;
}

.sin_punto {
    list-style-type: none;
}
</style>