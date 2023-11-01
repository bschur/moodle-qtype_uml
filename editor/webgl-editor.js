main();

//
// start here
//
function main() {
 // Holen Sie sich die Canvas-Elemente
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const gl1 = canvas1.getContext('webgl');
const gl2 = canvas2.getContext('webgl');

 // Only continue if WebGL is available and working
 if (gl1 === null) {
  alert(
    "Unable to initialize WebGL. Your browser or machine may not support it.",
  );
  return;
}

// Zeichnen Sie etwas auf canvas1
gl2.clearColor(0.0, 0.0, 0.0, 1.0);
gl2.clear(gl2.COLOR_BUFFER_BIT);



// Hier können Sie WebGL-Objekte auf canvas2 zeichnen



 


}
