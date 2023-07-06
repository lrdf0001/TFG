<script >
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export default {
  name: 'Ambiental',
  data() {},
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
      scene.background = new THREE.Color(0x1a5276);
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
      const groundColor = 0xB97A20;  // brownish orange
      const  hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(hemisphereLight);
  
  
  //========================= Camara =============================
      const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20);
      camera.position.x = 5;
      camera.position.y = 5;
      camera.position.z = 5;
      camera.lookAt(0,0,0);
      scene.add(camera);
  
  //========================== Modelos ==============================
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
  
      //gui1.add(esfera.material, 'wireframe').listen();
      
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
    
    //window.addEventListener('load', main);
  },
  mounted() {
      this.main();
  }
}
</script>


<template>
    <div class="p-4 p-md-5 mb-4">
      <div id="lienzo" class="px-0 col-md-6">
        <div id="gui"></div>
        <canvas id="mi_canvas" class="rounded"></canvas>
      </div>
    </div>

    <p>Texto explicativo de luz ambiental</p>
</template>

<style>
body {
  margin: 0;
  font-family: var(--bs-body-font-family);
  font-size: var(--bs-body-font-size);
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
  color: var(--bs-body-color);
  text-align: var(--bs-body-text-align);
  background-color: var(--bs-body-bg);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * .5);
  padding-left: calc(var(--bs-gutter-x) * .5);
  margin-right: auto;
  margin-left: auto;
}

.blog-header {
  border-bottom: 1px solid #e5e5e5;
}

.lh-1 {
  line-height: 1!important;
}

.py-1 {
  padding-top: 0.25rem!important;
  padding-bottom: 0.25rem!important;
}

.py-3 {
  padding-top: 1rem!important;
  padding-bottom: 1rem!important;
}

.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-.5 * var(--bs-gutter-x));
  margin-left: calc(-.5 * var(--bs-gutter-x));
}

.flex-nowrap {
  flex-wrap: nowrap!important;
}

.justify-content-between {
  justify-content: space-between!important;
}

.align-items-center {
  align-items: center!important;
}

.text-center {
  text-align: center!important;
}

.col-4 {
  flex: 0 0 auto;
  width: 33.33333333%;
}

.blog-header-logo {
  font-family: "Playfair Display", Georgia, "Times New Roman", serif/*rtl:Amiri, Georgia, "Times New Roman", serif*/;
  font-size: 2.25rem;
}

.text-dark {
  --bs-text-opacity: 1;
  color: rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important;
}

.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.justify-content-between {
  justify-content: space-between!important;
}

.d-flex {
  display: flex!important;
}

.nav {
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;

  --bs-nav-link-padding-x: 1rem;
  --bs-nav-link-padding-y: 0.5rem;
  --bs-nav-link-font-weight: ;
  --bs-nav-link-color: var(--bs-link-color);
  --bs-nav-link-hover-color: var(--bs-link-hover-color);
  --bs-nav-link-disabled-color: var(--bs-secondary-color);

  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
}

.p-2 {
  padding: 0.5rem!important;
}

.link-secondary {
  color: #6c757d!important;
}

.mb-2 {
  margin-bottom: 0.5rem!important;
}

.p-md-5 {
  padding: 3rem!important;
}

.rounded {
  /*border: 2px solid red;*/
  border-radius: 25px;
}

.p-4 {
  padding: 1.5rem!important;
}

.mb-4 {
  margin-bottom: 1.5rem!important;
}

.px-0 {
  padding-right: 0!important;
  padding-left: 0!important;
}

/*@media (min-width: 768px)*/
.col-md-6 {
  flex: 0 0 auto;
  width: 100%;
}

*, ::after, ::before {
  box-sizing: border-box;
}

div {
  display: block;
}

header {
    display: block;
}

/*
html, body {
  margin: 0;
  height: 100%;
}
*/
#mi_canvas {
  width: 100%;
  display: block;
}

#lienzo{ 
  position: relative;
}

#gui { 
  position: absolute;
  top: 2px; left: 30px;
}
</style>
