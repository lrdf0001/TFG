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
        camera.position.z = 8;
        camera.lookAt(0,0,0);
        scene.add(camera);

    //========================== Plano ==============================
        const planoGeo = new THREE.PlaneGeometry(10,10);
        var textura1 = new THREE.TextureLoader().load('./src/assets/img/lineas.png');
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

        const textureFolder = gui.addFolder('Propiedades');
        textureFolder.add(laTextura, 'minFilter', options.minFilters).onChange(() => updateMinFilter()).name("Minificación");
        textureFolder.add(laTextura, 'magFilter', options.magFilters).onChange(() => updateMagFilter()).name("Magnificación");
        
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
    <h3>Texturas</h3>
    <p>Una textura es una imagen bidimensional que se adhiere a la superficie del modelo para aprtar más
        infomación a parte de la topología y geometría. La aplicación de texturas nos permite definir un valor 
        diferente de color por cada fragmento, con lo que somos capaces de añadir más detalle a los modelos 
        sin tener que aumentar la geometría.
    </p>
    <p>
        Para aplicar una textura a un modelo es necesario definir la correspondencia entre los vértices del modelo 
        y los <b>téxeles</b> (parecido a los píxeles de una imagen), ya que usan un espacio de coordenadas diferente 
        denominado <b>coordenadas de textura</b>:
        <ul>
            <li>Las coordenadas de textura <i>u</i> y <i>v</i> tienen valores [0, 1].</li>
            <li><b>Espacio de la textura</b>, definido por los ejes <i>s</i> y <i>t</i> con valores [0, 1].</li>
            <li>Las coordenadas de textura de cada vértice se interpolan en el proceso de rasterización, y las
                 coordenadas de textura resultantes se convierten al espacio de la textura.</li>
        </ul>
    </p>

    <h4>Interpolación</h4>
    <p><b>Problema</b>: Los valores que obtenemos en el espacio de la imagen normalmente van a ser números decimales, mientras que las 
        imágenes ráster están formadas por puntos que tienen coordenadas enteras. </p>
    <p>Soluciones:
        <ul>
            <li>
                <b>Nearest</b>, seleccionar el téxel de coordenadas más cercanas a las coordenadas del espacio de la imagen. No se interpola.
            </li>
            <li>
                <b>Linear</b>, hacer una interpolación lineal de los cuatro téxeles que rodean a las coordenadas del espacio de la imagen.
            </li>
        </ul>
        <img src="../assets/img/Teoria/nearest.png" alt="Nearest" width="25%" height="auto">
        <img src="../assets/img/Teoria/linear.png" alt="Nearest" width="25%" height="auto">
    </p>
    <p>La interpolación lineal también sirve para solventar el problema de <b>magnificación</b>: se da cuando la rasterización del polígono 
        produce más píxeles que téxeles tiene la textura. Entonces hay que ampliar la resolución de la imagen de textura para que un téxel 
        se corresponda con un píxel.</p>
        <img class="center" src="../assets/img/Teoria/magni.png" alt="Nearest" width="25%" height="auto">
    <h4>Mipmapping</h4>
    <p>
        <b>Problema</b>: A la hora de aplicar una textura a un polígono, es muy habitual que o bien la textura tenga más téxeles que el 
        número de píxeles que ocupa el polígono, lo que se conoce como <b>minificación</b>.
    </p>
    
    <p>
        <b>Solución</b>: La técnica del <b>mipmapping</b> consiste en generar imágenes de textura de menor tamaño que la imagen de textura 
        original, más concretamente las nuevas dimensiones son la mitad de las dimensiones del mipmap de nivel anterior.
    </p>
    <!--
    <div padding-bottom="1em" padding-top="1em">
        <img  src="../assets/img/Teoria/mini.png" alt="Nearest" width="25%" height="auto">
        <img  src="../assets/img/Teoria/mipmap.png" alt="Nearest" width="30%" height="auto">
    </div>
-->
    <div class="row">
        <div id="small-img" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 center">
            <ul class="sin_punto">
            <li>
                <img src="../assets/img/Teoria/mini.png" class="img-responsive inline-block" alt="Responsive image" />
            </li>
            <li>
                <img src="../assets/img/Teoria/mipmap.png" class="img-responsive inline-block" alt="Responsive image" />
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