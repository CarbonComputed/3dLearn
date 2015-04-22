var container;
var camera, scene, renderer, manager;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var currentObject;
var sprite = sprite = THREE.ImageUtils.loadTexture( "lib/disc.png" );
$( document ).ready(function() {

    init();
    animate();
});


function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, 1000 / 1000, 1, 2000 );
    camera.fov *= 10;
  camera.updateProjectionMatrix();
    // camera.position.z = 100;
    // scene
    // console.log(controls);
    scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );
    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );
    // texture
    manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
    var texture = new THREE.Texture();
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) {
    };
    // model

    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 1000, 1000 );
    container.appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}

function buildModel(verts){


    var object, objects = [];
    var geometry, material;
    geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );


    material = new THREE.PointCloudMaterial( { size: 5, sizeAttenuation: false, map: sprite, transparent: true } );
    material.color.setHSL( 1.0, 0.3, 0.7 );

    particles = new THREE.PointCloud( geometry, material );
    particles.sortParticles = true;
    return particles;
}

function addObject(verts){
    console.log("Adding Object")
    // var loader = new THREE.OBJLoader( manager );
    // loader.load( src, function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {
    //             child.material.map = texture;
    //         }
    //     } );
    if(currentObject){
        scene.remove(currentObject);

    }
    currentObject = buildModel(verts);
    //currentObject.position.y = - 80;

    scene.add( currentObject );
    console.log("Object Added");
    // }, onProgress, onError );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = 1000 / 1000;
    camera.updateProjectionMatrix();
    renderer.setSize( 1000, 1000);
}
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.position = scene.position;
    camera.position.z = 200;
    console.log(scene.position);
    // camera.fov *= -70;
    // camera.lookAt( scene.position );
    renderer.render( scene, camera );
}