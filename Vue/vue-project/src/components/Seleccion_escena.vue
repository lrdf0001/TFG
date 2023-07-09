<script >
import * as THREE from 'three';
import { GUI } from 'dat.gui'

export default {
    name: 'Seleccion',
    methods: {

    main: function(){

        //========================= Escena ============================
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1b2631);

        //========================== Ejes =============================

        //-------------------------- Eje X ----------------------------
            const ejeXvertices = [];
            ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
            ejeXvertices.push( new THREE.Vector3( 5, 0, 0 ) );
            const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );

            const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
            const ejeX = new THREE.Line( geometriaX, colorEjeX );

            scene.add(ejeX);

        //-------------------------- Eje Y ----------------------------
            const ejeYvertices = [];
            ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
            ejeYvertices.push( new THREE.Vector3(  0, 5, 0 ) );
            const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );

            const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
            const ejeY = new THREE.Line( geometriaY, colorEjeY );

            scene.add(ejeY);

        //-------------------------- Eje Z ----------------------------
            const ejeZvertices = [];
            ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
            ejeZvertices.push( new THREE.Vector3(  0, 0, 5 ) );
            const colorEjeZ = new THREE.LineBasicMaterial( { color:   0x3498db  } );
            
            const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices );
            const ejeZ = new THREE.Line( geometriaZ, colorEjeZ );

            scene.add(ejeZ);
            
            //---------------------- Activar/desactivar ejes ------------------------	
                var ejes = false;
                function verEjes(booleano){
                    if(booleano){
                        scene.add(ejeX);
                        scene.add(ejeY);
                        scene.add(ejeZ);
                        ejes = false;
                    }else{
                        scene.remove(ejeX);
                        scene.remove(ejeY);
                        scene.remove(ejeZ);
                        ejes = true;
                    }
                }

        //========================= Luces =============================
            const color = 0xFFFFFF
            const intensity = 1
            const ambientLight = new THREE.AmbientLight(color, intensity)
            const directional = new THREE.DirectionalLight(color, intensity)
            directional.position.set(-3, 10, 3)
            directional.target.position.set(5, 0, -5);
            scene.add(ambientLight)
            scene.add(directional)
            scene.add(directional.target);


        //========================= Camara =============================
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20 )
            camera.position.x = 5
            camera.position.y = 5
            camera.position.z = 5
            camera.lookAt(0,0,0)
            scene.add(camera)


        //========================== Modelo =============================

            //---------------------- CajaZapatos ----------------------
            class CajaZapatos{
                constructor(caja, tapa) {
                    this.caja = caja;
                    this.tapa = tapa;
                    this.tapa.translateY(0.5);
                }
                
                trasladarX(x){
                    this.caja.translateX(x);
                    this.tapa.translateX(x);
                }
                
                trasladarY(y){
                    this.caja.translateY(y);
                    this.tapa.translateY(y);
                }
                
                trasladarZ(z){
                    this.caja.translateZ(z);
                    this.tapa.translateZ(z);
                }
                
                rotarY(y){
                    this.caja.rotateY(y);
                    this.tapa.rotateY(y);
                }
                
                getcaja(){ return this.caja;}
                gettapa(){ return this.tapa;}
                setColor(r, g, b){
                    this.caja.material.color.setRGB(r,g,b);
                    this.tapa.material.color.setRGB(r,g,b);
                }
            }
            
            //Variables para trasladar las cajas en los 3 ejes
            const dx = 2.5; 
            const dy = 1.125;
            const dz = 2.3;
            
            //---------------------- Estructura Datos ----------------------
            const mapcajas = new Map();
            for(let k=0; k<3; k++){
                for(let j=0; j<3; j++){
                    for (let i=0; i<3; i++){
                        
                        //Geometria y material
                        const geometriaCaja = new THREE.BoxGeometry( 1, 1, 2 );
                        const materialCaja = new THREE.MeshToonMaterial();
                        materialCaja.gradientMap

                        const materialTapa = new THREE.MeshToonMaterial();
                        const geometriaTapa = new THREE.BoxGeometry( 1.15, 0.25, 2.15 );
                        
                        //Caja y Tapa
                        const unacaja = new THREE.Mesh( geometriaCaja, materialCaja);
                        const unatapa = new THREE.Mesh( geometriaTapa, materialTapa );
                        unacaja.material.color.setRGB( ((i+1)/10), ((j+1)/10), ((k+1)/10) );// Asignamos colores según la numeracion
                        unatapa.material.color.setRGB( ((i+1)/10), ((j+1)/10), ((k+1)/10) );
                        
                        //Objeto completo
                        var clave = (i+1)*100 + (j+1)*10 + (k+1); //Usamos el color como clave
                        const cajazapatos = new CajaZapatos(unacaja, unatapa);
                        
                        //Disposicion en la escena
                        cajazapatos.trasladarX(dx*i);
                        cajazapatos.trasladarY(dy*j);
                        cajazapatos.trasladarZ(-dz*k);				
                        
                        mapcajas.set(clave, cajazapatos);//Lo guardamos en la eedd
                    }
                }
            }
            
            //---------------------- Puesta en escena ----------------------
            
            // Para saber el número de pilas de cajas en cada dimension
            var numCajas = {x: 1, y: 1, z: 1};
            
            // Vincula las cajas creadas con la escena
            function vercajas(){
                //console.log("Creando Cajas:");
                for(let k=0; k<numCajas.z; k++){
                    for(let j=0; j<numCajas.y; j++){
                        for (let i=0; i<numCajas.x; i++){	
                            clave = (i+1)*100 + (j+1)*10 + (k+1);
                            scene.add( mapcajas.get(clave).getcaja() );
                            scene.add( mapcajas.get(clave).gettapa() );
                            //console.log(clave);
                        }
                    }
                }
            }
            
            // Limpia la escena, quita las todas las cajas
            function clearCajas(){		
                for(let k=0; k<3; k++){
                    for(let j=0; j<3; j++){
                        for (let i=0; i<3; i++){	
                            clave = (i+1)*100 + (j+1)*10 + (k+1);
                            if(mapcajas.has(clave)){
                                scene.remove( mapcajas.get(clave).getcaja() );
                                scene.remove( mapcajas.get(clave).gettapa() );
                            }
                        }
                    }
                }
            }
            
            // Rotar la caja seleccionada
            function rotarSeleccionado(seleccionado, dY){
                if(mapcajas.has(seleccionado)){
                    mapcajas.get(seleccionado).rotarY(dY);
                }
            }

            function refrescar(){
                clearCajas();
                vercajas();
            }

        //========================== Render =============================
            const canvas = document.querySelector('#mi_canvas');
            const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

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
            const pointer = new THREE.Vector2();
            var seleccionado = null;
            var I, J, K;
            
            
            var x_prev = 0.0, y_prev = 0.0;		// Guardar la posicion del puntero al clicar
            var x_pos, y_pos;					// Guardar la posicion del puntero al soltar
            var dX = 0.0, dY = 0.0;				// Incrementos en los ejes X y Z
            
            // Actualiza la posicion del raton y calcula los incrementos de desplazamientos
            function onMouseMove( event ) {
                if (seleccionado) {	
                    const pos = getCanvasRelativePosition(event);
                    x_pos = (pos.x / canvas.width ) *  2 - 1;
                    y_pos = (pos.y / canvas.height) * -2 + 1;
                    
                    dX = x_pos - x_prev;
                    dY = y_pos - y_prev;
                    
                    x_prev = x_pos, y_prev = y_pos;
                    //console.log(x_pos , y_pos);
                }
            }
            
            // Quitar la seleccion de una caja (cambiar de rojo a su color original)
            function quitarSeleccion(_seleccionado){
                
                const anterior = _seleccionado;
                K = _seleccionado % 10; _seleccionado -= K; K -= 1;
                J = _seleccionado % 100; _seleccionado -= J; J = J/10 - 1;
                I = _seleccionado % 1000 / 100 - 1; 

                if(mapcajas.has(anterior)){
                    mapcajas.get(anterior).setColor( ((I+1)/10), ((J+1)/10), ((K+1)/10));
                }
            }
            
            // Evento cuando se clica en pantalla
            function onPointerClick( event ) {
                // calculate pointer position in normalized device coordinates
                // (-1 to +1) for both components
                const pos = getCanvasRelativePosition(event);
                pointer.x = (pos.x / canvas.width ) *  2 - 1;
                pointer.y = (pos.y / canvas.height) * -2 + 1;
                
                raycaster.setFromCamera( pointer, camera ); // Se lanza un rayo en la posicion del puntero
                
                const intersects = raycaster.intersectObjects( scene.children ); // Obtenemos los objetos ipactados		
                
                if(seleccionado) quitarSeleccion(seleccionado); // Si previamente hay un objeto seleccionado, se le quita la selccion
                
                if(0 < intersects.length){
                    
                    //Calculamos la clave para el primer impactado por el rayo
                    I = intersects[ 0 ].object.material.color.r * 10 - 1;
                    J = intersects[ 0 ].object.material.color.g * 10 - 1;
                    K = intersects[ 0 ].object.material.color.b * 10 - 1;
                    seleccionado = (I+1)*100 + (J+1)*10 + (K+1);
                    
                    clearCajas(); //Limpiamos la escena, porque hay que cambiar el color a la caja seleccionada
                    
                    if(mapcajas.has(seleccionado)){ 
                        mapcajas.get(seleccionado).setColor( 0.9, 0.1, 0.1); // Actualizamos color
                    }
                    
                    vercajas();	// Añadimos cajas a la escena
                    //console.log(I, J, K);			
                }
                else{			
                    seleccionado = null;
                    x_prev = 0.0, y_prev = 0.0;
                    /*
                    clearCajas();
                    vercajas();
                    */
                }
            }

            function getCanvasRelativePosition(event) {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: (event.clientX - rect.left) * canvas.width  / rect.width,
                    y: (event.clientY - rect.top ) * canvas.height / rect.height,
                };
            }

            function clearPickPosition() {
                pickPosition.x = -100000;
                pickPosition.y = -100000;
            }
            
            window.addEventListener("mousedown", onPointerClick);
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener('mouseleave', clearPickPosition);
            

        //============================ GUI ============================

            const gui3c = new GUI( { autoPlace: false } );	
            var customContainer = document.querySelector('#gui').append(gui3c.domElement);

            const pilasCajas = gui3c.addFolder('Pila de cajas');
            pilasCajas.add(numCajas, 'x', 1, 3, 1).onChange((value) => refrescar());
            pilasCajas.add(numCajas, 'y', 1, 3, 1).onChange((value) => refrescar());
            pilasCajas.add(numCajas, 'z', 1, 3, 1).onChange((value) => refrescar());
            

        //========================= Visualiza =========================
            
            //vercajas();
            function animate() {
                requestAnimationFrame( animate )
            
                vercajas();
                
                if(seleccionado) rotarSeleccionado(seleccionado, dX);
                
                if (resizeRendererToDisplaySize(renderer)) {
                    const canvas = renderer.domElement;
                    camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    camera.updateProjectionMatrix();
                }

                renderer.render( scene, camera );
            };

        animate();

        }
  },
  mounted() {
      this.main();
  }
}
</script>


<template>
    <p>Texto explicativo de la seleccion</p>
</template>
