//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var renderer, scene;
var camera, topCamera, lateralCamera, frontCamera, ortogonalCamera, perspectiveCamera;
var controls;


var trailer;

var arrowKeysMap = {};

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));
    
    // Light color background
    var color = 0xffffff;
    scene.background = new THREE.Color(color);

    createTrailer(0,0,0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

// create three cameras fixed with ortogonal projection from the top, front and lateral view oriented to the scene center
function addCamera(){
    'use strict';

    // top view
    topCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                                            window.innerHeight / 2, window.innerHeight / - 2,
                                            1, 1000);
    topCamera.position.x = 0;
    topCamera.position.y = 500;
    topCamera.position.z = 0;
    scene.add(topCamera);
    topCamera.lookAt(scene.position);

    // lateral view
    lateralCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                                                window.innerHeight / 2, window.innerHeight / - 2,   
                                                1, 1000);
    lateralCamera.position.x = 500;
    lateralCamera.position.y = 0;
    lateralCamera.position.z = 0;
    scene.add(lateralCamera);
    lateralCamera.lookAt(scene.position);


    // front view
    frontCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                                                window.innerHeight / 2, window.innerHeight / - 2,
                                                1, 1000);
    frontCamera.position.x = 0;
    frontCamera.position.y = 0;
    frontCamera.position.z = 500;
    scene.add(frontCamera);
    frontCamera.lookAt(scene.position);

    // isometric perspective - ortogonal view
    ortogonalCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                                                window.innerHeight / 2, window.innerHeight / - 2,
                                                1, 1000);
    ortogonalCamera.position.x = 500;
    ortogonalCamera.position.y = 500;
    ortogonalCamera.position.z = 500;
    scene.add(ortogonalCamera);
    ortogonalCamera.lookAt(scene.position);

    // isometric perspective - perspective view
    perspectiveCamera = new THREE.PerspectiveCamera(70,
                                                    window.innerWidth / window.innerHeight,
                                                    1,
                                                    1000);
    perspectiveCamera.position.x = 500;
    perspectiveCamera.position.y = 500;
    perspectiveCamera.position.z = 500;
    scene.add(perspectiveCamera);
    perspectiveCamera.lookAt(scene.position);

    camera = frontCamera;
}



/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

/* Trailer functions*/
function createTrailer(x, y, z){
    'use strict';

    trailer = new THREE.Object3D();
 
    addBox(trailer, x, y+40, z+60);
    addPlatform(trailer, x, y-30, z+60)
    addHitch(trailer, x, y-30, z+190)
    addWheel(trailer, x-50, y-40, z-30);
    addWheel(trailer, x+50, y-40, z-30);
    addWheel(trailer, x-50, y-40, z+20);
    addWheel(trailer, x+50, y-40, z+20);

    scene.add(trailer);
}

function addBox(obj, x, y, z){
    'use strict';

    const xBox = 120;
    const yBox = 120;
    const zBox = 240;

    
    var cube = new THREE.BoxGeometry(xBox, yBox, zBox);
    var box = new THREE.Mesh( cube, greyColor ); 
    
    box.position.set(x, y, z);
    obj.add(box);
}

function addPlatform(obj, x, y, z){
    'use strict';

    const xPlatf = 120;
    const yPlatf = 20;
    const zPlatf = 240;

    
    var cube = new THREE.BoxGeometry(xPlatf, yPlatf, zPlatf);
    var platf = new THREE.Mesh( cube, blackColor ); 
    
    platf.position.set(x, y, z);
    obj.add(platf);
}


function addWheel(obj, x, y, z){
    'use strict';
    const radius = 20
    const height = 20;

    var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height);
    var wheel = new THREE.Mesh( cylinderGeometry, blackColor );

    wheel.position.set(x, y, z)
    wheel.rotation.z= Math.PI / 2;

    obj.add(wheel);
}


function addHitch(obj, x, y, z){
    'use strict';

    const xHitch = 20;
    const yHitch = 20;
    const zHitch = 20;

    
    var cube = new THREE.BoxGeometry(xHitch, yHitch, zHitch);
    var hitch = new THREE.Mesh( cube, blackColor ); 
    
    hitch.position.set(x, y, z);
    obj.add(hitch);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    addCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    console.log(e);
    switch(e.keyCode) {
        case 49: // 1
            camera = frontCamera;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            console.log(camera);
            break;
        case 50: // 2
            camera = lateralCamera;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);            
            console.log(camera);
            break;
        case 51: // 3
            camera = topCamera;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            console.log(camera);
            break;
        case 52: // 4
            camera = ortogonalCamera;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            console.log(camera);
            break;
        case 53: // 5
            camera = perspectiveCamera;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            console.log(camera);
            break;
        case 54: // 6 key
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
                renderer.render(scene, camera);
            });
            break;

        case 37: // left arrow key
            arrowKeysMap[37] = true;
            calculateMovement();
            console.log(arrowKeysMap[37]);
            // moveXLeft();
            break;
        case 38: // up arrow key
            arrowKeysMap[38] = true;
            calculateMovement();
            break;
        case 39: // right arrow key
            arrowKeysMap[39] = true;
            calculateMovement();
            break;
        case 40: // down arrow key
            arrowKeysMap[40] = true;
            calculateMovement();
            break;
    }



}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    console.log(e);

    switch (e.keyCode) {
        case 37: // left arrow key
            arrowKeysMap[37] = false;
            calculateMovement();
            break;
        case 38: // up arrow key
            arrowKeysMap[38] = false;
            calculateMovement();
            break;
        case 39: // right arrow key
            arrowKeysMap[39] = false;
            calculateMovement();
            break;
        case 40: // down arrow key
            arrowKeysMap[40] = false;
            calculateMovement();
            break;

   }
}


