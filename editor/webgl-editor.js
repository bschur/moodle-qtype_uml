main();

/**
 * start point
 */
function main() {
 // get canvas elements
 const canvas = document.getElementById('canvasEditor');
 const canvasTool = document.getElementById('canvasTool');
 const ctx = canvas.getContext("2d");
 const ctx2 = canvasTool.getContext("2d");

 //set responsive size for canvas
 canvas.width = canvas.parentElement.clientWidth;
 canvas.height = canvas.parentElement.clientHeight
 canvasTool.width = canvasTool.parentElement.clientWidth;
 canvasTool.height = canvasTool.parentElement.clientHeight;

 let offsetX, offsetY;
 let draggedObject = null;

 const objects = [];

 /**
  * Draw all instances in the Editor
  */
 function drawObject() {
  ctx.clearRect(0, 0, canvasTool.width, canvasTool.height);
  for (const obj of objects) {
   ctx.fillStyle = obj.color;
   ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }
 }

 /**
  * Draw a instance for each object in the Toolbox
  */
 function drawObjectTool() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.fillStyle = "blue";
  ctx2.fillRect(100, 100, 50, 50);
 }

 function findTopObject(x, y) {
  for (let i = objects.length - 1; i >= 0; i--) {
   const obj = objects[i];
   if (
       x >= obj.x &&
       x <= obj.x + obj.width &&
       y >= obj.y &&
       y <= obj.y + obj.height
   ) {
    return obj;
   }
  }
  return null; // No object found
 }

 /**
  * Save dragged object
  */
 canvas.addEventListener("mousedown", (event) => {
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  draggedObject = findTopObject(x, y);

  if (draggedObject) {
   offsetX = x - draggedObject.x;
   offsetY = y - draggedObject.y;
  }
 });

 /**
  * refresh Editor for every mousemove
  */
 canvas.addEventListener("mousemove", (event) => {
  if (draggedObject) {
   const x = event.clientX - canvas.getBoundingClientRect().left;
   const y = event.clientY - canvas.getBoundingClientRect().top;
   draggedObject.x = x - offsetX;
   draggedObject.y = y - offsetY;
   objects[draggedObject.id - 1] = draggedObject;
   drawObject();
  }
 });

 /**
  * save location of dragged object
  */
 canvas.addEventListener("mouseup", () => {
  objects[draggedObject.id] = draggedObject;
  draggedObject = null;
 });

 /**
  * Draw a instance of a clickt object (in Toolbox) on the editor
  */
 canvasTool.addEventListener("click", (event) => {
  const obj = {
   id: objects.length + 1,
   x: 100,
   y: 100,
   width: 50,
   height: 50,
   color: "blue",
  };
  objects.push(obj);
  drawObject();
 });

 drawObjectTool();

}
