
"use strict";

var ModelViewer = ModelViewer || {}; 


ModelViewer.Model = function(container){
    this.container = container;
    this.camera = this.scene = this.renderer = this.manager = null;
    this.mouseX = 0; 
    this.mouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.width = container.width() || 500;
    this.height = container.height() || 500;
    this.currentObject = null;;

    this.rotWorldMatrix = null;
    this.rotObjectMatrix = null;
    this.sprite = THREE.ImageUtils.loadTexture( "lib/disc.png" );
}





ModelViewer.Model.prototype.init = function() {
    this.camera = new THREE.PerspectiveCamera( 45, this.height / this.width, 1, 2000 );
    this.camera.fov *= 10;
    this.camera.updateProjectionMatrix();
    // camera.position.z = 100;
    // scene
    // console.log(controls);
    this.scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight( 0x101030 );
    this.scene.add( ambient );
    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    this.scene.add( directionalLight );
    // texture
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function ( item, loaded, total ) {
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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.width, this.height );
    this.container.append( this.renderer.domElement );
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    //
    window.addEventListener( 'resize', this.onWindowResize, false );
}

ModelViewer.Model.prototype.buildModel = function(verts){


    var object, objects = [];
    var geometry, material;
    geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );


    material = new THREE.PointCloudMaterial( { size: 5, sizeAttenuation: false, map: this.sprite, transparent: true } );
    material.color.setHSL( 1.0, 0.3, 0.7 );

    var particles = new THREE.PointCloud( geometry, material );
    particles.sortParticles = true;
    return particles;
}

ModelViewer.Model.prototype.addObject = function(verts){
    //console.log("Adding Object")
    // var loader = new THREE.OBJLoader( manager );
    // loader.load( src, function ( object ) {
    //     object.traverse( function ( child ) {
    //         if ( child instanceof THREE.Mesh ) {
    //             child.material.map = texture;
    //         }
    //     } );
    if(this.currentObject){
        this.scene.remove(this.currentObject);

    }
    this.currentObject = this.buildModel(verts);
    //currentObject.position.y = - 80;

    this.scene.add( this.currentObject );
    //console.log("Object Added");
    // }, onProgress, onError );
}

ModelViewer.Model.prototype.onWindowResize = function() {
    this.height = this.container.height();
    this.width = this.container.width();
    camera.aspect = this.height / this.width;
    camera.updateProjectionMatrix();
    renderer.setSize( this.width, this.height);
}

ModelViewer.Model.prototype.onDocumentMouseMove = function( event ) {
    //mouseX = ( event.clientX - this.windowHalfX ) / 2;
    //mouseY = ( event.clientY - this.windowHalfY ) / 2;
}
    //
ModelViewer.Model.prototype.animate = function() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));

}

ModelViewer.Model.prototype.render = function() {
        // camera.position.x += ( mouseX - camera.position.x ) * .05;
    if (this.currentObject){
        var yAxis = new THREE.Vector3(0,1,0);

        this.rotateAroundWorldAxis(this.currentObject, yAxis, (Math.PI / 180) * 10);

    }
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    // this.camera.position = this.scene.position;
    this.camera.position.z = 200;
    // camera.fov *= -70;
    // camera.lookAt( scene.position );
    this.renderer.render( this.scene, this.camera );
}

    // Rotate an object around an arbitrary axis in object space
ModelViewer.Model.prototype.rotateAroundObjectAxis = function(object, axis, radians) {
    this.rotObjectMatrix = new THREE.Matrix4();
    this.rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(this.rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

    // Rotate an object around an arbitrary axis in world space       
ModelViewer.Model.prototype.rotateAroundWorldAxis = function(object, axis, radians) {
    this.rotWorldMatrix = new THREE.Matrix4();
    this.rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    this.rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix = this.rotWorldMatrix;

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}


