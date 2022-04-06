const canvas = document.getElementById("drawing-board");
const contxt = canvas.getContext("2d");
const color = document.getElementById("multi-color");
let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
let lines = document.querySelectorAll(".line");
lines = Array.from(lines);
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 150;

let isDrawing = false;
let select = "pencil";
let pencilSize = 1;
let pencilColor = "#000000";

let prevPosX = null;
let prevPosY = null;

clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        pencilColor = clr.dataset.code;
        contxt.strokeStyle = pencilColor;
        contxt.lineWidth = pencilSize;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor;
    });
});

lines.forEach(line => {
    line.addEventListener("click", () => {
        pencilSize = line.dataset.width;
        contxt.lineWidth = pencilSize;
        contxt.strokeStyle = pencilColor;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor;
    });
});
contxt.beginPath();

const startDrawing = (e) => {
    isDrawing = true;
    // canvas.style.cursor = 'url("https://img.icons8.com/ios/50/000000/pencil-tip.png"), auto';
    if (select != "pencil") {
        prevPosX = e.clientX;
        prevPosY = e.clientY-80;
    }
};
const draw = (e) => {
    if (prevPosX == null || prevPosY == null || !isDrawing) {
        prevPosX = e.clientX;
        prevPosY = e.clientY - 80;
        return
    }
    if (select == "rect") {
        return;
    } else {
        let currPosX = e.clientX;
        let currPosY = e.clientY - 80;
        // canvas.style.cursor = 'url("https://img.icons8.com/ios/50/000000/pencil-tip.png"), auto';
        contxt.beginPath();
        contxt.moveTo(prevPosX, prevPosY);
        contxt.lineTo(currPosX, currPosY);
        contxt.stroke();
        
        prevPosX = currPosX;
        prevPosY = currPosY;
    }
};
const stopDrawing = (e) => {
    isDrawing = false;
    if (select != "pencil") {
        contxt.beginPath();
        let currPosX = e.clientX;
        let currPosY = e.clientY;
        contxt.rect(prevPosX, prevPosY, currPosX-prevPosX, currPosY-80-prevPosY);
        contxt.stroke();
    }
    // canvas.style.cursor = 'pointer';
};

const saveImg = () => {
    let drawing = canvas.toDataURL("imag/png");
    let a = document.createElement("a");
    a.href = drawing;
    a.download = "painting.png";
    a.click();
    a.remove();
};
const erase = () => {
    contxt.strokeStyle = "#ffffff";
    contxt.lineWidth = 5;
    select = "eraser";
};
const pencil = () => {
    contxt.strokeStyle = pencilColor;
    contxt.lineWidth = pencilSize;
    select = "pencil";
};
const drawRect = () => {
    select = "rect";

};
document.getElementById("color-chooser").addEventListener("click", () => {
    color.click();
});
color.addEventListener("input", () => {
    pencilColor = color.value;
    contxt.strokeStyle = pencilColor;
});
document.querySelector(".eraser").addEventListener("click", erase);
document.querySelector(".pencil").addEventListener("click", pencil);
document.querySelector(".saveBtn").addEventListener("click", saveImg);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
