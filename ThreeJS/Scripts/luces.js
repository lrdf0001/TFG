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

function main(){

    //========================= Escenas ============================
        const scene = new THREE.Scene();
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

        //const pointLight = new THREE.PointLight(color, intensity);
        //pointLight.position.set(0, 2.75, 0);
        //scene.add(pointLight);

        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const  hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(hemisphereLight);

    //-------------------------- Bombilla ---------------------------- 
    /*
        const bombillaGeometria = new THREE.SphereBufferGeometry(0.05, 6, 6);
		const bombillaMaterial = new THREE.MeshToonMaterial( { color: 0xFFFF00});
		bombilla = new THREE.Mesh(bombillaGeometria, bombillaMaterial);
        bombilla.position.set(0, 2.75, 0);
        scene.add(bombilla);
    */
    
    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20);
        camera.position.x = 3;
        camera.position.y = 3;
        camera.position.z = 3;
        camera.lookAt(0,0,0);
        scene.add(camera);        
    
    //========================== Modelos ==============================

        const planeGeometry = new THREE.PlaneGeometry( 20, 20 );
        var planeMat = new THREE.MeshToonMaterial( { color: 0x202020 } );
        const plano = new THREE.Mesh( planeGeometry, planeMat );
        plano.rotateX(-90*3.1415/180.0);
        plano.position.set(0,-0.1,0);

        scene.add( plano );
        
        /*
        const geometriaCaja = new THREE.BoxGeometry( 1, 1, 1 );
        var matCaja = new THREE.MeshToonMaterial( { color: 0x7b7d7d  } );
        const cubo = new THREE.Mesh( geometriaCaja, matCaja );
        cubo.position.set(0,0.5,0);

        scene.add( cubo );
        */

        const esferaGeometria = new THREE.SphereBufferGeometry(1, 10, 10);
		const esferaMaterial = new THREE.MeshToonMaterial( { color: 0x7b7d7d});
		esfera = new THREE.Mesh(esferaGeometria, esferaMaterial);
        esfera.position.set(0,0.5,0);
        scene.add(esfera);
    
    //========================== Render =============================
        
        const renderer = new THREE.WebGLRenderer({canvas: canvas});
        //renderer.setSize( window.innerWidth, window.innerHeight );
    
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
    
    //============================ GUI ============================
    
        const gui1 = new dat.GUI( { autoPlace: false } );
        var customContainer = document.querySelector('#gui').append(gui1.domElement);
    
        gui1.add(esfera.material, 'wireframe').listen();
        
        const ambientalGUI = gui1.addFolder('Ambiental');
        ambientalGUI.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('color');
        ambientalGUI.add(ambientLight, 'intensity', 0, 2, 0.01);

        const hemisphereGUI = gui1.addFolder('Hemisferio');
        hemisphereGUI.addColor(new ColorGUIHelper(hemisphereLight, 'color'), 'value').name('skyColor');
        hemisphereGUI.addColor(new ColorGUIHelper(hemisphereLight, 'groundColor'), 'value').name('groundColor');
        hemisphereGUI.add(hemisphereLight, 'intensity', 0, 2, 0.01);
    
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
    
    window.addEventListener('load', main);