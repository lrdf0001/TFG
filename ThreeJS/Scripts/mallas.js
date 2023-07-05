import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui'

function main(){

    //========================= Escena ============================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xaed6f1 );
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

        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 5, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);        
        scene.add(light.target);

    //========================= Camara =============================
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20);
        camera.position.x = 5;
        camera.position.y = 5;
        camera.position.z = 5;
        camera.lookAt(0,0,0);
        scene.add(camera);
    
    //========================== Modelos ==============================
    const pivot = new THREE.Object3D();
    scene.add(pivot);

    const twoPi = Math.PI * 2;

    const data = {
        radius: 2,
        widthSegments: 32,
        heightSegments: 16,
        phiStart: 0,
        phiLength: twoPi,
        thetaStart: 0,
        thetaLength: Math.PI
    };

    var esfera;

    function generateSphere() 
    {
        pivot.remove(esfera);
        
        var esferaGeo = new THREE.SphereGeometry(data.radius, data.widthSegments, data.heightSegments, 
        data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
        
        var esferaMat = new THREE. MeshNormalMaterial();
        esferaMat.side = THREE.DoubleSide;
        
        esfera = new THREE.Mesh( esferaGeo, esferaMat );
        
        var geo = new THREE.WireframeGeometry( esfera.geometry ); // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff } );
        var wireframe = new THREE.LineSegments( geo, mat );
        esfera.add( wireframe );
        
        pivot.add(esfera);
    }
    generateSphere();

    //========================== Render =============================
        
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

//========================= Controls =============================
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();

//============================ GUI ============================

    function degToRad(deg){
        return 3.1415 * deg / 180.0;
    }

    const angulos = {phi: 0, theta: 0}

    function updatePhi(){
        data.phiLength = degToRad(angulos.phi);
        generateSphere();
    }

    function updateThetha(){
        data.thetaLength = degToRad(angulos.theta/2.0);
        generateSphere();
    }

    const gui = new GUI( { autoPlace: false } );
    var customContainer = document.querySelector('#gui').append(gui.domElement);
    
    const folder = gui.addFolder( 'Geometria Esfera' );
    folder.add( data, 'radius', 1, 3 ).setValue(2).onChange( generateSphere ).name("Radio");
    folder.add( data, 'widthSegments', 3, 64 ).step( 1 ).onChange( generateSphere ).name("Meridianos");
    folder.add( data, 'heightSegments', 2, 32 ).step( 1 ).onChange( generateSphere ).name("Paralelos");
    folder.add( angulos, 'phi', 0, 360, 5 ).onChange( updatePhi ).name("Phi").setValue(360);
    folder.add( angulos, 'theta', 0, 360, 5 ).onChange( updateThetha ).name("Theta").setValue(360);

//========================= Visualiza =========================
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame( animate );

        pivot.rotation.y += 0.002;
        pivot.rotation.x += 0.002;

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