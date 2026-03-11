
// set card
var params = new URLSearchParams(window.location.search);
var card = params.get("card");
if (card == null) {
    card = "Red-Strike";
};
var cardURL = "data/art/" + card.replaceAll(" ", "") + ".png"
document.getElementById("real-card").src = cardURL;

document.getElementById("results").style.display = "none";

// drawing
const canvas = document.getElementById("drawing-canvas");
canvas.width = 250;
canvas.height = 190;
const offsetLeft = canvas.offsetLeft;
const offsetTop = canvas.offsetTop;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.strokeStyle = "rgb(141, 31, 10)";
ctx.lineWidth = 5;
ctx.lineCap = "round";

let isDrawing = false;
let lineWidth = 5;

canvas.addEventListener("mousedown", (event) => {
    ctx.beginPath();
    ctx.moveTo(event.clientX - offsetLeft, event.clientY - offsetTop);
    isDrawing = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) {
        ctx.lineTo(event.clientX - offsetLeft, event.clientY - offsetTop);
        ctx.stroke();
    }
});

document.body.addEventListener("mouseup", (event) => {
    ctx.lineTo(event.clientX - offsetLeft, event.clientY - offsetTop);
    ctx.stroke();
    ctx.closePath();
    isDrawing = false;
    ctx.beginPath();
});

// colour picker
var picker = document.getElementById("picker");
picker.addEventListener("colorchange", (event) => {
    if (event.detail != null && "value" in event.detail) {
        var newColourValue = event.detail.value.coords;
        ctx.strokeStyle =`hsl(${newColourValue[0]} ${newColourValue[1]} ${newColourValue[2]})`;
    }
});

// thickness slider
var thicknessSlider = document.getElementById("thickness");
var thicknessDisplay = document.getElementById("thickness-display");
thicknessSlider.value = 5;
thicknessSlider.addEventListener("input", (event) => {
    var thicknessValue = event.target.value;
    ctx.lineWidth = thicknessValue;
    thicknessDisplay.setAttribute("r", thicknessValue / 2)
});
picker.addEventListener("colorchange", (event) => {
    if (event.detail != null && "value" in event.detail) {
        var newColourValue = event.detail.value.coords;
        thicknessDisplay.setAttribute("fill", `hsl(${newColourValue[0]} ${newColourValue[1]} ${newColourValue[2]})`);
    }

})


// scoring

function reshapeImageData (data) {
    var pixelData = data.data;
    var newArray = [];
    for (i = 0; i < pixelData.length; i += 4) {
        newArray.push([pixelData[i], pixelData[i+1], pixelData[i+2], pixelData[i+3]])
    };
    return newArray;
};

function colourDistance (col1, col2, space="lab") {
    var col1Obj = new Color("srgb", col1.slice(0, 3));
    var col2Obj = new Color("srgb", col2.slice(0, 3));
    return Color.distance(col1Obj, col2Obj, space);
};

function submit () {
    console.log("submtited");
    canvas.toBlob((blob) => {
        // copy canvas to new img
        const drawnCardURL = URL.createObjectURL(blob);
        document.getElementById("drawn-card").src = drawnCardURL;
    });

    // drawn card
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height, {colorSpace: "srgb"});
    var pixelData = reshapeImageData(imageData);
    
    // real card
    var canvasReal = document.createElement("canvas");
    canvasReal.id = "canvasReal";
    var ctxReal = canvasReal.getContext("2d");
    var imgReal = document.getElementById("real-card");
    canvasReal.width = imgReal.width;
    canvasReal.height = imgReal.height;
    ctxReal.drawImage(imgReal, 0, 0);
    document.body.prepend(canvasReal);
    var imageDataReal = ctxReal.getImageData(0, 0, canvasReal.width, canvasReal.height, {colorSpace: "srgb"});
    var pixelDataReal = reshapeImageData(imageDataReal);

    // compare pixels > get colour distance (0 = same colour)
    var totalDist = 0;
    var pixels = 0;
    for (i = 0; i < pixelData.length; i++) {
        if (pixelDataReal[i][3] == 255) { // ignore if transparent on real card (outside art frame)
            totalDist += colourDistance(pixelData[i], pixelDataReal[i]);
            pixels += 1;
        };
    };
    
    // const worstDist = 9000; // black vs white in lab
    const worstDist = 5000;
    
    var meanDist = totalDist / pixels;
    console.log(meanDist);
    var accuracy = 100 - ((meanDist / worstDist) * 100);
    accuracy = Math.max(0, accuracy);

    document.getElementById("score-value").innerText = accuracy.toFixed(2);

    document.getElementById("drawing").style.display = "none";
    document.getElementById("results").style.display = "block";



}

// refs
// https://www.youtube.com/watch?v=mRDo-QXVUv8x
// https://codepen.io/javascriptacademy-stash/pen/porpeoJ
// https://slaythespire.wiki.gg/images/Red-Thunderclap-Art.png
// https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c