//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, controls;
var directionalLight, ambientLight, spotLight;

var camera;

/* Clock */
var clock = new THREE.Clock();
var delta;  // adjust speed

var isDirectionalLightOn = true;

var moon, ovni, trees = [];

var wireframeMode = true;
var keysArray = [];

// Ground
var groundMesh, heightmap, groundTexture, groundMat

// Skydome
var skydome, skydomeTexure, skydomeMat;

//  Update Texture
var updateGroundTexture = false;
var updateSkyTexture = false;
var alreadyChangedSky = false;
var alreadyChangedGround = false;

// Lights
var pointLight1, pointLight2, pointLight3, pointLight4;
var lights1, lights2, lights3, lights4;

//House
var houseRoofMesh, houseWindowsMesh, houseWallsMesh;

// Colors
var whiteColor = 0xffffff;
var greyColor = 0x808080;
var lightBlueColor = 0xadd8e6;
var greenColor = 0x07611a;
var brownColor = 0x7a5629;
var lightYellowColor = 0xFEFE85;
var darkOrangeColor = 0xc25604;

var randomLightColor1 = 0xff0040;
var randomLightColor2 = 0x0040ff;
var randomLightColor3 = 0x80ff80;
var randomLightColor4 = 0xffaa00;

// Materials 
var greyMaterials = []
var whiteMaterials = []
var lightBlueMaterials = []
var brownMaterials = []
var lightYellowMaterials = []
var darkOrangeMaterials = []
var greenMaterials = []
var randomLight1Materials = []
var randomLight2Materials = []
var randomLight3Materials = []
var randomLight4Materials = []

var previousMaterial = 1;
var currentMaterial = 1;
var updateMaterials = false;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.x = 15;
    camera.position.y = 50;
    camera.position.z = 100;
    scene.add(camera);
    camera.lookAt(scene.position);
}
/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createDirectionalLight(obj) {
    directionalLight = new THREE.DirectionalLight(lightYellowColor, 0.4);
    directionalLight.castShadow = true;

    directionalLight.shadow.camera.near = 0.1;     // Near shadow distance
    directionalLight.shadow.camera.far = 100;

    directionalLight.target.position.copy(obj.position);
    directionalLight.target.position.set(0, 0, 0);

    obj.add(directionalLight)
    scene.add(directionalLight.target);
}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(lightYellowColor, 0.4);
    scene.add(ambientLight);
}

function createSpotLight(obj, x, y, z) {
    spotLight = new THREE.SpotLight(whiteColor, 0.6);
    spotLight.position.set(x, y, z);
    spotLight.target.position.set(x, 0, z);
    spotLight.angle = Math.PI / 6;
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(spotLight.target);

    obj.add(spotLight);

    return spotLight;
}

////////////////////////
/* CREATE MATERIAL(S) */
////////////////////////

function createLambertMaterial(newcolor) {
    return new THREE.MeshLambertMaterial({
        color: newcolor,
    })
}

function createPhongMaterial(newColor) {
    return new THREE.MeshPhongMaterial({
        color: newColor,
    });

}

function createToonMaterial(newColor) {
    return new THREE.MeshToonMaterial({
        color: newColor,
      });
}

function createBasicMaterial(newColor) {
    return new THREE.MeshBasicMaterial({
        color: newColor,
    });
}


function createMaterials() {
    'use strict';
    
    greyMaterials[0] = new THREE.MeshLambertMaterial({ color: greyColor });
    greyMaterials[1] = new THREE.MeshPhongMaterial({ color: greyColor });
    greyMaterials[2] = new THREE.MeshToonMaterial({ color: greyColor });
    greyMaterials[3] = new THREE.MeshBasicMaterial({ color: greyColor });

    whiteMaterials[0] = new THREE.MeshLambertMaterial({ color: whiteColor });
    whiteMaterials[1] = new THREE.MeshPhongMaterial({ color: whiteColor });
    whiteMaterials[2] = new THREE.MeshToonMaterial({ color: whiteColor });
    whiteMaterials[3] = new THREE.MeshBasicMaterial({ color: whiteColor });

    lightBlueMaterials[0] = new THREE.MeshLambertMaterial({ color: lightBlueColor });
    lightBlueMaterials[1] = new THREE.MeshPhongMaterial({ color: lightBlueColor });
    lightBlueMaterials[2] = new THREE.MeshToonMaterial({ color: lightBlueColor });
    lightBlueMaterials[3] = new THREE.MeshBasicMaterial({ color: lightBlueColor });

    brownMaterials[0] = new THREE.MeshLambertMaterial({ color: brownColor });
    brownMaterials[1] = new THREE.MeshPhongMaterial({ color: brownColor });
    brownMaterials[2] = new THREE.MeshToonMaterial({ color: brownColor });
    brownMaterials[3] = new THREE.MeshBasicMaterial({ color: brownColor });

    lightYellowMaterials[0] = new THREE.MeshLambertMaterial({ color: lightYellowColor, emissive: lightYellowColor, emissiveIntensity: 1});
    lightYellowMaterials[1] = new THREE.MeshPhongMaterial({ color: lightYellowColor, emissive: lightYellowColor, emissiveIntensity: 0.5});
    lightYellowMaterials[2] = new THREE.MeshToonMaterial({ color: lightYellowColor, emissive: lightYellowColor, emissiveIntensity: 0.5});
    lightYellowMaterials[3] = new THREE.MeshBasicMaterial({ color: lightYellowColor});

    darkOrangeMaterials[0] = new THREE.MeshLambertMaterial({ color: darkOrangeColor });
    darkOrangeMaterials[1] = new THREE.MeshPhongMaterial({ color: darkOrangeColor });
    darkOrangeMaterials[2] = new THREE.MeshToonMaterial({ color: darkOrangeColor });
    darkOrangeMaterials[3] = new THREE.MeshBasicMaterial({ color: darkOrangeColor });

    greenMaterials[0] = new THREE.MeshLambertMaterial({ color: greenColor });
    greenMaterials[1] = new THREE.MeshPhongMaterial({ color: greenColor });
    greenMaterials[2] = new THREE.MeshToonMaterial({ color: greenColor });
    greenMaterials[3] = new THREE.MeshBasicMaterial({ color: greenColor });

}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createGround() {
    var width = 200;
    var height = 200;
    var widthSegments = 300;
    var heightSegments = 300;

    const groundGeo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    heightmap = new THREE.TextureLoader().load('https://web.tecnico.ulisboa.pt/~ist199276/heightmap.png');
    groundTexture = new THREE.TextureLoader().load('https://web.tecnico.ulisboa.pt/~ist199276/ground.png');
    groundMat = new THREE.MeshPhongMaterial({
        displacementMap: heightmap,
        map: groundTexture,
        displacementScale: 50,
        emissiveIntensity: 1,
        needsUpdate: true,
        shading: THREE.SmoothShading,
    });

    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
}

function createHouse(x, y, z, materialWall, materialRoof, materialWindows) {
    'use strict';

    var houseWalls = new THREE.BufferGeometry();
    var houseRoof = new THREE.BufferGeometry();
    var houseWindows = new THREE.BufferGeometry();

    var houseWallsVertexPositions = [
        //FACE 1
        [x + 9.0, y + 1.5, z + 0.0],
        [x + 0.0, y + 1.5, z + 0.0],
        [x + 0.0, y + 0.0, z + 0.0],

        [x + 9.0, y + 0.0, z + 0.0],
        [x + 9.0, y + 1.5, z + 0.0],
        [x + 0.0, y + 0.0, z + 0.0],

        [x + 0.0, y + 4.0, z + 0.0],
        [x + 0.0, y + 1.5, z + 0.0],
        [x + 5.0, y + 4.0, z + 0.0],

        [x + 0.0, y + 1.5, z + 0.0],
        [x + 5.0, y + 1.5, z + 0.0],
        [x + 5.0, y + 4.0, z + 0.0],

        [x + 7.0, y + 1.5, z + 0.0],
        [x + 9.0, y + 4.0, z + 0.0],
        [x + 7.0, y + 4.0, z + 0.0],

        [x + 7.0, y + 1.5, z + 0.0],
        [x + 9.0, y + 1.5, z + 0.0],
        [x + 9.0, y + 4.0, z + 0.0],

        [x + 11.0, y + 1.5, z + 0.0],
        [x + 13.0, y + 4.0, z + 0.0],
        [x + 11.0, y + 4.0, z + 0.0],

        [x + 11.0, y + 1.5, z + 0.0],
        [x + 13.0, y + 1.5, z + 0.0],
        [x + 13.0, y + 4.0, z + 0.0],

        [x + 11.0, y + 0.0, z + 0.0],
        [x + 20.0, y + 1.5, z + 0.0],
        [x + 11.0, y + 1.5, z + 0.0],

        [x + 11.0, y + 0.0, z + 0.0],
        [x + 20.0, y + 0.0, z + 0.0],
        [x + 20.0, y + 1.5, z + 0.0],

        [x + 15.0, y + 1.5, z + 0.0],
        [x + 20.0, y + 4.0, z + 0.0],
        [x + 15.0, y + 4.0, z + 0.0],

        [x + 15.0, y + 1.5, z + 0.0],
        [x + 20.0, y + 1.5, z + 0.0],
        [x + 20.0, y + 4.0, z + 0.0],

        [x + 0.0, y + 4.0, z + 0.0],
        [x + 20.0, y + 4.0, z + 0.0],
        [x + 20.0, y + 5.0, z + 0.0],

        [x + 0.0, y + 5.0, z + 0.0],
        [x + 0.0, y + 4.0, z + 0.0],
        [x + 20.0, y + 5.0, z + 0.0],

        //FACE 2 - Triangle 1
        [x + 20.0, y + 0.0, z - 10.0],
        [x + 20.0, y + 5.0, z + 0.0],
        [x + 20.0, y + 0.0, z + 0.0],

        //FACE 2 - Triangle 2
        [x + 20.0, y + 0.0, z - 10.0],
        [x + 20.0, y + 5.0, z - 10.0],
        [x + 20.0, y + 5.0, z + 0.0],

        //FACE 3 - Triangle 1
        [x + 20.0, y + 0.0, z - 10.0],
        [x + 0.0, y + 0.0, z - 10.0],
        [x + 20.0, y + 5.0, z - 10.0],

        //FACE 3 - Triangle 2
        [x + 0.0, y + 0.0, z - 10.0],
        [x + 0.0, y + 5.0, z - 10.0],
        [x + 20.0, y + 5.0, z - 10.0],

        //FACE 4 - Triangle 1
        [x + 0.0, y + 0.0, z - 10.0],
        [x + 0.0, y + 5.0, z + 0.0],
        [x + 0.0, y + 5.0, z - 10.0],

        //FACE 4 - Triangle 2
        [x + 0.0, y + 0.0, z - 10.0],
        [x + 0.0, y + 0.0, z + 0.0],
        [x + 0.0, y + 5.0, z + 0.0],

        //FACE 5
        [x + 20.0, y + 5.0, z + 0.0],
        [x + 20.0, y + 5.0, z - 10.0],
        [x + 20.0, y + 8.0, z - 5.0],

        //FACE 6
        [x + 0.0, y + 5.0, z + 0.0],
        [x + 0.0, y + 8.0, z - 5.0],
        [x + 0.0, y + 5.0, z - 10.0],


    ];

    var houseRoofVertexPositions = [
        //ROOF 1 - Triangle 1
        [x + 0.0, y + 5.0, z + 0.0],
        [x + 20.0, y + 5.0, z + 0.0],
        [x + 0.0, y + 8.0, z - 5.0],

        //ROOF 1 - Triangle 2
        [x + 20.0, y + 5.0, z + 0.0],
        [x + 20.0, y + 8.0, z - 5.0],
        [x + 0.0, y + 8.0, z - 5.0],

        //ROOF 2 - Triangle 1
        [x + 0.0, y + 5.0, z - 10.0],
        [x + 0.0, y + 8.0, z - 5.0],
        [x + 20.0, y + 5.0, z - 10.0],

        //ROOF 2 - Triangle 2
        [x + 20.0, y + 8.0, z - 5.0],
        [x + 20.0, y + 5.0, z - 10.0],
        [x + 0.0, y + 8.0, z - 5.0],
    ];

    var houseWindowsVertexPositions = [
        //Window 1 - Triangle 1
        [x + 5.0, y + 1.5, z + 0.0],
        [x + 7.0, y + 1.5, z + 0.0],
        [x + 5.0, y + 4.0, z + 0.0],

        //Window 1 - Triangle 2
        [x + 7.0, y + 4.0, z + 0.0],
        [x + 5.0, y + 4.0, z + 0.0],
        [x + 7.0, y + 1.5, z + 0.0],


        //Window 2 - Triangle 1
        [x + 13.0, y + 1.5, z + 0.0],
        [x + 15.0, y + 1.5, z + 0.0],
        [x + 13.0, y + 4.0, z + 0.0],

        //Window 2 - Triangle 2
        [x + 15.0, y + 4.0, z + 0.0],
        [x + 13.0, y + 4.0, z + 0.0],
        [x + 15.0, y + 1.5, z + 0.0],


        //Door - Triangle 1
        [x + 9.0, y + 0.0, z + 0.0],
        [x + 11.0, y + 0.0, z + 0.0],
        [x + 9.0, y + 4.0, z + 0.0],

        //Door - Triangle 2
        [x + 11.0, y + 4.0, z + 0.0],
        [x + 9.0, y + 4.0, z + 0.0],
        [x + 11.0, y + 0.0, z + 0.0],

    ];

    var houseWallsVertices = new Float32Array(houseWallsVertexPositions.length * 3); // three components per vertex
    var houseRoofVertices = new Float32Array(houseRoofVertexPositions.length * 3);
    var houseWindowsVertices = new Float32Array(houseWindowsVertexPositions.length * 3);
    // components of the position vector for each vertex are stored
    // contiguously in the buffer.
    for (var i = 0; i < houseWallsVertexPositions.length; i++) {
        houseWallsVertices[i * 3 + 0] = houseWallsVertexPositions[i][0];
        houseWallsVertices[i * 3 + 1] = houseWallsVertexPositions[i][1];
        houseWallsVertices[i * 3 + 2] = houseWallsVertexPositions[i][2];
    }

    for (var i = 0; i < houseRoofVertexPositions.length; i++) {
        houseRoofVertices[i * 3 + 0] = houseRoofVertexPositions[i][0];
        houseRoofVertices[i * 3 + 1] = houseRoofVertexPositions[i][1];
        houseRoofVertices[i * 3 + 2] = houseRoofVertexPositions[i][2];
    }

    for (var i = 0; i < houseWindowsVertexPositions.length; i++) {
        houseWindowsVertices[i * 3 + 0] = houseWindowsVertexPositions[i][0];
        houseWindowsVertices[i * 3 + 1] = houseWindowsVertexPositions[i][1];
        houseWindowsVertices[i * 3 + 2] = houseWindowsVertexPositions[i][2];
    }


    // itemSize = 3 because there are 3 values (components) per vertex
    houseWalls.setAttribute('position', new THREE.BufferAttribute(houseWallsVertices, 3));
    houseRoof.setAttribute('position', new THREE.BufferAttribute(houseRoofVertices, 3));
    houseWindows.setAttribute('position', new THREE.BufferAttribute(houseWindowsVertices, 3));

    houseWalls.computeVertexNormals();
    houseRoof.computeVertexNormals();
    houseWindows.computeVertexNormals();

    houseWallsMesh = new THREE.Mesh(houseWalls, materialWall);
    houseWallsMesh.castShadow = true;
    houseWallsMesh.receiveShadow = true;

    houseRoofMesh = new THREE.Mesh(houseRoof, materialRoof);
    houseRoofMesh.castShadow = true;
    houseRoofMesh.receiveShadow = true;

    houseWindowsMesh = new THREE.Mesh(houseWindows, materialWindows);
    houseWindowsMesh.castShadow = true;
    houseWindowsMesh.receiveShadow = true;

    scene.add(houseWindowsMesh);
    scene.add(houseRoofMesh);
    scene.add(houseWallsMesh);
}

function createOvni(x, y, z) {
    'use strict';

    ovni = new THREE.Object3D();
    ovni.position.set(x, y, z);

    addOvniLights(x, y - (15 * 0.2) - 1.5, z);
    addOvni(x, y, z);
    addOvniCockpit(x, y + 4, z);
    addOvniBase(x, y - 7.5, z);

    ovni.scale.set(0.5, 0.5, 0.5)
    scene.add(ovni);
}

function addOvni(x, y, z) {
    'use strict';

    var radius = 15;

    var ovniBase = new THREE.SphereGeometry(radius);
    var material = greyMaterials[currentMaterial];
    var ovniMesh = new THREE.Mesh(ovniBase, material);

    ovniMesh.position.set(x, y, z);

    ovni.add(ovniMesh);
    ovniMesh.scale.set(2, 0.4, 2);
}

function addOvniCockpit(x, y, z) {
    'use strict';
    var radius = 8;
    var ovniCockpit = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    var material = lightBlueMaterials[currentMaterial];
    var ovniCockpitMesh = new THREE.Mesh(ovniCockpit, material);

    ovniCockpitMesh.position.set(x, y + (15 * 0.4) - 5, z);
    ovniCockpitMesh.scale.set(1.2, 0.9, 1.2);

    ovniCockpitMesh.castShadow = true;
    ovniCockpitMesh.receiveShadow = true;

    ovni.add(ovniCockpitMesh);
}

function addOvniBase(x, y, z) {
    'use strict';

    console.log(x, y, z);

    var cylinderRadiusTop = 10;
    var cylinderRadiusBottom = 10;
    var cylinderHeight = 3;
    var cylinderRadialSegments = 32;
    var cylinderGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, cylinderRadialSegments);

    var baseMesh = new THREE.Mesh(cylinderGeometry, whiteMaterials[currentMaterial]);
    baseMesh.position.set(x, y, z);
    createSpotLight(baseMesh, x, y, z);
    ovni.add(baseMesh);
}

function addOvniLights(x, y, z) {
    'use strict';

    var lightsGeometry = new THREE.SphereGeometry(2, 32, 16);

    lights1 = new THREE.Mesh(lightsGeometry, whiteMaterials[currentMaterial]);
    lights2 = new THREE.Mesh(lightsGeometry,  whiteMaterials[currentMaterial]);
    lights3 = new THREE.Mesh(lightsGeometry,  whiteMaterials[currentMaterial]);
    lights4 = new THREE.Mesh(lightsGeometry,  whiteMaterials[currentMaterial]);

    pointLight1 = new THREE.PointLight(randomLightColor1, 1, 20);
    lights1.add(pointLight1);
    ovni.add(lights1);

    pointLight2 = new THREE.PointLight(randomLightColor2, 1, 20);
    lights2.add(pointLight2);
    ovni.add(lights2);

    pointLight3 = new THREE.PointLight(randomLightColor3, 1, 20);
    lights3.add(pointLight3);
    ovni.add(lights3);

    pointLight4 = new THREE.PointLight(randomLightColor4, 1, 20);
    lights4.add(pointLight4);
    ovni.add(lights4);


    lights1.position.set(15, y, 15);
    lights2.position.set(15, y, -15);
    lights3.position.set(-15, y, -15);
    lights4.position.set(-15, y, 15);
    const helper1 = new THREE.PointLightHelper(pointLight1, 4);
    const helper2 = new THREE.PointLightHelper(pointLight2, 4);
    const helper3 = new THREE.PointLightHelper(pointLight3, 4);
    const helper4 = new THREE.PointLightHelper(pointLight4, 4);

    //scene.add(helper1, helper2, helper3, helper4);

}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createTree(x, y, z, height) {
    'use strict';
    var tree = new THREE.Object3D();
    tree.position.set(x, y, z);

    addTreeTrunk(tree, x, y + 3.5, z);
    addTreeLeaves(tree, x - 1, y + 7, z, 5, 0);
    
    addBranch(tree, x + 1.5, y + 3, z);
    addTreeLeaves(tree, x + 2.5, y + 4, z, 1, Math.PI / 4);


    tree.scale.set(1, height, 1);

    scene.add(tree);

    trees.push(tree);
    return tree;
}

function addTreeTrunk(obj, x, y, z) {
    'use strict';
    const cylinderRadius = 1;
    const cylinderHeight = 7;

    var TrunkGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);

    var TrunkMesh = new THREE.Mesh(TrunkGeometry, brownMaterials[currentMaterial]);
    TrunkMesh.position.set(x, y, z);
    TrunkMesh.rotation.z = Math.PI / 10;

    TrunkMesh.castShadow = true;
    TrunkMesh.receiveShadow = false;

    TrunkMesh.rotateX(Math.PI / 8);

    obj.add(TrunkMesh);
}

function addBranch(obj, x, y, z) {
    'use strict';
    const cylinderRadius = 0.25;
    const cylinderHeight = 2;

    var TrunkGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
    var branch = new THREE.Mesh(TrunkGeometry, brownMaterials[currentMaterial]);
    branch.position.set(x, y, z);

    branch.castShadow = true;
    branch.receiveShadow = false;

    branch.rotateZ(-Math.PI / 4);
    branch.rotateY(-Math.PI / 8)

    obj.add(branch);
}

function addTreeLeaves(obj, x, y, z, size, ang) {
    'use strict';

    var leavesGeometry = new THREE.SphereGeometry(size);
    var leaves  = new THREE.Mesh(leavesGeometry, greenMaterials[currentMaterial]);
    leaves.position.set(x, y, z);
    leaves.scale.set(1, 0.6, 1);
    leaves.receiveShadow = false;
    leaves.castShadow = true;

    obj.add(leaves);
}

function createMoon(x, y, z) {
    'use strict';
    var geometry = new THREE.SphereGeometry(6, 32, 32);
    var material = createPhongMaterial(lightYellowColor);

    moon = new THREE.Mesh(geometry, lightYellowMaterials[material]);

    moon.position.set(x, y, z);

    createDirectionalLight(moon);

    scene.add(moon);
}

function createSkydome(x, y, z) {
    'use strict';

    var radius = 100;
    var widthSegments = 20;
    var heightSegments = 10;
    var phiStart = 0;
    var phiLength = Math.PI * 2;
    var thetaStart = 0;
    var thetaLength = Math.PI / 2 - 0.1;

    var skydomeBase = new THREE.SphereGeometry(radius, widthSegments, heightSegments,
        phiStart, phiLength, thetaStart, thetaLength);

    skydomeTexure = new THREE.TextureLoader().load('https://web.tecnico.ulisboa.pt/~ist199276/skydome.png');
    skydomeMat = new THREE.MeshPhongMaterial({
        color: lightBlueColor,
        map: skydomeTexure,
        side: THREE.BackSide
    });

    skydome = new THREE.Mesh(skydomeBase, skydomeMat);
    skydome.position.set(x, y, z);
    scene.add(skydome);
}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';

    ovniMoviments();
    ovniRotation();
    updateTextures();
    changeMaterials();
}

function ovniMoviments() {
    'use strict';

    var ovniSpeed = 25;

    if (keysArray[39]) {
        ovni.position.x += ovniSpeed * delta;
        spotLight.target.position.x += ovniSpeed * delta;
    }

    if (keysArray[40]) {
        ovni.position.z += ovniSpeed * delta;
        spotLight.target.position.z += ovniSpeed * delta;

    }

    if (keysArray[37]) {
        ovni.position.x -= ovniSpeed * delta;
        spotLight.target.position.x -= ovniSpeed * delta;

    }

    if (keysArray[38]) {
        ovni.position.z -= ovniSpeed * delta;
        spotLight.target.position.z -= ovniSpeed * delta;

    }

}

function ovniRotation() {
    'use strict';
    let rotationSpeed = Math.PI / 3;

    ovni.rotation.y += rotationSpeed * delta;
}

function updateCamera(newCamera) {
    'use strict';

    camera = newCamera;
}

function updateTextures() {
    'use strict';

    if (updateGroundTexture && !alreadyChangedGround) {
        groundMat.map = createFieldTexture();
        groundMat.map.needsUpdate = true;
        alreadyChangedGround = true;
    }

    if (updateSkyTexture && !alreadyChangedSky) {
        skydomeMat.map = createSkyTexture();
        skydomeMat.map.needsUpdate = true;
        alreadyChangedSky = true;

    }
}

/*function changeMaterials(){
    'use strict';

    // Don't change materials if the user 
    // didn't press the button
    if (!updateMaterials) return;

    switch (currentMaterial) {
        case 0: // Change to Lampert Material
            changeToLambertMaterial();
        case 1: // Change to Phong Material
            changeToPhongMaterial();
        case 2: // Change to Toon Material
            changeToToonMaterial();
    }

    updateMaterials = false;
}*/

function changeMaterials() {
    'use strict';

    if (!updateMaterials) return;

    console.log("inside change material function");
    moon.material = lightYellowMaterials[currentMaterial];
    houseRoofMesh.material = darkOrangeMaterials[currentMaterial];
    houseWindowsMesh.material = lightBlueMaterials[currentMaterial];
    houseWallsMesh.material = whiteMaterials[currentMaterial];

    for (let i = 0; i < 6; i++) { 
        changeMaterialTree(trees[i]);
    }
    changeMaterialOvni();
    
    updateMaterials = false;
}

function changeToBasicMaterial(){
    'use strict';
    if (currentMaterial != 3) {
        previousMaterial = currentMaterial;
        currentMaterial = 3;
        changeMaterialOvni();
        for (let i = 0; i < 6; i++) { 
            changeMaterialTree(trees[i]);
        }
        moon.material = new THREE.MeshBasicMaterial(lightYellowColor);
        houseRoofMesh.material = new THREE.MeshBasicMaterial({ color: darkOrangeColor});
        houseWindowsMesh.material = new THREE.MeshBasicMaterial({ color: lightBlueColor});
        houseWallsMesh.material = new THREE.MeshBasicMaterial({ color: whiteColor });
    }
    else {
        currentMaterial = previousMaterial;
        previousMaterial = 3;
        updateMaterials = true;
    }
}

function changeMaterialOvni(){
    for (let i = 0; i < ovni.children.length; i++){

        if (ovni.children[i].material == greyMaterials[previousMaterial]){
            ovni.children[i].material = greyMaterials[currentMaterial];
        }
        else if (ovni.children[i].material == lightBlueMaterials[previousMaterial]){
            ovni.children[i].material = lightBlueMaterials[currentMaterial];
        }
        else if (ovni.children[i].material == whiteMaterials[previousMaterial]){
            ovni.children[i].material = whiteMaterials[currentMaterial];
        }
    }
}   


function changeMaterialTree(tree){
    console.log('inside change material tree')
    console.log(tree.children.length);
    for (let i = 0; i < tree.children.length; i++){
        console.log(tree.children[i].material == brownMaterials[previousMaterial]);
        if (tree.children[i].material == brownMaterials[previousMaterial]){
            console.log('brown Material');
            tree.children[i].material = brownMaterials[currentMaterial];
        }
        else if (tree.children[i].material == greenMaterials[previousMaterial]){
            console.log('Green Material');
            tree.children[i].material = greenMaterials[currentMaterial];
        }
    }
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
    
    createScene();
    createCamera();
    createMaterials();
    
    createAmbientLight();
    createMoon(-40, 60, -50);
    createGround();
    createOvni(0, 35, 0);
    createHouse(0, 17, 0, whiteMaterials[currentMaterial], darkOrangeMaterials[currentMaterial], lightBlueMaterials[currentMaterial]);
    createSkydome(0, 0, 0);
    
    createTree(15, 9, 15, 1).rotateY(Math.PI / 8);
    createTree(-15, 8.5, 7, 0.9).rotateY(3 * Math.PI / 10);
    createTree(-80, 8.8, 70, 1.2).rotateY(7 * Math.PI / 8);
    createTree(-50, 3.5, -30, 1.0).rotateY(5 * Math.PI / 8).rotateX(Math.PI / 16);
    createTree(-30, 5, -15, 1.1).rotateY(Math.PI / 8);
    createTree(-15, 5, -15, 1.2).rotateY(4 * Math.PI / 8);
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.xr.enable = true;
    document.body.appendChild(VRButton.createButton(renderer));

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    //scene.add( helper );

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

    controls.update();
    update();
    render();
    //requestAnimationFrame(animate);
    renderer.setAnimationLoop(animate);

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
        perspectiveCamera.updateProjectionMatrix();
    }
}


///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    console.log(e);

    switch (e.keyCode) {
        case 49: // 1
            updateGroundTexture = true;
            break;
        case 50: // 2
            updateSkyTexture = true;
            break;
        case 37: // Left Arrow
            keysArray[37] = true;
            break;
        case 38: // Up Arrow
            keysArray[38] = true;
            break;
        case 39: // Right Arrow
            keysArray[39] = true;
            break;
        case 40: // Down Arrow
            keysArray[40] = true;
            break;

        case 68: // key 'd'
            directionalLight.visible = !directionalLight.visible;
            break;

        case 80: // key 'p'
            pointLight1.visible = !pointLight1.visible;
            pointLight2.visible = !pointLight2.visible;
            pointLight3.visible = !pointLight3.visible;
            pointLight4.visible = !pointLight4.visible;
            break;

        case 83: // key 's'
            spotLight.visible = !spotLight.visible;
            break;
        
        case 81: // key 'q' -> Change to Lambert Material
            previousMaterial = currentMaterial;
            currentMaterial = 0;
            updateMaterials = true;
            break;
        
        case 87: // key 'w' -> Change to Phong Material
            previousMaterial = currentMaterial;
            currentMaterial = 1;
            updateMaterials = true;
            break;
    
        case 69: // key 'e' -> Change to Toon Material
            previousMaterial = currentMaterial;
            currentMaterial = 2;
            updateMaterials = true;
            break;
    
        case 82: //key 'r' -> Change to Basic Material
            changeToBasicMaterial();
            break;

        case 39: // key left arrow
            keysArray[39] = true;
            break;

        case 37: // key right arrow
            keysArray[37] = true;
            break;

        case 38: // key up arrow
            keysArray[38] = true;
            break;

        case 40: // key down arrow
            keysArray[40] = true;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';
    console.log(e);

    switch (e.keyCode) {
        case 49: // 1
            alreadyChangedGround = false;
            updateGroundTexture = false;
            break;
        case 50: // 2
            alreadyChangedSky = false;
            updateSkyTexture = false;
            break;
        case 37: // Left Arrow
            keysArray[37] = false;
            break;
        case 38: // Up Arrow
            keysArray[38] = false;
            break;
        case 39: // Right Arrow
            keysArray[39] = false;
            break;
        case 40: // Down Arrow
            keysArray[40] = false;
            break;
    }
}