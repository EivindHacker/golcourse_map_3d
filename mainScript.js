
import * as THREE from "./three_js/three.module.js";
import { OrbitControls } from "./three_js/OrbitControls.js";
import * as dat from "./three_js/dat.gui.module.js";
import { GLTFLoader } from "./three_js/GLTFLoader.js";
import {holeInfo} from "./holeInfo.js";
import {hullInfo} from "./hullInfo.js";


//Bruk GSAP for kamera animasjon?
//Hover slide out box for de forskjellige view typene
//slowe ned i bunker

const chosenHole = sessionStorage.getItem("hole");


let selectedHole = 1;

if(chosenHole != null){
  selectedHole = parseInt(chosenHole);
}
console.log(selectedHole)

let selectedTee = 3;

const whiteTrans = document.getElementById("whiteTrans");
const distCont = document.getElementById("distCont");

const homeBtn = document.getElementById("homeBtn");
const footerBar = document.querySelector(".footerBar");
const holeCont = document.querySelector(".holeCont");
const menuCont = document.querySelector(".menu-cont");

homeBtn.addEventListener("mousedown", function(){
  footerBar.classList.add("fadeOut");
  holeCont.classList.add("fadeOut");
  menuCont.classList.add("fadeOut");
  startTrans();
  setTimeout(function(){
    window.location.href='./index.html';
 }, 200);
  
})

//------------------ HELP --------------------------

let help = false;
let language = "en";

const helpBtn = document.getElementById("helpBtn");
const helpCont = document.getElementById("helpCont");
const exitHelpCont = document.querySelector(".exitHelpCont");

helpBtn.addEventListener("mousedown", function(){
exitHelp();
})

exitHelpCont.addEventListener("mousedown", function(){
exitHelp();
})

function exitHelp(){
if(!help){
  help = true;
  helpCont.style.display = "block";
  helpBtn.style.filter = "brightness(1.1)";
  helpBtn.style.transform = "scale(1.05)";
}else{
  help = false;
  helpCont.style.display = "none";
  helpBtn.style.filter = "";
  helpBtn.style.transform = "";
}
}

const enBtn = document.getElementById("enBtn");
const noBtn = document.getElementById("noBtn");

enBtn.addEventListener("mousedown", function(){
changeLanguage();
})

noBtn.addEventListener("mousedown", function(){
changeLanguage();
})

const helpTitle = document.getElementById("helpTitle");

function changeLanguage(){
if(language != "en"){
  language = "en";
  enBtn.classList.add("flagActive");
  noBtn.classList.remove("flagActive");
  helpTitle.innerText = "Instructions";
}else if(language != "no"){
  language = "no";
  noBtn.classList.add("flagActive");
  enBtn.classList.remove("flagActive");
  helpTitle.innerText = "Instruksjoner";
}
setInfo(selectedHole);
}


//--------------- INFO -----------------------


let showInfo = false;

const infoBtn = document.getElementById("infoBtn");
const infoTxtCont = document.querySelector(".infoTxtCont");

infoBtn.addEventListener("mousedown", function(){

if(!showInfo){
  showInfo = true;
  infoTxtCont.classList.add("infoActive");
  //infoBtn.style.marginLeft = "130px";
}else{
  showInfo = false;
  infoTxtCont.classList.remove("infoActive");
  //infoBtn.style.marginLeft = "60px";
}
})


//--------------- NAVBAR ------------------------

let selectedPoint = 0;
let totalPoints;



const prevHole = document.getElementById("prevHole");
const nextHole = document.getElementById("nextHole");
const prevPoint = document.getElementById("prevPoint");
const nextPoint = document.getElementById("nextPoint");

prevHole.addEventListener("mousedown", function(){
if(selectedHole > 1){

  startTrans();

  footerBar.classList.add("fadeOut");
  holeCont.classList.add("fadeOut");
  menuCont.classList.add("fadeOut");

  setTimeout(function(){
    selectedHole--;
    selectedPoint = 0;
    //setHole(selectedHole,selectedTee);
    hole = holes[selectedHole];

    //disableHole();

    console.log("Selected hole: " + selectedHole);

    sessionStorage.setItem("hole", `${selectedHole}`);

    window.location.href = "./courseguide.html";
  }, 200); 
  
  

}
})
nextHole.addEventListener("mousedown", function(){
if(selectedHole < holes.length - 1){

  startTrans();

  footerBar.classList.add("fadeOut");
  holeCont.classList.add("fadeOut");
  menuCont.classList.add("fadeOut");

  setTimeout(function(){
    selectedHole++;
    selectedPoint = 0;
    //setHole(selectedHole,selectedTee);
    hole = holes[selectedHole];

    //disableHole();

    console.log("Selected hole: " + selectedHole);

    sessionStorage.setItem("hole", `${selectedHole}`);

    window.location.href = "./courseguide.html";
  }, 200); 
  
  
}
})
prevPoint.addEventListener("mousedown", function(){

if(selectedPoint > 0){
  selectedPoint--;
  setCamera("3d");
  console.log("Selected Point: " + selectedPoint);

  disablePoint();

}
})
nextPoint.addEventListener("mousedown", function(){

if(selectedPoint < 3){
  if(hole.p1 != false && selectedPoint == 0){
    selectedPoint++;
    setCamera("3d");
    console.log("Selected Point: " + selectedPoint);
  }else if(hole.p2 != false && selectedPoint == 1){
    selectedPoint++;
    setCamera("3d");
    console.log("Selected Point: " + selectedPoint);
    console.log("hole.p3: "+hole.p3);
  }else if(hole.p3 != false && selectedPoint == 2){
    console.log("kjører")
    selectedPoint++;
    setCamera("3d");
    console.log("Selected Point: " + selectedPoint);
  }
}

disablePoint();

})

//--------------- TOUCH BUTTONS -------------------

const forwardArrow = document.getElementById("forwardArrow");
const revArrow = document.getElementById("revArrow");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

forwardArrow.addEventListener("touchstart", function(){
forward = true;
forwardArrow.style.filter = "brightness(0.8)";
})
forwardArrow.addEventListener("touchend", function(){
forward = false;
forwardArrow.style.filter = "brightness(1)";
})
revArrow.addEventListener("touchstart", function(){
backward = true;
forwardArrow.style.filter = "brightness(0.8)";
})
revArrow.addEventListener("touchend", function(){
backward = false;
forwardArrow.style.filter = "brightness(1)";
})
leftArrow.addEventListener("touchstart", function(){
left = true;
forwardArrow.style.filter = "brightness(0.8)";
})
leftArrow.addEventListener("touchend", function(){
left = false;
forwardArrow.style.filter = "brightness(1)";
})
rightArrow.addEventListener("touchstart", function(){
right = true;
forwardArrow.style.filter = "brightness(0.8)";
})
rightArrow.addEventListener("touchend", function(){
right = false;
forwardArrow.style.filter = "brightness(1)";
})




//---------------- HOLE ---------------------------

const tee0Btn = document.getElementById("tee0Btn");
const tee1Btn = document.getElementById("tee1Btn");
const tee2Btn = document.getElementById("tee2Btn");
const tee3Btn = document.getElementById("tee3Btn");

tee0Btn.addEventListener("mousedown", function(){
selectedTee = 0;
tee0Btn.classList.add("tee-active");
tee1Btn.classList.remove("tee-active");
tee2Btn.classList.remove("tee-active");
tee3Btn.classList.remove("tee-active");
setTee();
})

tee1Btn.addEventListener("mousedown", function(){
selectedTee = 1;
tee1Btn.classList.add("tee-active");
tee0Btn.classList.remove("tee-active");
tee2Btn.classList.remove("tee-active");
tee3Btn.classList.remove("tee-active");
setTee();
})

tee2Btn.addEventListener("mousedown", function(){
selectedTee = 2;
tee2Btn.classList.add("tee-active");
tee1Btn.classList.remove("tee-active");
tee0Btn.classList.remove("tee-active");
tee3Btn.classList.remove("tee-active");
setTee();
})

tee3Btn.addEventListener("mousedown", function(){
selectedTee = 3;
tee3Btn.classList.add("tee-active");
tee1Btn.classList.remove("tee-active");
tee2Btn.classList.remove("tee-active");
tee0Btn.classList.remove("tee-active");
setTee();
})

let viewNbr = 1;

const viewBtn = document.getElementById("viewBtn");
const viewIco = document.getElementById("viewIco");

const holeLengthTxt = document.getElementById("holeLengthTxt");

viewBtn.addEventListener("mousedown", function(){
if(viewNbr < 3){
  viewNbr++;
}else{
  viewNbr = 1
}
console.log(viewNbr);

if(viewNbr == 1){
  setCamera("3d");
}else if(viewNbr == 2){
  setCamera("2d");
}else if(viewNbr == 3){
  setCamera("cartview");
}


})

//------------- GOLF CART -------------------

let cameraView = "3d";
  
let forward = false;
let backward = false;
let left = false;
let right = false;

let leftPace = 100;
let rightPace = 100;

let pace = 40;
let revPace = 40;

let cartPosX,cartPosZ;

const fromTee = document.getElementById("fromTee");
const toPin = document.getElementById("toPin");
let fromTeeValue, toPinValue;

let teebox64;
let green;

document.onkeydown = checkDownKey;

function checkDownKey(e) {

e = e || window.event;

if (e.keyCode == '38') {  
  forward = true;
  distCont.style.opacity = 1;
}
else if (e.keyCode == '40') {
backward = true;
distCont.style.opacity = 1;
}
else if (e.keyCode == '37') {
left = true;
}
else if (e.keyCode == '39') {
right = true;
}

}

document.onkeyup = checkUpKey;

function checkUpKey(e) {

e = e || window.event;

if (e.keyCode == '38') {  
  forward = false;
}
else if (e.keyCode == '40') {
backward = false;
}
else if (e.keyCode == '37') {
left = false;
}
else if (e.keyCode == '39') {
 right = false;
}

}

let controls;

//-------------- Camera Animation ---------------

let play = false;

const playBtn = document.getElementById("play");

playBtn.addEventListener("mousedown", playAnim);

function playAnim(){
  if(!play){

    if(cameraView != "3d"){
        setCamera("3d");
        viewNbr = 1
        viewIco.src = "./icons/3d-ico.svg";

        
    //}else if(cameraView == "3d" && Math.round(camera.position.x) == hole.p0Cam[0] && Math.round(camera.position.y) == hole.p0Cam[1] && Math.round(camera.position.z) == hole.p0Cam[2]){
      play = true;
      playBtn.innerText = "||";
      //return;
    }

    

    startTrans();

    setTimeout(function(){
      camera.position.set(hole.p0Cam[0],hole.p0Cam[1],hole.p0Cam[2]+50);
      play = true;
      playBtn.innerText = "||";
    }, 300);
    
   
    
  }else{
    controls.enabled = true;
    play = false;
    playBtn.innerHTML = '<img style="height:16px; margin-top: 4px;" src="./icons/play-ico.png">';
  }
}

function startTrans(){
  whiteTrans.style.display = "block";
  whiteTrans.style.animationName = "transition";

  setTimeout(function(){
    whiteTrans.style.display = "none";
    whiteTrans.style.animationName = "none";
  }, 450);
}


//-------------- HOLE CODE ---------------

const holes = [
  {fillhole: NaN},
  { holeNr: 1,
    par: 5,
    index: 3,
    length: [475,520,551,581],
    pos2d: [0, 350, 0],
    anim: [2, 0.4, 0.0005],
    greenRadius: [15],
    p0: [-20,0,0],
    p0Cam: [35, 25, 155],
    p1: [0,0,-20],
    p1Cam: [20, 30, 100],
    p2: [-20,0,-120],
    p2Cam: [40, 50, -30],
    p3: [0,0,-25],
    p3Cam: [80, 75, -160],
    
  },
  { holeNr: 2,
    par: 3,
    index: 5,
    length: [475,520,551,581],
    pos2d: [0, 350, 0],
    anim: [2, 0.4, 0.0005],
    greenRadius: [15],
    p0: [-20,0,0],
    p0Cam: [35, 25, 155],
    p1: [false],
    p1Cam: [],
    p2: [false],
    p2Cam: [],
    
  }
];

let totalHoles = -1;

for(let i = 0; i < holes.length; i++){
totalHoles++;
}

console.log("Total Holes: " + totalHoles);




//Global Hole Index
let hole;

  // legg inn lengde!

function setHole(value,TeeValue){

  hole = holes[value];

  console.log("Hole Number: " + hole.holeNr);
  console.log("Selected Hole" + selectedHole)
  

  holeLengthTxt.innerText = `${hole.length[TeeValue]} M`;

  setInfo(selectedHole);

  LoadModels();

  

  if(hole.p1 == null){
    console.log(hole.p1)
    totalPoints = 1;
  }else if(hole.p2 == null){
    console.log(hole.p2)
    totalPoints = 2;
  }
  else{
    console.log(hole.p3)
    totalPoints = 3;
  }

disablePoint();

console.log("Total Points: " + totalPoints);

}

function setInfo(value){
if(language == "en"){
    infoTxtCont.innerHTML = holeInfo[value];
  }else if(language == "no"){
    infoTxtCont.innerHTML = hullInfo[value];
  }
}

setHole(selectedHole,selectedTee);


//THREE

const cvs = document.getElementById("cvs");

let scene = null,
  renderer = null,
  camera = null;
let aspectRatio = window.innerWidth / window.innerHeight;

function Init3DWorld() {
  // Set up your world scene
  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog(0xa0a0a0, 400, 1400);

  // Set up your scene light
  AddLights();

  // Setup Your scene camera
  camera = new THREE.PerspectiveCamera(48, aspectRatio, 2, 700);
  scene.add( camera );
  camera.position.set(hole.p0Cam[0], hole.p0Cam[1], hole.p0Cam[2]);


  // Setup your scene ground
  AddGroundPlane();


  // Set up your world renderer
  const world = {
    canvas: cvs,
    antialias: true,
  };

  
  renderer = new THREE.WebGLRenderer(world, {alpha: true});
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio(aspectRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //Needs to be on for shadows
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  
  if(window.innerWidth < 1000){
    //renderer.shadowMap.type = THREE.BasicShadowMap;
  }else{
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
  }
  renderer.toneMapping = THREE.CineonToneMapping;
  //renderer.toneMappingExposure = 1.4;

  //CONTROLS

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = 0;

  controls.enableDamping = true

  controls.dampingFactor = 0.15;
  
   
  //Sets new target for controls
  //controls.target = new THREE.Vector3(0,0,-20);

  //Limits camera roatation to not go underneath the ground
  controls.maxPolarAngle = Math.PI/2.1; 
  //Limits maximum zoom
  controls.maxDistance = 500;
  controls.update();
  controls.enableZoom = true;
  controls.zoomSpeed = 0.6;
  controls.panSpeed = 0.8;
  controls.rotateSpeed = 0.3;

  requestAnimationFrame(UpdateFrame);
}

function Resize(aWindow) {
  aspectRatio = window.innerWidth / window.innerHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(aWindow.innerWidth, aWindow.innerHeight);
}

function UpdateFrame() {
  renderer.render(scene, camera);
  requestAnimationFrame(UpdateFrame);
}

//iPad Pro screensize = 834 x 1195 px.



function AddLights() {
  const illumination = 1;
  let light; 

  light = new THREE.PointLight("#ffffff");
  
  light.position.set(-40, 150, 100);
  light.intensity = 1300;
  
  if(window.innerWidth < 1000){
    light.castShadow = false;
  }else{
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.normalBias = -0.01;
    light.shadow.radius = 10;
  }
  
  scene.add(light);

  const sphereSize = 10;
  let pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
  //scene.add( pointLightHelper );
  
  light = new THREE.AmbientLight( 0x404040, 12 ); // soft white light
  scene.add( light );

  /*

  OLD LIGHTING

  light = new THREE.DirectionalLight("#ffffff", illumination);
  light.position.set(0, 100, 400);
  light.shadow.normalBias = 2;
  light.shadow.mapSize.set(1024, 1024);
  light.castShadow = true;
  light.shadow.camera.top = 400;
  light.shadow.camera.bottom = -200;
  light.shadow.camera.left = -400;
  light.shadow.camera.right = 400;
  light.shadow.camera.far = 2000;
  scene.add(light);
  scene.add(new THREE.DirectionalLightHelper(light, 10, "#ff4400"));

  light = new THREE.AmbientLight( 0x404040, 14 ); // soft white light
  scene.add( light );

  */

}

function AddGroundPlane() {
  const plane = new THREE.PlaneBufferGeometry(2000, 2000);
  const matOption = { color: "#a6a6a6", depthWrite: false };
  const mat = new THREE.MeshPhongMaterial(matOption);
  const mesh = new THREE.Mesh(plane, mat);
  mesh.position.y = 0.001; // so we're above the ground slightly
  mesh.rotation.x = -Math.PI / 2;
  //mesh.receiveShadow = true;
  //scene.add(mesh);

  const grid = new THREE.GridHelper(2000, 20, "#000000", "#9a9a9a");
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  //scene.add(grid);
  //scene.add(new THREE.AxesHelper(200))

}

let range1;
let golfcart;
let leftWheel;
let rightWheel;
let pole;
let range2d;
let next;
let prev;

function LoadModels() {
  const loader = new GLTFLoader();
  loader.load(`hole${hole.holeNr}.gltf`, GLTFLoadDone);
}

function GLTFLoadDone(GLTFStructure) {
  GLTFStructure.scene.traverse(GLTFEachObject);
  scene.add(GLTFStructure.scene);
  setInterval(AnimateObjects, 33.3);//41.6 = 24fps, 33,3 = 30fps
  
}

function GLTFEachObject(aObject) {

  if(aObject.name == "CartBody"){
    golfcart = aObject;
    
  }

  if(aObject.name === "Glass"){
    aObject.material = new THREE.MeshPhysicalMaterial({side: THREE.DoubleSide});
    aObject.material.roughness = 0;
    aObject.material.color.set("#ADD8E6");
    aObject.material.ior = 5;
    aObject.material.transmission = 0.7;
    aObject.material.opacity = 1;
  }

  if(window.innerWidth > 834){
      if (aObject.isMesh) {
      aObject.castShadow = true;
      aObject.receiveShadow = true;
    } else if (aObject.isGroup) {
      aObject.castShadow = true;
    }
  }
  

  if(aObject.name == "pole"){
    pole = aObject;
  }

  if(aObject.name == "range2"){
    aObject.castShadow = false;
    aObject.receiveShadow = false;
    console.log(aObject);
  }
  if(aObject.name == "range1"){
    aObject.castShadow = false;
    aObject.receiveShadow = false;
    range1 = aObject;
    console.log(range1);
  }
  if(aObject.name == "Bunker" || aObject.name == "Rough" || aObject.name == "Fairway" || aObject.name == "Water" || aObject.name == "Green"){
    aObject.castShadow = false;
  }

  if(aObject.name == "LeftWheel" ){
    leftWheel = aObject;
  }
  if(aObject.name == "RightWheel" ){
    rightWheel = aObject;
  }

  if(aObject.name == "Teebox64"){
      teebox64 = aObject;
  }

  if(aObject.name == "Green"){
      green = aObject;
  }  
  
  if(aObject.name == "range2d"){
      aObject.castShadow = false;
      range2d = aObject;
      range2d.visible = false;
  } 

  if(aObject.name == "next"){
    next = aObject;
  }

  if(aObject.name == "prev"){
    next = aObject;
  }
}

function setCamera(view){

  if(view == "3d"){


    viewIco.src = "./icons/3d-ico.svg";
    whiteTrans.style.display = "block";
    whiteTrans.style.animationName = "transition";

    setTimeout(function(){
      cameraView = "3d";
      if(selectedPoint == 0){
        camera.position.set(hole.p0Cam[0], hole.p0Cam[1], hole.p0Cam[2]);
        camera.lookAt(hole.p0[0], hole.p0[1], hole.p0[2]);
        controls.target.set(hole.p0[0], hole.p0[1], hole.p0[2]);
      }
      if(selectedPoint == 1){
        camera.position.set(hole.p1Cam[0], hole.p1Cam[1], hole.p1Cam[2]);
        camera.lookAt(hole.p1[0], hole.p1[1], hole.p1[2]);
        controls.target.set(hole.p1[0], hole.p1[1], hole.p1[2]);
      }
      if(selectedPoint == 2){
        camera.position.set(hole.p2Cam[0], hole.p2Cam[1], hole.p2Cam[2]);
        camera.lookAt(hole.p2[0], hole.p2[1], hole.p2[2]);
        controls.target.set(hole.p2[0], hole.p2[1], hole.p2[2]);
      }
      if(selectedPoint == 3){
        camera.position.set(hole.p3Cam[0], hole.p3Cam[1], hole.p3Cam[2]);
        camera.lookAt(hole.p3[0], hole.p3[1], hole.p3[2]);
        controls.target.set(hole.p0[0], hole.p0[1], hole.p0[2]);
      }
      
      
      
      console.log("3D")
      controls.enabled = true;
      controls.enableRotate = true;
      toggle3dRanges(true);
      toggle2dRanges(false);
    }, 300);

    setTimeout(function(){
      whiteTrans.style.display = "none";
      whiteTrans.style.animationName = "none";
    }, 450);
    
  }else if(view == "2d"){

    viewIco.src = "./icons/2d-ico.svg";

    whiteTrans.style.display = "block";
    whiteTrans.style.animationName = "transition";

    setTimeout(function(){
      cameraView = "2d";
      camera.position.set(hole.pos2d[0],hole.pos2d[1],hole.pos2d[2]);
      camera.lookAt(0, 0, 0); 
      controls.target.set(0,0,0);
      console.log("2D")
      controls.enabled = true;
      controls.enableRotate = false;
      toggle3dRanges(false);
      toggle2dRanges(true);	
    }, 300);

    setTimeout(function(){
      whiteTrans.style.display = "none";
      whiteTrans.style.animationName = "none";
    }, 450);

  }else if(view == "cartview"){

    viewIco.src = "./icons/cart-ico.svg";

    whiteTrans.style.display = "block";
    whiteTrans.style.animationName = "transition";

    setTimeout(function(){
      controls.enabled = false;
      cameraView = "cartview";
      toggle3dRanges(true);
      toggle2dRanges(false);
    }, 300);

    setTimeout(function(){
      whiteTrans.style.display = "none";
      whiteTrans.style.animationName = "none";
    }, 450);
  }
}

setCamera("3d");

function toggle3dRanges(value){
  if(value){
    pole.visible = true;
    range1.visible = true;
  }else{
    pole.visible = false;
    range1.visible = false;
  }
}

function toggle2dRanges(value){
  if(value){
    range2d.visible = true;
  }else{
    range2d.visible = false;
  }
}

function setTee(){

}

function disablePoint(){

  if(selectedPoint == 0){
    prevPoint.classList.add("disable");
  }else{
    prevPoint.classList.remove("disable");
  }

  if(selectedPoint == totalPoints){
    nextPoint.classList.add("disable");
  }else{
    nextPoint.classList.remove("disable");
  }

}

disablePoint();

function disableHole(){
  if(selectedHole == 1){
    prevHole.classList.add("disable");
  }else{
    prevHole.classList.remove("disable");
  }

  if(selectedHole == totalHoles){
    nextHole.classList.add("disable");
  }else{
    nextHole.classList.remove("disable");
  }
}

disableHole();

const greenAlert = document.getElementById("greenAlert");

function AnimateObjects() {

  controls.update()

if(forward || backward){
  if(Math.sqrt((green.position.x-cartPosX)*(green.position.x-cartPosX) + (green.position.z-cartPosZ)*(green.position.z-cartPosZ)) < hole.greenRadius){
    greenAlert.style.display = "block";
  }else{
    greenAlert.style.display = "none";
  }

  if(Math.sqrt((next.position.x-cartPosX)*(next.position.x-cartPosX) + (next.position.z-cartPosZ)*(next.position.z-cartPosZ)) < 5){

    console.log("gayshit")
    
    startTrans();
    
      footerBar.classList.add("fadeOut");
      holeCont.classList.add("fadeOut");
      menuCont.classList.add("fadeOut");
    
      setTimeout(function(){
        selectedHole++;
        selectedPoint = 0;
        //setHole(selectedHole,selectedTee);
        hole = holes[selectedHole];
    
        //disableHole();
    
        console.log("Selected hole: " + selectedHole);
    
        sessionStorage.setItem("hole", `${selectedHole}`);
    
        window.location.href = "./courseguide.html";
      }, 200); 
  }


if(prev != undefined){
    
  if(Math.sqrt((prev.position.x-cartPosX)*(prev.position.x-cartPosX) + (prev.position.z-cartPosZ)*(prev.position.z-cartPosZ)) < 5){

    console.log("gayshit")
    
    startTrans();
    
      footerBar.classList.add("fadeOut");
      holeCont.classList.add("fadeOut");
      menuCont.classList.add("fadeOut");
    
      setTimeout(function(){
        selectedHole--;
        selectedPoint = 0;
        //setHole(selectedHole,selectedTee);
        hole = holes[selectedHole];
    
        //disableHole();
    
        console.log("Selected hole: " + selectedHole);
    
        sessionStorage.setItem("hole", `${selectedHole}`);
    
        window.location.href = "./courseguide.html";
      }, 200); 
  }
}

  if(Math.sqrt((0-cartPosX)*(0-cartPosX) + (0-cartPosZ)*(0-cartPosZ)) > 190){
    golfcart.rotateY(Math.PI/2);
  }
}
  if(play){
      if(camera.position.z > hole.anim[0]){
      camera.position.z -= hole.anim[1];
      camera.rotation.y += hole.anim[2];
      controls.enabled = false;
      camera.lookAt(camera.lookAt(green.position.x,green.position.y, green.position.z));
      }else{
        controls.enabled = true;
        controls.target = new THREE.Vector3(green.position.x,green.position.y,green.position.z);
        play = false;
        playBtn.innerHTML = '<img style="height:16px; margin-top: 4px;" src="./icons/play-ico.png">'
      }
  }

  //Forward
  if(forward){
    if(pace >= 4.5){
      pace = pace*0.85;
    }
    golfcart.translateZ(-(Math.PI/2)/pace);
  }else{
    if(pace < 40){
      pace = pace*1.06;
      golfcart.translateZ(-(Math.PI/2)/pace);
    }
  
  }

  //Reversed/Backwards
  if(backward){
    if(revPace >= 6){
      revPace = revPace*0.82;
    }
    
    golfcart.translateZ((Math.PI/2)/revPace);
  }else{
    if(revPace < 40){
      revPace = revPace*1.1;
      golfcart.translateZ((Math.PI/2)/revPace);
    } 
  }

  //Left
  if(left && (forward || backward)){
    if(leftPace >= 22){
      leftPace = leftPace*0.92;
    }
    golfcart.rotateY((Math.PI/2)/leftPace);
    if(leftWheel.rotation.y <= 0.8){
      leftWheel.rotation.y += 0.03;
      rightWheel.rotation.y += 0.03;
    }
    
  }else{
    if(!right){
        if(leftPace < 100){
          leftPace = leftPace*1.2;
          golfcart.rotateY((Math.PI/2)/leftPace);
        }
      if(leftWheel.rotation.y >= 0){
        leftWheel.rotation.y += -0.1;
        rightWheel.rotation.y += -0.1;
      }
    }
  }

  //Right
  if(right && (forward || backward)){
    if(rightPace >= 22){
      rightPace = rightPace*0.92;
    }

    golfcart.rotateY(-(Math.PI/2)/rightPace);
    if(leftWheel.rotation.y >= -0.8){
    leftWheel.rotation.y += -0.03;
    rightWheel.rotation.y += -0.03;
    }
  }else{
    if(!left){
      if(rightPace < 100){
          rightPace = rightPace*1.2;
          golfcart.rotateY(-(Math.PI/2)/rightPace);
        }
      if(leftWheel.rotation.y <= 0){
      leftWheel.rotation.y += 0.1;
      rightWheel.rotation.y += 0.1;
    }
    }
  }

  if(cameraView == "3d" || cameraView == "cartview"){
    range1.lookAt(camera.position);
  }
  

  if(cameraView == "cartview"){
    camera.lookAt(golfcart.position.x,golfcart.position.y+3,golfcart.position.z);
    camera.position.set(golfcart.position.x, golfcart.position.y + 4, golfcart.position.z + 18);
  }

  if(pace < 40 || revPace < 40 ){

    cartPosX = Math.round(golfcart.position.x);
    cartPosZ = Math.round(golfcart.position.z);

    function getDistance(x1, y1, x2, y2){

        let y = x2 - x1;
        let x = y2 - y1;

        return(Math.sqrt(x * x + y * y))*2.324;
  }
  
  fromTeeValue = getDistance(cartPosX, cartPosZ, teebox64.position.x, teebox64.position.z).toFixed(0);
  toPinValue = getDistance(cartPosX, cartPosZ, green.position.x, green.position.z).toFixed(0);
  
  fromTee.innerHTML = `<strong>From Tee:</strong> <span style="color: white;">${fromTeeValue} M </span>`;
  toPin.innerHTML = `<strong>To Pin:</strong> <span style="color: white;">${toPinValue} M </span>`;
  }

}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

Init3DWorld(cvs);