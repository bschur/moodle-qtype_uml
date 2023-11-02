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

 function drawObjectTool() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.fillStyle = object.color;
  ctx2.fillRect(object.x, object.y, object.width, object.height);
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

 canvasTool.addEventListener("click", (event) => {
  drawObject();
 });
 canvas.addEventListener("mouseup", () => {
  isDragging = false;
 });


 drawObjectTool();

}
