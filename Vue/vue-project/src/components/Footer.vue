<script>
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export default {
name: 'Footer',
//data() {},
methods: {
	main:function(){

	//========================= Escena ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        var canvas = document.querySelector('#mi_canvas2');
        var footer = document.querySelector('#mi_footer');
    
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
        const camera = new THREE.PerspectiveCamera( 45, footer.clientWidth / footer.clientWidth, 0.1, 25);
        camera.position.x = 7;
        camera.position.y = 3;
        camera.position.z = 7;
        camera.lookAt(0,0,0);
        scene.add(camera);

		scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );
        
    
    //========================== Modelos ==============================
        const gltfLoader = new GLTFLoader();
        const url = './src/assets/Models/SwordFish_II/swordfish_ii.glb';
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
        renderer.setSize(footer.clientWidth, footer.clientWidth);
    
        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = footer.clientWidth;
            const height = footer.clientHeight;
            const needResize = footer.width !== width || footer.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }   
    
    //========================= Visualiza =========================
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame( animate );
    
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = footer.clientWidth / footer.clientHeight;
                camera.updateProjectionMatrix();
            }
    
            renderer.render( scene, camera );
        };    
    
        animate()
	}
	
},
	mounted() { this.main(); }
}
</script>


<template>
	<footer >
        <div  class="card text-bg-dark">
            <canvas id="mi_canvas2"  class="card-img"> </canvas>
            <div id="mi_footer" class="card-img-overlay">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <p class="card-text"><small>Last updated 3 mins ago</small></p>
            </div>
        </div>
    </footer>
</template>