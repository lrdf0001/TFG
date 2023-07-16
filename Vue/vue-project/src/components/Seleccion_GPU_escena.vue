<script >
import * as THREE from 'three';


export default {
    name: 'Seleccion',
    methods: {

    main: function(){

    //========================= Escenas ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xd0d3d4);
        const pickingScene = new THREE.Scene();
        pickingScene.background = new THREE.Color(0);

    //========================== Ejes =============================

    //-------------------------- Eje X ----------------------------
        const ejeXvertices = [];
        ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
        ejeXvertices.push( new THREE.Vector3( 30, 0, 0 ) );
        const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );

        const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
        const ejeX = new THREE.Line( geometriaX, colorEjeX );

        scene.add(ejeX);

    //-------------------------- Eje Y ----------------------------
        const ejeYvertices = [];
        ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
        ejeYvertices.push( new THREE.Vector3(  0, 30, 0 ) );
        const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );

        const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
        const ejeY = new THREE.Line( geometriaY, colorEjeY );

        scene.add(ejeY);

    //========================= Luces =============================
        const color = 0xFFFFFF;
        const intensity = 1;
        
        const ambientLight = new THREE.AmbientLight(color, intensity);

        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 20, 30);
        light.target.position.set(0, 0, 0);

        scene.add(ambientLight);
        scene.add(light);
        scene.add(light.target);

    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 200);
        //camera.position.x = 3;
        //camera.position.y = 3;
        camera.position.z = 30;
        camera.lookAt(0,0,0);
        scene.add(camera);

    //========================== Cubos ==============================
        function rand(min, max) {
            if (max === undefined) {
            max = min;
            min = 0;
            }
            return min + (max - min) * Math.random();
        }

        function randomColor() {
            return `hsl(${rand(360) | 0}, ${rand(25, 100) | 0}%, 50%)`;
        }

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const idToObject = {};
        const numObjects = 100;
        
        for (let i = 0; i < numObjects; ++i) {
            const id = i + 1;
            const material = new THREE.MeshPhongMaterial({
                color: randomColor()
            });

            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            idToObject[id] = cube;

            cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
            //cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
            cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));

            const pickingMaterial = new THREE.MeshPhongMaterial({
                emissive: new THREE.Color(id),
                color: new THREE.Color(0, 0, 0)
            });

            const pickingCube = new THREE.Mesh(geometry, pickingMaterial);
            pickingScene.add(pickingCube);
            pickingCube.position.copy(cube.position);
            pickingCube.rotation.copy(cube.rotation);
            pickingCube.scale.copy(cube.scale);
        }

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

    //============================ Eventos ============================
        const pickPosition = {x: 0, y: 0};  // Posicion del puntero al clicar
        var x_pos, y_pos;					// Guardar la posicion del puntero al moverlo

        function getCanvasRelativePosition(event) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * canvas.width  / rect.width,
                y: (event.clientY - rect.top ) * canvas.height / rect.height,
            };
        }

        function setPickPosition(event) {
            const pos = getCanvasRelativePosition(event);
            pickPosition.x = pos.x;
            pickPosition.y = pos.y;
            console.log(pickPosition);
        }

        function clearPickPosition() {
            pickPosition.x = -100000;
            pickPosition.y = -100000;
        }

        function onMouseMove(event){
            const pos = getCanvasRelativePosition(event);
            x_pos = (pos.x / canvas.width ) *  2 - 1;
            y_pos = (pos.y / canvas.height) * -2 + 1;
        }

        function rotarSeleccionado(){
            if(pickHelper.pickedObject)
            {
                pickHelper.pickedObject.lookAt(x_pos*10, y_pos*10, camera.position.z);
            }
        }

        window.addEventListener('mousedown', setPickPosition);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseout', clearPickPosition);
        window.addEventListener('mouseleave', clearPickPosition);

    //============================ Picker ============================
        class GPUPickHelper {
            constructor() {
            // Creamos un Render Tarjet de dimension 1x1 pixel
            this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
            this.pixelBuffer = new Uint8Array(4); // Almacena info del pixel leido
            this.pickedObject = null;             // Objeto seleccionado
            this.pickedObjectSavedColor = 0;      // Color original de este
            }

            pick(cssPosition, scene, camera, time) {
                const {pickingTexture, pixelBuffer} = this;
            
                // Si previamente hay un objeto selecionado, restauramos su color
                if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
                }
            
                // Establecemos una region (view offset) de solo un pixel en la posicion del puntero
                const pixelRatio = renderer.getPixelRatio();
                camera.setViewOffset(
                    renderer.getContext().drawingBufferWidth,   // full width
                    renderer.getContext().drawingBufferHeight,  // full top
                    cssPosition.x * pixelRatio | 0,             // rect x
                    cssPosition.y * pixelRatio | 0,             // rect y
                    1,                                          // rect width
                    1,                                          // rect height
                );

                // Renderizamos la escena
                renderer.setRenderTarget(pickingTexture)
                renderer.render(scene, camera);
                renderer.setRenderTarget(null);
            
                // El view offset vuelve a la normalidad
                camera.clearViewOffset();

                // Leemos el pixel
                renderer.readRenderTargetPixels(
                    pickingTexture,
                    0,   // x
                    0,   // y
                    1,   // width
                    1,   // height
                    pixelBuffer);
                
                // Transformamos el color a un id
                const id =
                    (pixelBuffer[0] << 16) |
                    (pixelBuffer[1] <<  8) |
                    (pixelBuffer[2]      );

                // Buscamos en el array el objeto
                const intersectedObject = idToObject[id];

                // Si hay un objeto al color asociado:
                if (intersectedObject) {
                    // Se establece como selecionado
                    this.pickedObject = intersectedObject;
                    
                    // Guardamos su color
                    this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                    
                    // Hacemos que el color se alterne entre rojo y amarillo para resaltarlo
                    this.pickedObject.material.emissive.setHex((time * 5) % 2 > 1 ? 0x00FFFF : 0xFF0000);
                }
            }
        }

        const pickHelper = new GPUPickHelper();


    //========================= Visualiza =========================

        function render(time) {
            time *= 0.001;  // convert to seconds;
        
            if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            }
        
            pickHelper.pick(pickPosition, pickingScene, camera, time);
                
            rotarSeleccionado();

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

    }
},
    mounted() {
      this.main();
}   
}
</script>


<template>
    
    <h3>Seleccion por color</h3>
    
</template>
