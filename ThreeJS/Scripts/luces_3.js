function main(){

    //========================= Escenas ============================
        const scene = new THREE.Scene();
        var canvas = document.querySelector('#mi_canvas3');
    
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
        const light = new THREE.PointLight(color, intensity);
        light.position.set(0, 2.75, 0);
        scene.add(light);
        scene.add(light.target);

    //-------------------------- Bombilla ----------------------------     
        const bombillaGeometria = new THREE.SphereBufferGeometry(0.05, 6, 6);
		const bombillaMaterial = new THREE.MeshToonMaterial( { color: 0xFFFF00});
		bombilla = new THREE.Mesh(bombillaGeometria, bombillaMaterial);
        light.add(bombilla);
    
    
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

        const helper = new THREE.PointLightHelper(light, 0.01);
        scene.add(helper);
    
        const gui1 = new dat.GUI( { autoPlace: false } );
        var customContainer = document.querySelector('#gui3').append(gui1.domElement);
    
        gui1.add(esfera.material, 'wireframe').listen();
        
        const puntualGUI = gui1.addFolder('Puntal');
        puntualGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        puntualGUI.add(light, 'intensity', 0, 2, 0.01);
        puntualGUI.add(light, 'distance', 0, 40).onChange( helper.update());
        puntualGUI.add(light.position, 'x', -10, 10);
        puntualGUI.add(light.position, 'z', -10, 10);
        puntualGUI.add(light.position, 'y', 0, 10);        
    
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