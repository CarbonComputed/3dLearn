
var WIDTH = 32;
var HEIGHT = 32;
var CHANNELS = 3;
var N_BATCHES = 2;
var N_INPUT = 10;
var N_OUTPUT = 1;

var N_TEST_IN = 2;
var N_TEST_BATCHES = 1;

var N_VERTICES = 100;

var load_image = function(src, fn){
  var img = new Image();
  img.width = WIDTH;
  img.height = HEIGHT;
  img.onload = function(){
      // document.getElementById('wrap').appendChild(img);
      fn(img);
  }
  img.src = src;
}

var load_data = function(img){
      var context = document.createElement('canvas').getContext('2d');
      context.drawImage(img, 0, 0);
      data = context.getImageData(0, 0, img.width, img.height).data;
      return data;
}


function resized(img, width, height) {

    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL();
}

var create_vol = function(data){
  var vol = new convnetjs.Vol(WIDTH,HEIGHT,CHANNELS,0.0);
  for(var i = 0; i < HEIGHT;i++){
    for(var j = 0; j < WIDTH;j++){
      for(var c = 0;c < CHANNELS;c++){
          var offset = (j*4) + (WIDTH * 4 * i);
          vol.set(j,i,c,(data[offset+c]/255.0));
      }
    }
  }
  return vol;
}

var create_vol_cifar = function(data){
  var vol = new convnetjs.Vol(WIDTH,HEIGHT,CHANNELS,0.0);
  var size = (HEIGHT*WIDTH);
  for(var i = 0; i < HEIGHT;i++){
    for(var j = 0; j < WIDTH;j++){
      var chan = 0;
      for(var c = 0;c < CHANNELS * size;c+=size){
          var offset = (i*WIDTH) + j;
          vol.set(j,i,chan,(data[offset+c]/255.0));
          chan += 1;
      }
    }
  }
  vol.label = data[data.length-1];
  return vol;
}

var load_input = function(testing, fn) {
  var dir = testing ? "testing" : "training";
  var nbatches;
  var ninput;
  if(testing){
    dir = "testing";
    ninput = N_TEST_IN;
    nbatches = N_TEST_BATCHES;
  }
  else{
    dir = "training";
    ninput = N_INPUT;
    nbatches = N_BATCHES;
  }
  var data = new Array(nbatches);
  var loaded = 0;
  for(var j = 0;j < nbatches;j++){
    for(var i = 0;i < ninput;i++){
       (function(batch,index){
        load_image("data/"+dir+"/"+batch+"/X/"+index+"-000.png", function(img){
          load_image(resized(img, WIDTH, HEIGHT), function(img){
                var vol = create_vol(load_data(img));
                if(!data[batch]){
                  data[batch] = [];
                }
                data[batch].push(vol);
                loaded += 1;
                if(loaded == ninput * nbatches){
                  console.log(data[batch].length, "Images Loaded");
                  fn(data);
                }
          });
        });
      }(j,i));
    }
  }
}

var cifar_load = function(split, fn){
  var dir = "/data/training/cifar-1/cifar-10-1";
  var training = new Array();
  var testing = new Array();
  training.push([]);
  testing.push([]);
  var currCount = 0;
  Papa.parse(dir, {
    download: true,
    worker: true,
    delimiter : ",",
    step: function(results, parser) {
        var data = results.data;
        var vol = create_vol_cifar(results.data[0]);
        if(Math.random() > split){
          training[0].push(vol);
        }
        else{
          testing[0].push(vol);
        }
        if(currCount > 250){
          currCount = 0;
          fn(training, testing);
          parser.abort();

        }
        currCount += 1;
      },


  });

}

var flatten = function(verts){
  var flattened = [];
  for(var i = 0;i < verts.length;i++){
    for(var j = 0;j < verts[i].length;j++){
      flattened.push(verts[i][j]);
    }
  }
  return flattened;
}

function getRandomSubarray(arr, size) {

    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

var load_model_data = function(objText){
  var obj = {};
  var vertexMatches = objText.match(/^v( -?\d+(\.\d+)?){3}$/gm);
  if (vertexMatches)
  {
      obj.vertices = vertexMatches.map(function(vertex)
      {
          var vertices = vertex.split(" ");
          vertices.shift();
          var finalV = [];
          for(var i = 0;i < 3;i++){
            var v1 = parseInt(vertices[i]);
            finalV.push(v1);
          }
          return finalV;
      });
  }
  return flatten(getRandomSubarray(obj.vertices, N_VERTICES));
}

var load_output = function(fn){
  var data = new Array(N_BATCHES);
  var loaded = 0;
  for(var j = 0;j < N_BATCHES;j++){
    for(var i = 0;i < N_OUTPUT;i++){
       (function(batch,index){
          $.get("data/training/"+batch+"/Y/"+index+"-000.obj", function(obj) {
            var out = load_model_data(obj);
            if(!data[batch]){
              data[batch] = [];
            }
            data[batch].push(out);
            loaded += 1;
            if(loaded == N_OUTPUT * N_BATCHES){
              console.log("Models Loaded",data);
              fn(data);
            }
          });


      }(j,i));
    }
  }
}

var cifar_load_output = function(fn){
  var nclasses = 10;

  var data = new Array(1);
  var loaded = 0;
    for(var i = 0;i < nclasses;i++){
       (function(index){
          $.get("data/training/cifar-1"+"/Y/"+index+"/"+index+"-000.obj", function(obj) {
            var out = load_model_data(obj);
            if(!data[0]){
              data[0] = new Array(10);
            }
            data[0][index] = out;
            loaded += 1;
            if(loaded == nclasses){
              console.log("Models Loaded",data);
              fn(data);
            }
          });
      
    }(i));
  }
}


function to_grayscale(canvas){
  var imgData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height)
  for (var i=0;i<imgData.data.length;i+=4)
  {
    var brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
    imgData.data[i+0]=255 - brightness;
    imgData.data[i+1]=255 - brightness;
    imgData.data[i+2]=255 - brightness;
  }
  canvas.getContext("2d").putImageData(imgData, 0, 0);
}
