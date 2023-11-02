main();

//
// start here
//
function main() {
 // Holen Sie sich die Canvas-Elemente
const canvas = document.getElementById('canvas1');
const canvasTool = document.getElementById('canvas');

 const ctx = canvas.getContext("2d");

 const ctx2 = canvasTool.getContext("2d");
 let isDragging = false;
 let offsetX, offsetY;
 let draggedObject = false;

 const object = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  color: "blue",
 };
 const objects = [
  { x: 100, y: 100, width: 50, height: 50, color: "blue" },
  { x: 200, y: 200, width: 50, height: 50, color: "red" },
  { x: 0, y: 0, width: 50, height: 50, color: "yellow" },
  // Weitere Objekte hinzufügen
 ];


 /**
  *
  */
 function drawObject() {

  ctx.clearRect(0, 0, canvasTool.width, canvasTool.height);
  for (const obj of objects) {
   ctx.fillStyle = obj.color;
   ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }
 }

 function drawObjectTool() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.fillStyle = object.color;
  ctx2.fillRect(object.x, object.y, object.width, object.height);
 }

 canvas.addEventListener("mousedown", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  for (const obj of objects) {
   if (
       x >= obj.x &&
       x <= obj.x + obj.width &&
       y >= obj.y &&
       y <= obj.y + obj.height
   ) {
    isDragging = true;
    offsetX = x - obj.x;
    offsetY = y - obj.y;
    draggedObject = obj; // Merken Sie sich das gezogene Objekt
    break;
   }
  }
 });

 canvas.addEventListener("mousemove", (event) => {
  if (isDragging && draggedObject) {
   const x = event.clientX - canvas.getBoundingClientRect().left;
   const y = event.clientY - canvas.getBoundingClientRect().top;
   draggedObject.x = x - offsetX;
   draggedObject.y = y - offsetY;
   drawObject();
  }
 });

 canvas.addEventListener("mouseup", () => {
  isDragging = false;
  draggedObject = null; // Zurücksetzen des gezogenen Objekts
 });

// Die gleichen Event-Handler können auch auf andere Canvas-Elemente angewendet werden, wenn Sie mehrere haben.

 
 canvasTool.addEventListener("click", (event) => {
  drawObject();
 });



 drawObjectTool();

}
