import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function main(){

//========================= Escenas ============================
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1b2631);

//========================== Ejes =============================

//-------------------------- Eje X ----------------------------
	const ejeXvertices = [];
	ejeXvertices.push( new THREE.Vector3( 0, 0, 0 ) );
	ejeXvertices.push( new THREE.Vector3( 3, 0, 0 ) );
	const colorEjeX = new THREE.LineBasicMaterial( { color:  0x943126 } );

	const geometriaX = new THREE.BufferGeometry().setFromPoints( ejeXvertices );
	const ejeX = new THREE.Line( geometriaX, colorEjeX );

	scene.add(ejeX);

//-------------------------- Eje Y ----------------------------
	const ejeYvertices = [];
	ejeYvertices.push( new THREE.Vector3( 0, 0, 0 ) );
	ejeYvertices.push( new THREE.Vector3(  0, 3, 0 ) );
	const colorEjeY = new THREE.LineBasicMaterial( { color:   0x2ecc71  } );

	const geometriaY = new THREE.BufferGeometry().setFromPoints( ejeYvertices );
	const ejeY = new THREE.Line( geometriaY, colorEjeY );

	scene.add(ejeY);

//-------------------------- Eje Z ----------------------------
	const ejeZvertices = [];
	ejeZvertices.push( new THREE.Vector3( 0, 0, 0 ) );
	ejeZvertices.push( new THREE.Vector3(  0, 0, 3 ) );
	const colorEjeZ = new THREE.LineBasicMaterial( { color:   0x3498db  } );
	
	const geometriaZ = new THREE.BufferGeometry().setFromPoints( ejeZvertices );
	const ejeZ = new THREE.Line( geometriaZ, colorEjeZ );

	scene.add(ejeZ);

//========================= Luces =============================
	const color = 0xFFFFFF;
	const intensity = 1;

	const ambientLight = new THREE.AmbientLight(color, intensity);    
	scene.add(ambientLight);

	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(5, 5, 5);
    light.target.position.set(-5, 0, -5);

    light.castShadow = true;

    scene.add(light.target);
	scene.add(light);

//========================= Camara =============================
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
	camera.lookAt(0,0,0);
	scene.add(camera);

//========================== Modelos ==============================

//-------------------------- Materiales ----------------------------
    const loader = new THREE.TextureLoader();

    const textura1 = loader.load('../img/bricks/P4_BaseColor.png');
    const bump1 = loader.load('../img/bricks/P4_Ao.png');
    var material1 = new THREE.MeshStandardMaterial({
        map: textura1,
        bumpMap: bump1
    });

    const textura2 = loader.load('../img/bricks/rocks.png');
    const bump2 = loader.load('../img/bricks/rock_bump2.png');
    var material2 = new THREE.MeshStandardMaterial({
        map: textura2,
        bumpMap: bump2
    });

    var elMaterial = material1;

//-------------------------- Cubo ----------------------------
    const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    var cubo = new THREE.Mesh(cubeGeo, material1);
    cubo.castShadow = true;
    cubo.receiveShadow = true;

    scene.add(cubo);

//-------------------------- Esfera ----------------------------
    const sphereGeo = new THREE.SphereGeometry(1, 30, 30);
    var esfera = new THREE.Mesh(sphereGeo, material1);
    esfera.castShadow = true;
    esfera.receiveShadow = true;
   
//-------------------------- Tetera ----------------------------
            
    var teapot;
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    mtlLoader.load('../Models/Teapot/Teapot.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        
        objLoader.load('../Models/Teapot/Teapot.obj', (root) => {
            //scene.add(root);
            
            root.traverse(function(node){
                if(node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.map = textura1;
                    node.material.bumpMap = bump1;
                    node.geometry.computeVertexNormals();
                }
            });

            root.scale.x = 0.15;
            root.scale.y = 0.15;
            root.scale.z = 0.15;
            
        });
    });

    

//========================== Render =============================
	var canvas = document.querySelector('#mi_canvas2');
	const renderer = new THREE.WebGLRenderer({canvas: canvas});

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

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
    controls.target.set(0, 0, 0);
    controls.update();

//============================ GUI ============================
    
    const select = {model: 0, text: 1};

    const options = {
        modelos:{
            cubo:   0,
            esfera: 1
        },
        texturas:{
            ladrillos:  1,
            rocas:      2
        }
    }


    function actualizarBump(){
        if(select.text == 1){
            material1.bumpScale = elMaterial.bumpScale;
            material1.needsUpdate = true
        }else{
            material2.bumpScale = elMaterial.bumpScale;
            material2.needsUpdate = true
        }
    }
    
    function cambiarModelo(){
        if(select.model == 1){
            scene.remove(cubo);
            scene.add(esfera);
        }else if(select.model == 0){
            scene.remove(esfera);
            scene.add(cubo);
        }
    }

    function cambiarTextura(){
        if(select.text == 1){
            esfera.material = material1;
            cubo.material = material1;
        }else{
            esfera.material = material2;
            cubo.material = material2;
        }
        actualizarBump()
    }

    const gui = new GUI( { autoPlace: false } );	
    var customContainer = document.querySelector('#gui2').append(gui.domElement); 

    const textureFolder = gui.addFolder('THREE.Texture');
    textureFolder.add(elMaterial, 'bumpScale', 0.0, 1.0, 0.1 ).setValue(1.0).onChange(() => actualizarBump());
    textureFolder.add(select, 'model', options.modelos).onFinishChange(() => cambiarModelo());
    textureFolder.add(select, 'text', options.texturas).onFinishChange(() => cambiarTextura());


//========================= Visualiza =========================

	function animate() {

        //cubo.rotation.y += 0.002;
        //cubo.rotation.x += 0.002;
        
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