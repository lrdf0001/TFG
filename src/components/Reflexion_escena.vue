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

        const ambientLight = new THREE.AmbientLight(color, intensity/2);    
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
        

        var mat = new THREE.MeshStandardMaterial({
            color: 0xbcbcbc,
            emissive: 0x000000,
            roughness: 0.5,
            metalness: 1.0
        });

        const textureLoader = new THREE.TextureLoader();
        const baseColor = textureLoader.load('/img/Wood/wood_basecolor.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 25, 3 );
        } );

        const especular = textureLoader.load('/img/Wood/wood_ambientocclusion.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 25, 3 );
        } );

        const altura = textureLoader.load('/img/Wood/wood_height.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 25, 3 );
        } );

        const rugoso = textureLoader.load('/img/Wood/wood_roughness.png', function( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 25, 3 );
        } );

        const woodTexture = new THREE.MeshStandardMaterial({
            map: baseColor,
            aoMap: especular,
            bumpMap: altura,
            bumpScale: 0.15,
            roughnessMap: rugoso,
        });

        var slipknot;
        var geometry;
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
        const animacion = { play: false};

        const gui = new GUI( { autoPlace: false } );	
        var customContainer = document.querySelector('#gui').append(gui.domElement); 

        const folder = gui.addFolder( 'Geometria' );
        folder.add( model, 'radius', 1, 3 ).setValue(3).onChange( generateTorus ).name("Tamaño");
        folder.add( model, 'tubeRadius', 0.1, 1.5 ).setValue(1).onChange( generateTorus ).name("Radio");
        folder.add( model, 'tubularSegments', 20, 100, 1 ).step( 1 ).onChange( generateTorus ).name("Segmentos");
        folder.add( model, 'radialSegments', 3, 100, 1 ).onChange( generateTorus ).name("Radiales");

        const folder2 = gui.addFolder( 'Metal (material)' );
        folder2.addColor(new ColorGUIHelper(mat, 'color'), 'value').name('Color');
        folder2.addColor(new ColorGUIHelper(mat, 'emissive'), 'value').name('Emisivo');
        folder2.add(mat, 'roughness', 0, 1, 0.1).setValue(0.5).name('Difuso');
        folder2.add(mat, 'metalness', 0, 1, 0.1).setValue(1).name('Especular');    

        gui.add(madera, 'bool').name("Madera (textura)").onFinishChange(generateTorus);

        gui.add(animacion, 'play').name("Animar");
    //========================= Visualiza =========================

        function animate() {

            if(animacion.play){ 
                pivot.rotation.y += 0.001;
                pivot.rotation.x += 0.001;
            }
            
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
    <h3>Modelos de reflexión</h3>
    <p>El modelo de <b>reflexión difusa</b>, también llamado modelo de reflexión lambertiano representa 
        el comportamiento de la luz al alcanzar objetos con superficie <b>mate</b>. Estas superficies se 
        caracterizan porque son más o menos irregulares, lo que provoca que la luz se refleje en 
        proporción similar en todas las direcciones, y por tanto, no aparecen brillos.</p>
    <img class="center" src="../assets/img/Teoria/difusa2.png" alt="Nearest" width="25%" height="auto">

    <p>El modelo de <b>reflexión especular</b> describe la relación entre la luz y aquellos materiales con 
        superficie pulida. Estos materiales se caracterizan visualmente por la presencia de <b>brillos</b>, 
        debidos a que reflejan la luz preferentemente en una dirección concreta que depende de la 
        orientación de la superficie respecto a la fuente luminosa.</p>
    <img class="center" src="../assets/img/Teoria/especular.png" alt="Nearest" width="25%" height="auto">
    
    <p>No lo solo los materiales aplicados a los modelos tienen estas propiedades, las texturas también pueden
        emular estos efectos si se le aplican los <b>maps</b> correspondientes. Al igual que en la técnica de
        bump mapping, también existen mapas en escalas de grises con información de las propiedades 
        especular y difusa de la textura:
    </p>
    <div class="row">
        <div id="small-img" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 center">
            <ul class="sin_punto">
            <li>
                <img src="../assets/img/Wood/wood_ambientocclusion.png" class="img-responsive inline-block" alt="Responsive image" />
            </li>
            <li>
                <img src="../assets/img/Wood/wood_roughness.png" class="img-responsive inline-block" alt="Responsive image" />
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