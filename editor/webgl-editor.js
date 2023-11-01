main();

//
// start here
//
function main() {
 // Holen Sie sich die Canvas-Elemente
const canvas = document.getElementById('canvas1');

//const gl = canvas.getContext('webgl');

// Zeichnen Sie etwas auf canvas1
 //gl.clearColor(1.0, 1.0, 0.0, 1.0);
 //gl.clear(gl2.COLOR_BUFFER_BIT);



 const ctx = canvas.getContext("2d");
 let isDragging = false;
 let offsetX, offsetY;

 const object = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  color: "blue",
 };

 function drawObject() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = object.color;
  ctx.fillRect(object.x, object.y, object.width, object.height);
 }

 canvas.addEventListener("mousedown", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  if (
      x >= object.x &&
      x <= object.x + object.width &&
      y >= object.y &&
      y <= object.y + object.height
  ) {
   isDragging = true;
   offsetX = x - object.x;
   offsetY = y - object.y;
  }
 });

 canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
   const x = event.clientX - canvas.getBoundingClientRect().left;
   const y = event.clientY - canvas.getBoundingClientRect().top;
   object.x = x - offsetX;
   object.y = y - offsetY;
   drawObject();
  }
 });

 canvas.addEventListener("mouseup", () => {
  isDragging = false;
 });

 drawObject();








 


}
