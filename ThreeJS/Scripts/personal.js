import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#c');
    
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const fov = 45;
    const aspect = 2; 
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d123f );

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    
    const planeGeo = new THREE.PlaneGeometry(1.75, 1.75);
    

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

    const plane = new THREE.Mesh(planeGeo, material);
    scene.add(plane);


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
   
  window.addEventListener('load', main);