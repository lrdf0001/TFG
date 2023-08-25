<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default {
name: 'Luis',
methods: {
	main:function(){

    const canvas = document.querySelector('#mi_canvas2');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x3498db );
    
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    /* ========================= Camera ============================ */
        const fov = 45;
        const aspect = 2; 
        const near = 0.1;
        const far = 100;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 3;
    

    /* ========================= Luz ============================ */
        const color = 0xFFFFFF;
        const intensity = 0.75;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    

    /* ========================= Shader ============================ */
        const fragmentShader = `
        #include <common>
    
        uniform vec3 iResolution;
        uniform float iTime;
        uniform sampler2D iChannel0;
    
        // By iq: https://www.shadertoy.com/user/iq  
        // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 q = fragCoord.xy / iResolution.xy;
            vec2 uv = 0.5 + (q-0.5)*(0.9 + 0.1);

            vec3 col;

            col.r = texture(iChannel0, q).x; // vec2(uv.x+0.003,-uv.y)
            col.g = texture(iChannel0, q).y; // vec2(uv.x+0.000,-uv.y)
            col.b = texture(iChannel0, q).z; // vec2(uv.x-0.003,-uv.y)

            col = clamp(col*0.5+0.5*col*col*1.2,0.0,1.0);

            col *= 0.5 + 0.5*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);

            col *= vec3(0.95,1.05,0.95);

            col *= 0.9+0.1*sin(10.0*iTime+uv.y*1000.0);

            col *= 0.99+0.01*sin(110.0*iTime);

            fragColor = vec4(col,1.0);
        }
    
        void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
        }
        `;

        //const loader = new THREE.TextureLoader();
        //const texture = loader.load('../img/eva01.png');
        //texture.minFilter = THREE.NearestFilter;
        //texture.magFilter = THREE.NearestFilter;
        //texture.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;

    /* ----------------------------- Video ----------------------------- */
        const video = document.getElementById( 'video01' ); // '../video/Rammstein-FeuerFrei.mp4'
        video.play();
        video.muted = true;
        const texture = new THREE.VideoTexture( video );
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.repeat.x=2;
        texture.repeat.y=2;

        const uniforms = {
            iTime: { value: 0 },
            iResolution:  { value: new THREE.Vector3() },
            iChannel0: { value: texture },
        };

        const material = new THREE.ShaderMaterial({
            fragmentShader,
            uniforms,
        });


    //========================= Objetos =============================

    //------------------------- Marco TV ----------------------------
        const cubeGeo = new THREE.BoxGeometry(3, 1, 0.15);
        const cubeMat = new THREE.MeshStandardMaterial({
            color: 0xbcbcbc,
            emissive: 0x000000,
            roughness: 0.6,
            metalness: 1.0
        });
        const cube1 = new THREE.Mesh(cubeGeo, cubeMat);
        scene.add(cube1);
        cube1.translateY(-1.35);

        const cube2 = new THREE.Mesh(cubeGeo, cubeMat);
        scene.add(cube2);
        cube2.translateY(1.35);
        
        const cube3 = new THREE.Mesh(cubeGeo, cubeMat);
        scene.add(cube3);
        cube3.rotateZ(90*3.1415/180);
        cube3.translateY(-1.5);

        const cube4 = new THREE.Mesh(cubeGeo, cubeMat);
        scene.add(cube4);
        cube4.rotateZ(90*3.1415/180);
        cube4.translateY(1.5);
        

    //------------------------- Pantalla ----------------------------   
        const planeGeo = new THREE.PlaneGeometry(2, 1.75);
        const plane = new THREE.Mesh(planeGeo, material);
        scene.add(plane);
    

    //========================= Controls =============================
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();
   
    //========================= Rennder =============================

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

        function render(time) {
            time *= 0.001;

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            //const canvas = renderer.domElement;
            uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
            uniforms.iTime.value = time;
        
            renderer.render(scene, camera);
        
            requestAnimationFrame(render);
        }
   
        requestAnimationFrame(render);
	}
	
},
	mounted() { this.main(); }
}
</script>

<template>

    <div class="container">
        <div class="square">
            <div class="content">
                <canvas id="mi_canvas2" class="rounded"></canvas>
            </div>
        </div>
    </div>


    <video id="video01" loop crossOrigin="anonymous" playsinline style="display:none">
        <source src="../assets/video/Rammstein-FeuerFrei.mp4"
			  type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
    </video>
</template>

<style scoped>

#mi_canvas2 {
  width: 100%;
  height: 100%;
  display: block;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: auto;
  padding-bottom: auto;
}

.square {
  position: relative;
  width: 90vmin;
  /*border: solid red 5px;*/
  box-sizing: border-box;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>