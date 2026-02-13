const canvas = document.getElementById("canvas");
canvas.width = 170*2;
canvas.height = 125*2;
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "black";
ctx.lineWidth = 5;
ctx.lineCap = "round";

let isDrawing = false;
let lineWidth = 5;

canvas.addEventListener("mousedown", (event) => {
    // console.log("mousedown");
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
    isDrawing = true;
});

canvas.addEventListener("mousemove", (event) => {
    // console.log("mousemove");
    if (isDrawing) {
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    } else {
        return;
    }
});

canvas.addEventListener("mouseup", (event) => {
    // console.log("mouseup");
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.closePath();
    isDrawing = false;
});




// https://www.youtube.com/watch?v=mRDo-QXVUv8x
// https://codepen.io/javascriptacademy-stash/pen/porpeoJ