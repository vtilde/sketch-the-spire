
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
        console.log(`color(--hsv ${newColourValue[0]} ${newColourValue[1]}% ${newColourValue[2]}%)`);
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
    console.log(thicknessValue);
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

function colourDifference (col1, col2) {
    return Math.sqrt(
        ((col1[0] - col2[0]) ** 2) +
        ((col1[1] - col2[1]) ** 2) +
        ((col1[2] - col2[2]) ** 2)
    );
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
    var ctxReal = canvasReal.getContext("2d");
    var imgReal = document.getElementById("real-card");
    canvasReal.width = imgReal.width;
    canvasReal.height = imgReal.height;
    ctxReal.drawImage(imgReal, 0, 0);
    var imageDataReal = ctxReal.getImageData(0, 0, canvasReal.width, canvasReal.height, {colorSpace: "srgb"});
    var pixelDataReal = reshapeImageData(imageDataReal);

    // compare pixels
    var totalScore = 0;
    var pixels = 0;
    for (i = 0; i < pixelData.length; i++) {
        if (pixelDataReal[i][3] == 255) { // ignore if transparent on real card (outside border)
            if (i < 10) {
                console.log(pixelData[i], pixelDataReal[i]);
                console.log(colourDifference(pixelData[i], pixelDataReal[i]));
            }
            totalScore += colourDifference(pixelData[i], pixelDataReal[i]);
            pixels += 1;
        };
    };
    var finalScore = totalScore / pixels;

    console.log(totalScore);
    console.log(pixels);
    console.log(finalScore);

    document.getElementById("drawing").style.display = "none";
    document.getElementById("results").style.display = "block";



}

// refs
// https://www.youtube.com/watch?v=mRDo-QXVUv8x
// https://codepen.io/javascriptacademy-stash/pen/porpeoJ
// https://slaythespire.wiki.gg/images/Red-Thunderclap-Art.png
// https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c