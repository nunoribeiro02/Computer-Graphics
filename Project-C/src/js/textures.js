//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;
var directionalLight, ambientLight;
var camera;
var isField = true;

var wireframeMode = true;

var greyColor = 0x808080;
var greyMaterial = new THREE.MeshBasicMaterial({color: greyColor, wireframe: wireframeMode});

 // Create a shader material for the sky with stars


 // Create the sky mesh using the geometry and material



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera(){
    'use strict';

    // Set-up perspective camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
}
/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createDirectionalLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White light with low intensity
    directionalLight.position.set(1, 1, 1); // Adjust the position of the light
    scene.add(directionalLight);
    

}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xffffee, 0.2);
    scene.add(ambientLight);
}

////////////////////////
/* CREATE TEXTURE(S) */
////////////////////////
function createFieldTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    const context = canvas.getContext('2d');
  
    // Desenhar fundo verde claro 
    const greenColor = '#4dff4d';
    context.fillStyle = greenColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw flowers
    const whiteColor = '#ffffff'
    const lightblueColor = '#80ffd4'
    const yellowColor = '#ffff33'
    const lilacColor = '#cc33ff'


    const colors = [whiteColor, lightblueColor, yellowColor, lilacColor];
    const numFlowers = 1000;
  
    for (let i = 0; i < numFlowers; i++) {
      const radius = Math.random() * 3;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      const color = colors[Math.floor(Math.random() * colors.length)];
  
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    }
  
    fieldTexture = new THREE.CanvasTexture(canvas);

    return fieldTexture;
    
  }
  
  function createSkyTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const context = canvas.getContext('2d');
  
    // Draw background gradient
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);

    const darkBlueColor = '#0d023d';
    const violetColor = '#c402c4'
    gradient.addColorStop(0.3, darkBlueColor); // darkBlue 
    gradient.addColorStop(1, violetColor); // violet
  
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw stars
    const numStars = 400;
  
    for (let i = 0; i < numStars; i++) {
      const radius = Math.random() + 0.1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
  
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = '#ffffff';
      context.fill();
    }
  
    skyTexture = new THREE.CanvasTexture(canvas);

    return skyTexture;
  }



////////////
/* UPDATE */
////////////
function update(){
    updateTexture();
}

function updateTexture() {
    const material = new THREE.MeshBasicMaterial({ map: isField ? fieldTexture : skyTexture });
    const geometry = new THREE.PlaneGeometry(10, 10);
    const mesh = new THREE.Mesh(geometry, material);
  
    scene.clear();
    scene.add(mesh);
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
    createCamera();

    // Create textures
    createFieldTexture();
    createSkyTexture();

    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);


}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    console.log(e);

    switch(e.keyCode) {
        case 49: // 1
            isField = true;
            break;
        case 50: // 2
            isField = false;
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}