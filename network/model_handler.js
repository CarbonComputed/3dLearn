var container;
var camera, scene, renderer, manager;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var R_WIDTH = 500;
var R_HEIGHT = 500;
var currentObject;
var sprite = sprite = THREE.ImageUtils.loadTexture( "lib/disc.png" );
$( document ).ready(function() {

    init();
    animate();
});


function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, R_HEIGHT / R_WIDTH, 1, 2000 );
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
        //console.log( item, loaded, total );
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
    renderer.setSize( R_WIDTH, R_HEIGHT );
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
    //console.log("Adding Object")
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
    //console.log("Object Added");
    // }, onProgress, onError );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = R_HEIGHT / R_WIDTH;
    camera.updateProjectionMatrix();
    renderer.setSize( R_WIDTH, R_HEIGHT);
}
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}
//
function animate() {
    render();
    requestAnimationFrame( animate );

}
function render() {
    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    if (currentObject){
        var yAxis = new THREE.Vector3(0,1,0);

        rotateAroundWorldAxis(currentObject, yAxis, (Math.PI / 180) * 10);

    }
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.position = scene.position;
    camera.position.z = 200;
    // camera.fov *= -70;
    // camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}