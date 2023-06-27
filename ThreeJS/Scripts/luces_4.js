class DegRadHelper {
    constructor(obj, prop) {
        this.obj = obj;
        this.prop = prop;
    }
    get value() {
        return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
        this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
}

function main(){

    //========================= Escenas ============================
        const scene = new THREE.Scene();
        var canvas = document.querySelector('#mi_canvas4');
    
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
        
        
        var ambientLight = new THREE.AmbientLight(0xfafafa , 0.5);        
        scene.add(ambientLight);

        const skyColor = 0x7986cb;  
        const groundColor = 0xe8f5e9;  
        const  hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, 0.75);
        scene.add(hemisphereLight);
        

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.SpotLight(color, intensity);
        light.position.set(0, 2.75, 0);
        scene.add(light);
        scene.add(light.target);
    
    
    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20);
        camera.position.x = 6;
        camera.position.y = 6;
        camera.position.z = 6;
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
        const esferaGeometria = new THREE.SphereBufferGeometry(1, 10, 10);
		const esferaMaterial = new THREE.MeshToonMaterial( { color: 0x7b7d7d});
		esfera = new THREE.Mesh(esferaGeometria, esferaMaterial);
        esfera.position.set(0,0.5,0);
        scene.add(esfera);
        */
       
        // Flying saucer by Poly by Google [CC-BY] via Poly Pizza
        const mtlLoader = new THREE.MTLLoader();
        const objLoader = new THREE.OBJLoader();

        mtlLoader.load('../Models/UFO/ufo.mtl', (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            
            objLoader.load('../Models/UFO/ufo.obj', (root) => {
                light.add(root);
              });

        });
        /*
        const fbxLoader = new THREE.FBXLoader();
        fbxLoader.load('../Models/Cow/cow.fbx', (cow) => {
            scene.add(cow);
            cow.scale.set(0.005,0.005,0.005);
          });
          */
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

        const helper = new THREE.SpotLightHelper(light);
        scene.add(helper);

        function updateLight() {
            light.target.updateMatrixWorld();
            helper.update();
        }
    
        const gui1 = new dat.GUI( { autoPlace: false } );
        var customContainer = document.querySelector('#gui4').append(gui1.domElement);
        
        const focalGUI = gui1.addFolder('Focal');
        focalGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
        focalGUI.add(light, 'intensity', 0, 2, 0.01);
        focalGUI.add(light, 'distance', 0, 40).onChange( helper.update());
        focalGUI.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
        focalGUI.add(light, 'penumbra', 0, 1, 0.01).setValue(0.1);
        focalGUI.add(light.position, 'x', -10, 10).onChange(updateLight);
        focalGUI.add(light.position, 'z', -10, 10).onChange(updateLight);
        focalGUI.add(light.position, 'y', 0, 10).onChange(updateLight);        
    
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