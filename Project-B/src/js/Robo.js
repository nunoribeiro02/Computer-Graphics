//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var renderer, scene;
var camera, topCamera, lateralCamera, frontCamera, ortogonalCamera, perspectiveCamera;
var controls;

/* Clock */
var clock = new THREE.Clock();
var delta;  // adjust speed 

/* Objects */
var head, rightArm, leftArm, legs, foot, trailer, robot;
var truckMode = true;
var blockRobot = false;
var finalPosition = [0, 165]; // trailer's position after colision

/* Colisions Box */
var trailerAABB,robotAABB;


/*Moviment */
var rotationSpeed = Math.PI;
var rotationAngleHead = 0, rotationAngleLegs = 0, rotationAngleFeet = 0;
var translationOffsetRightArm = 0, translationOffsetLeftArm = 0;
var translationSpeed = 50;
var translationLimitOut = 80, translationLimitIn = 35;

/* Keyboard */
var keysMap = {};

/*Debug */
const axis = new THREE.AxesHelper(100);

/* Materials & Colors */
let wireframeOn = false;

const redColor = 0xff0000;
const darkRedColor = 0x8b0000;
const darkBlueColor = 0x00008b;
const blueColor = 0x0000ff;
const greyColor = 0x808080;
const darkGreyColor = 0x404040;
const blackColor = 0x26282A;

var blackMaterial = new THREE.MeshBasicMaterial({color: blackColor, wireframe: wireframeOn});
var greyMaterial = new THREE.MeshBasicMaterial({color: greyColor, wireframe: wireframeOn});
var darkGreyMaterial = new THREE.MeshBasicMaterial({color: darkGreyColor, wireframe: wireframeOn});
var blueMaterial = new THREE.MeshBasicMaterial({color: blueColor, wireframe: wireframeOn});
var darkBlueMaterial = new THREE.MeshBasicMaterial({color: darkBlueColor, wireframe: wireframeOn});
var redMaterial = new THREE.MeshBasicMaterial({color: redColor, wireframe: wireframeOn});
var darkRedMaterial = new THREE.MeshBasicMaterial({color: darkRedColor, wireframe: wireframeOn});

/////////////////////
/* ADD SCENE(S) */
/////////////////////
function addScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(axis);
    
    // Light color background
    var color = 0xffffff;
    scene.background = new THREE.Color(color);

    // Add the Robot
    createRobot(0, 0, 0);
    // Add the trailer
    createTrailer(0, 20 , -400);
}
//////////////////////
/* ADD CAMERA(S) */
//////////////////////

function addCamera(){
    'use strict';

    // top view
    topCamera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,
                                            window.innerHeight / 2, window.innerHeight / - 2,
                                            1, 2000);
    topCamera.position.x = 0;
    topCamera.position.y = 1000;
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
                                                1, 2000);
    ortogonalCamera.position.x = 500;
    ortogonalCamera.position.y = 500;
    ortogonalCamera.position.z = 500;
    scene.add(ortogonalCamera);
    ortogonalCamera.lookAt(scene.position);

    // isometric perspective - perspective view
    perspectiveCamera = new THREE.PerspectiveCamera(70,
                                                    window.innerWidth / window.innerHeight,
                                                    1,
                                                    2000);
    perspectiveCamera.position.x = 500;
    perspectiveCamera.position.y = 500;
    perspectiveCamera.position.z = 500;
    scene.add(perspectiveCamera);
    perspectiveCamera.lookAt(scene.position);

    camera = frontCamera;
}

/////////////////////
/* ADD LIGHT(S) */
/////////////////////

////////////////////////
/* ADD OBJECT3D(S) */
////////////////////////

/* Robot */
function createRobot(x, y, z){
    'use strict';

    robot = new THREE.Object3D();

    
    robotAABB = {
        maxX : x + 85,
        minX : x - 85,
        maxZ : z + 100,
        minZ : z - 260
    }


    addBody(robot, x, y + 110, z);
    addAbdomen(robot, x, y + 40, z);
    addWaist(robot, x, y, z);

    //addAABBDebug(robot, x, y, z);

    robot.add(createHead());
    robot.add(createRightArm());
    robot.add(createLeftArm());
    robot.add(createLegs());
    

    robot.position.set(x, y, z);
    scene.add(robot);
}

/* debug */
function addAABBDebug(robot, x, y, z) {
    'use strict';

    const aabbX = 170;
    const aabbY = 260;
    const aabbZ = 360;

    var geometry = new THREE.BoxGeometry(aabbX, aabbY, aabbZ);
    var aabb = new THREE.Mesh(geometry, redMaterial);

    aabb.position.set(x, y + 70, z - 80);
    robot.add(aabb);
}

/* Head */
function createHead(){
    'use strict';

    head = new THREE.Object3D();
    head.position.set(0, 160, 0);
    head.add(axis.clone());

    addHead(head, 0, 0, 0);

    return head;
}

function addHead(obj, x, y, z) {
    'use strict';
    const xHead = 40;
    const yHead = 40;
    const zHead = 40;
    var geometry = new THREE.BoxGeometry(xHead, yHead, zHead);
    var headBox = new THREE.Mesh(geometry, blueMaterial);

    headBox.position.set(x, y + 20, z);

    addAntenna(headBox, x + 25, y + 20, z);
    addAntenna(headBox, x - 25, y + 20, z);

    addEye(headBox, x + 10, y + 5, z + 20);
    addEye(headBox, - x - 10, y + 5, z + 20);

    obj.add(headBox);
}
 
/* Eye */
function addEye(obj, x, y, z){
    'use strict';
    const radius = 4;
    const height = 5;
    var sphereGeometry = new THREE.SphereGeometry(radius, radius, height);
    var eye = new THREE.Mesh( sphereGeometry, greyMaterial );
    eye.position.set(x, y, z)

    obj.add(eye);
}

/* Antenna */
function addAntenna(obj, x, y, z){
    'use strict';
    const xAntenna = 10;
    const yAntenna = 40;
    const zAntenna = 10;
    var geometry = new THREE.BoxGeometry( xAntenna, yAntenna, zAntenna );
    var antenna = new THREE.Mesh( geometry, darkBlueMaterial );
    antenna.position.set(x, y, z);

    obj.add(antenna);
}

/* Arm */
function createRightArm(){
    'use strict';
    rightArm = new THREE.Object3D();
    rightArm.position.set(-80, 105, 0);
    translationOffsetRightArm = -80;
    
    rightArm.add(axis.clone());
    addRightArm(rightArm, 0, 0, 0);
    return rightArm;
}

function createLeftArm(){
    'use strict';
    leftArm = new THREE.Object3D();
    leftArm.position.set(80, 105, 0);
    translationOffsetLeftArm = 80;
    
    leftArm.add(axis.clone());
    addLeftArm(leftArm, 0, 0, 0);
    return leftArm;
}

function addRightArm(obj, x, y, z){ 
    'use strict';
    const xArm = 40;
    const yArm = 95;
    const zArm = 40;

    var geometry = new THREE.BoxGeometry(xArm, yArm, zArm);
    var arm = new THREE.Mesh( geometry, darkBlueMaterial );

    arm.position.set(x - 20, y, z);

    addExhaustTube(arm, x - 25, y + 50, z);
    addRightForearm(arm, x, y - 65, z + 30);

    obj.add(arm);
}

function addLeftArm(obj, x, y, z){ 
    'use strict';
    const xArm = 40;
    const yArm = 95;
    const zArm = 40;

    var geometry = new THREE.BoxGeometry(xArm, yArm, zArm);
    var arm = new THREE.Mesh( geometry, darkBlueMaterial );

    arm.position.set(x + 20, y, z);

    addExhaustTube(arm, x + 25, y + 50, z);
    addLeftForearm(arm, x, y - 65, z + 30);

    obj.add(arm);
}

function addRightForearm(obj, x, y, z){
    'use strict';
    const xForearm = 40;
    const yForearm = 100;
    const zForearm = 40;

    var geometry = new THREE.BoxGeometry( xForearm, yForearm, zForearm );
    var forearm = new THREE.Mesh( geometry, darkRedMaterial );
    forearm.position.set(x, y, z);
    forearm.rotation.x = Math.PI / 2;

    obj.add(forearm);
}

function addLeftForearm(obj, x, y, z){
    'use strict';
    const xForearm = 40;
    const yForearm = 100;
    const zForearm = 40;

    var geometry = new THREE.BoxGeometry( xForearm, yForearm, zForearm );
    var forearm = new THREE.Mesh( geometry, darkRedMaterial );
    forearm.position.set(x, y, z);
    forearm.rotation.x = Math.PI / 2;

    obj.add(forearm);
}

/* ExhaustTube */
function addExhaustTube(obj, x, y, z){
    'use strict';
    const radius = 5;
    const height = 100;

    var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height);
    var exhaustTube = new THREE.Mesh( cylinderGeometry, darkGreyMaterial );
    exhaustTube.position.set(x, y, z);

    obj.add(exhaustTube);
}


/* Legs */
function createLegs(){
    'use strict';
    legs = new THREE.Object3D();
    legs.position.set(0, -20, 0);
    legs.add(axis.clone());

    addRightThigh(legs, 40, -40, 0);
    addLeftThigh(legs, -40, -40, 0);
    addRightLeg(legs, 40, -140, 0);
    addLeftLeg(legs, -40, -140, 0);
    addWheel(legs, 70, -90, 0);
    addWheel(legs, 70, -150, 0);
    addWheel(legs, -70, -90, 0);
    addWheel(legs, -70, -150, 0);

    legs.add(createFeet());
    return legs;
}

function addLeftThigh(obj, x, y, z){
    'use strict';
    const xThigh = 30;
    const yThigh = 80;
    const zThigh = 30;
    var geometry = new THREE.BoxGeometry( xThigh, yThigh, zThigh );
    var thigh = new THREE.Mesh( geometry, darkBlueMaterial );
    thigh.position.set(x, y, z);

    obj.add(thigh);
}

function addRightThigh(obj, x, y, z){
    'use strict';
    const xThigh = 30;
    const yThigh = 80;
    const zThigh = 30;
    var geometry = new THREE.BoxGeometry( xThigh, yThigh, zThigh );
    var thigh = new THREE.Mesh( geometry, darkBlueMaterial );
    thigh.position.set(x, y, z);

    obj.add(thigh);
}

function addRightLeg(obj, x, y, z){
    'use strict';
    const xLeg = 40;
    const yLeg = 120;
    const zLeg = 40;
    var geometry = new THREE.BoxGeometry( xLeg, yLeg, zLeg );
    var leg = new THREE.Mesh( geometry, blueMaterial );
    leg.position.set(x, y, z);
    obj.add(leg);
}

function addLeftLeg(obj, x, y, z){
    'use strict';
    const xLeg = 40;
    const yLeg = 120;
    const zLeg = 40;
    var geometry = new THREE.BoxGeometry( xLeg, yLeg, zLeg );
    var leg = new THREE.Mesh( geometry, blueMaterial );
    leg.position.set(x, y, z);

    obj.add(leg);
}


/* Body */
function addBody(obj, x, y, z){
    'use strict';
    const xBody = 160;
    const yBody = 100;
    const zBody = 80;
    var geometry = new THREE.BoxGeometry( xBody, yBody, zBody);
    var body = new THREE.Mesh( geometry, redMaterial );
    body.position.set(x, y, z + 20);

    obj.add(body);
}

/* Abdomen */
function addAbdomen(obj, x, y, z){
    'use strict';
    const xAbdomen = 80;
    const yAbdomen = 40;
    const zAbdomen = 40;
    var geometry = new THREE.BoxGeometry( xAbdomen, yAbdomen, zAbdomen );
    var abdomen = new THREE.Mesh( geometry, greyMaterial );
    abdomen.position.set(x, y, z);
    
    obj.add(abdomen);
}

/* Waist */
function addWaist(obj, x, y, z){
    'use strict';
    const xWaist = 120;
    const yWaist = 40;
    const zWaist = 40;
    var geometry = new THREE.BoxGeometry( xWaist, yWaist, zWaist );
    var waist = new THREE.Mesh( geometry, redMaterial );
    waist.position.set(x, y, z);

    addWheel(waist, x + 70, y - 20, z);
    addWheel(waist, x - 70, y - 20, z);

    obj.add(waist);
}

/* Wheel */
function addWheel(obj, x, y, z){
    'use strict';
    const radius = 30
    const height = 30;

    var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height);
    var wheel = new THREE.Mesh( cylinderGeometry, blackMaterial );

    wheel.position.set(x, y, z)
    wheel.rotation.z= Math.PI / 2;

    obj.add(wheel);
}

/* Feet */
function createFeet() {
    feet = new THREE.Object3D();
    feet.position.set(0, -180, 0);
    feet.add(axis.clone());

    const xFoot = 40;
    const yFoot = 30;
    const zFoot = 60;

    var geometry = new THREE.BoxGeometry( xFoot, yFoot, zFoot );

    var footRight = new THREE.Mesh( geometry, greyMaterial );
    var footLeft = new THREE.Mesh( geometry, greyMaterial );

    footRight.position.set(-40, -10, 30);
    footLeft.position.set(40, -10 , 30);

    feet.add(footRight);
    feet.add(footLeft);

    return feet;
}

/* Trailer functions*/
function createTrailer(x, y, z){
    'use strict';

    trailer = new THREE.Object3D();

    trailerAABB = {
        minX: x - 65,
        maxX: x + 65,
        minZ: z-155+60,
        maxZ: z+155+60
    }

    addBox(trailer, x, y+70, z+60);
    //addAABBTrailerDebug(trailer, x, y, z+60);
    addPlatform(trailer, x, y-30, z+60);
    addHitch(trailer, x, y-30, z+220);
    addWheel(trailer, x-70, y-40, z-50);
    addWheel(trailer, x+70, y-40, z-50);
    addWheel(trailer, x-70, y-40, z);
    addWheel(trailer, x+70, y-40, z);

  scene.add(trailer);
}

/* debug */
function addAABBTrailerDebug(obj, x, y, z){
    const maxX = 130;
    const maxZ = 310;
    const maxY = 120;

    var cube = new THREE.BoxGeometry(maxX, maxY, maxZ);
    var box = new THREE.Mesh( cube, darkRedMaterial ); 

    box.position.set(x, y, z);
    obj.add(box);
}

/* Box */
function addBox(obj, x, y, z){
  'use strict';

  const xBox = 120;
  const yBox = 180;
  const zBox = 300;
  
  var cube = new THREE.BoxGeometry(xBox, yBox, zBox);
  var box = new THREE.Mesh( cube, greyMaterial ); 
  
  box.position.set(x, y, z);
  obj.add(box);
}

/* Plataform */
function addPlatform(obj, x, y, z){
  'use strict';

  const xPlatf = 120;
  const yPlatf = 20;
  const zPlatf = 300;
  
  var cube = new THREE.BoxGeometry(xPlatf, yPlatf, zPlatf);
  var platf = new THREE.Mesh( cube, blackMaterial ); 
  
  platf.position.set(x, y, z);
  obj.add(platf);
}


function addHitch(obj, x, y, z){
  'use strict';

  const xHitch = 20;
  const yHitch = 20;
  const zHitch = 20;

  
  var cube = new THREE.BoxGeometry(xHitch, yHitch, zHitch);
  var hitch = new THREE.Mesh( cube, blackMaterial ); 
  
  hitch.position.set(x, y, z);
  obj.add(hitch);
}

//////////////////////
/* MOVEMENT  */
//////////////////////

function robotMovement(){
    if (blockRobot) {
        return;
    }

    if (keysMap[82]){ // 'r' key
        if (rotationAngleHead < 0) {
            rotationAngleHead += rotationSpeed * delta;
        }
    }
    if (keysMap[70]){ // 'f' key
        if (rotationAngleHead > -Math.PI) {
            rotationAngleHead -= rotationSpeed * delta;
        }
    }

    if (keysMap[87]){ // 'w' key
        if (rotationAngleLegs < Math.PI/2) {
            rotationAngleLegs += rotationSpeed * delta;
        }
    }

    if (keysMap[83]){ // 's' key
        if (rotationAngleLegs > 0) {
            rotationAngleLegs -= rotationSpeed * delta;
        }
    }

    if (keysMap[69]){ // 'e' key
        if (translationOffsetLeftArm < translationLimitOut){
            translationOffsetLeftArm += translationSpeed * delta;
            translationOffsetRightArm -= translationSpeed * delta;
        }
    }

    if (keysMap[68]){ // 'd' key
        if (translationOffsetLeftArm > translationLimitIn) {
            translationOffsetLeftArm -= translationSpeed * delta;
            translationOffsetRightArm += translationSpeed * delta;
        }
    }   
    if (keysMap[81]){ // 'q' key
        if (rotationAngleFeet < Math.PI/2) {
            rotationAngleFeet += rotationSpeed * delta;
        }
    }

    if (keysMap[65]){ // 'a' key
        if (rotationAngleFeet > 0) {
            rotationAngleFeet -= rotationSpeed * delta;
        }
    }

    // Rotation
    head.rotation.x = rotationAngleHead;
    legs.rotation.x = rotationAngleLegs;
    feet.rotation.x = rotationAngleFeet;

    // Translation
    rightArm.position.x = translationOffsetRightArm;
    leftArm.position.x = translationOffsetLeftArm;
}


function trailerMovement() {
    'use strict';

    if (blockRobot) {
        return;
    }

    if (keysMap[37]) {
        trailer.position.x -= 10;
        trailerAABB.minX -= 10;
        trailerAABB.maxX -= 10;
    }

    if (keysMap[38]) {
        trailer.position.z -= 10;
        trailerAABB.minZ -= 10;
        trailerAABB.maxZ -= 10;
    }

    if (keysMap[39]) {
        trailer.position.x += 10;
        trailerAABB.minX += 10;
        trailerAABB.maxX += 10;
    }

    if (keysMap[40]) {
        trailer.position.z += 10;
        trailerAABB.minZ += 10;
        trailerAABB.maxZ += 10;        
    }
}

function mountMovement(){
    if (blockRobot) {
        const xPos = trailer.position.x;
        const zPos = trailer.position.z;
        if (xPos < finalPosition[0]) {
            trailer.position.x += 1;
            trailerAABB.minX += 1;
            trailerAABB.maxX += 1;
        }
        if (xPos > finalPosition[0]) {
            trailer.position.x -= 1;
            trailerAABB.minX -= 1;
            trailerAABB.maxX -= 1;
        }

        if (zPos < finalPosition[1]) {
            trailer.position.z += 1;
            trailerAABB.minZ += 1;
            trailerAABB.maxZ += 1;
        }
        if (zPos > finalPosition[1]) {
            trailer.position.z -= 1;
            trailerAABB.minZ -= 1;
            trailerAABB.maxZ -= 1;
        }
    }
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

/* Returns true is the robot is in truck mode */
function verifyTruckMode(){
    return rotationAngleHead <= -Math.PI &&
    rotationAngleLegs >= Math.PI/2 &&
    rotationAngleFeet >= Math.PI/2 &&
    translationOffsetLeftArm <= translationLimitOut;
}


function checkCollisions(){
    'use strict';    

    const isCollisionX = (robotAABB.minX <= trailerAABB.minX && trailerAABB.minX <= robotAABB.maxX) ||
                        (robotAABB.minX <= trailerAABB.maxX && trailerAABB.maxX <= robotAABB.maxX)
    
    const isCollisionZ = (robotAABB.minZ <= trailerAABB.minZ && trailerAABB.minZ <= robotAABB.maxZ) ||
                        (robotAABB.minZ <= trailerAABB.maxZ && trailerAABB. maxZ<= robotAABB.maxZ)

    const isCollision = isCollisionX && isCollisionZ;


    return isCollision;
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';
    if (verifyTruckMode()){
        if (checkCollisions()){
            blockRobot = true;
        }
    }

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
}

function updateCamera( newCamera ){
    'use strict';

    camera = newCamera;
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

    addScene();
    addCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    delta = clock.getDelta();

    robotMovement();
    trailerMovement();
    mountMovement();
    handleCollisions(); 
    render();
    requestAnimationFrame(animate);
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

    let rotationAngle = 0;

    switch(e.keyCode) {
        case 49: // 1
            updateCamera(frontCamera)
            break;
        case 50: // 2
            updateCamera(lateralCamera)           
            break;
        case 51: // 3
            updateCamera(topCamera)
            break;
        case 52: // 4
            updateCamera(ortogonalCamera);
            break;
        case 53: // 5
            updateCamera(perspectiveCamera);
            break;
        case 54: // 6 key
            wireframeOn = !wireframeOn;
            greyMaterial.wireframe = wireframeOn;
            blackMaterial.wireframe = wireframeOn;
            blueMaterial.wireframe = wireframeOn;
            darkBlueMaterial.wireframe = wireframeOn;
            darkRedMaterial.wireframe = wireframeOn;
            redMaterial.wireframe = wireframeOn;
            break;

        case 37: // left arrow key
            keysMap[37] = true;
            // moveXLeft();
            break;
        case 38: // up arrow key
            keysMap[38] = true;
            break;
        case 39: // right arrow key
            keysMap[39] = true;
            break;
        case 40: // down arrow key
            keysMap[40] = true;
            break;

        case 82: // 'r' key
            keysMap[82] = true;
            break;
        case 70:  // 'f' key
            keysMap[70] = true;
            break;
        case 87: // 'w' key
            keysMap[87] = true;
            break; 
        case 83: // 's' key
            keysMap[83] = true;
            break;
        case 69: // 'e' key
            keysMap[69] = true;
            break;
        case 68: // 'd' key
            keysMap[68] = true;
            break;
        case 81: // 'q' key
            keysMap[81] = true;
            break;
        case 65: // 'a' key
            keysMap[65] = true;
            break;

        /* debug */
        /*case 76: // 'l' key
            keysMap[70] = true;
            keysMap[87] = true;
            keysMap[68] = true;
            keysMap[81] = true;*/
                        
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch(e.keyCode) {
        case 37: // left arrow key
            keysMap[37] = false;
            break;
        case 38: // up arrow key
            keysMap[38] = false;
            break;
        case 39: // right arrow key
            keysMap[39] = false;
            break;
        case 40: // down arrow key
            keysMap[40] = false;
            break;

        case 70: // 'f' key
            keysMap[70] = false;
            break;
        case 82:  // 'r' key
            keysMap[82] = false;
            break;
        case 87: // 'w' key
            keysMap[87] = false;
            break;
        case 83: // 's' key
            keysMap[83] = false;
            break;
        case 69: // 'e' key
            keysMap[69] = false;
            break;
        case 68: // 'd' key
            keysMap[68] = false;
            break;
        case 81: // 'q' key
            keysMap[81] = false;
            break;
        case 65: // 'a' key
            keysMap[65] = false;
            break;

    }
}
