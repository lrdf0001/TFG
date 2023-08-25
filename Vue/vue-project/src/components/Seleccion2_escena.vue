<script >
import * as THREE from 'three';


export default {
    name: 'Seleccion',
    methods: {

    main: function(){
    
    //========================= Escenas ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xd0d3d4);
    
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
            //return `hsl(${rand(360) | 0}, ${rand(25, 100) | 0}%, 50%)`;
            var r = (Math.random() * 6) / 10.0 ;
            var g = (Math.random() * 6) / 10.0 ;
            var b = (Math.random() * 6) / 10.0 ;
            return new THREE.Color(r,g,b);
        }

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;

        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const numObjects = 100;

        for (let i = 0; i < numObjects; i++) {
            const material = new THREE.MeshPhongMaterial({ color: randomColor()});
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
            cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
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

    //========================= Eventos ============================
        
    //------------------------- Puntero ----------------------------
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();    // Guardar la posicion del puntero al clicar
        var x_pos, y_pos;					    // Guardar la posicion del puntero al moverlo
        var seleccionado = null;
        var colorSeleccionado;
        var seconds = 0;

        function quitarSeleccionado(){
            if(seleccionado){ 
                seleccionado.material.emissive.setHex(colorSeleccionado);
                seleccionado = undefined;
                colorSeleccionado = undefined;
            }
        }

        function getCanvasRelativePosition(event) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * canvas.width  / rect.width,
                y: (event.clientY - rect.top ) * canvas.height / rect.height,
            };
        }

        function onPointerClick( event ) {
            const pos = getCanvasRelativePosition(event);
            pointer.x = (pos.x / canvas.width ) *  2 - 1;
            pointer.y = (pos.y / canvas.height) * -2 + 1;
            
            raycaster.setFromCamera( pointer, camera ); // Se lanza un rayo en la posicion del puntero
            
            const intersects = raycaster.intersectObjects( scene.children ); // Obtenemos los objetos impactados

            quitarSeleccionado();

            if(0 < intersects.length && intersects[0].object.isMesh){
                seleccionado = intersects[0].object;
                colorSeleccionado = seleccionado.material.emissive.getHex();
                seleccionado.material.emissive.setHex((seconds * 5) % 2 > 1 ? 0x00FFFF : 0xFF0000);
            }
        }

        function onMouseMove(event){
            const pos = getCanvasRelativePosition(event);
            x_pos = (pos.x / canvas.width ) *  2 - 1;
            y_pos = (pos.y / canvas.height) * -2 + 1;
        }

        function rotarSeleccionado(){
            if(seleccionado)
            {
                seleccionado.lookAt(x_pos*10, y_pos*10, camera.position.z);
                seleccionado.material.emissive.setHex((seconds * 5) % 2 > 1 ? 0x00FFFF : 0xFF0000);
            }
        }

        canvas.addEventListener("mousedown", onPointerClick);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseleave", quitarSeleccionado);

    //========================= Visualiza =========================

        function render(time) {
            seconds = time * 0.001; // convert to seconds;
        
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
                
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
    
    <h3>Selección de objetos</h3>
    <h4>Intersección de rayos</h4>
    <p>
        <ol>
            <li>Seleccionar un punto de la ventana.</li>
            <li>Lanzar un rayo desde el punto de visión pasando por el punto seleccionado.</li>
            <li>Intersectar el rayo con todos los objetos de la escena.</li>
            <li>seleccionar el primer objeto intersectado por el rayo</li>
        </ol>
        <img class="center" src="../assets/img/Teoria/raycast.png" alt="Ray Cast" width="25%" height="auto">
    </p>
    <h4>Selección por color</h4>
    <p>
        <ol>
            <li>Primero, se crea una estructura de datos que almacene cada objeto con un color asociado. Cada uno tiene
                que tener un color distinto al resto, único.</li> 
            <li>Se renderiza la escena y con el puntero se selecciona un punto de la venta.</li>            
            <li>Luego se redibujan los objetos aplicando su color asociado sin aplicar sombreados ni materiales, es decir 
                se desactivan las luces para no alterar el color de los objetos. De esta manera se puede procesar el color del 
                pixel seleccionado.</li>
            <li>Por último, se busca en el buffer el objeto asociado a ese color, y se renderiza la escena con
            iluminación, texturas... etc.</li>
        </ol>
        <img class="center" src="../assets/img/Teoria/gpu_picking.png" alt="GPU Picking" width="25%" height="auto">
    </p>
    
</template>


<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>