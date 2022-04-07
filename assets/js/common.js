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
        [prevPosX, prevPosY] = getCords(e);
    }
};
const draw = (e) => {
    if (prevPosX == null || prevPosY == null || !isDrawing) {
        [prevPosX, prevPosY] = getCords(e);
        return
    }
    if (select == "rect") {
        return;
    } else {
        let [currPosX, currPosY] = getCords(e);
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
        let [currPosX, currPosY] = getCords(e);
        contxt.rect(prevPosX, prevPosY, currPosX - prevPosX, currPosY - prevPosY);
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
const getCords = (e) => {
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY - 80;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        x = e.clientX;
        y = e.clientY - 80;
    }
    return [x, y];
}
document.querySelector(".eraser").addEventListener("click", erase);
document.querySelector(".pencil").addEventListener("click", pencil);
document.querySelector(".saveBtn").addEventListener("click", saveImg);
if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
    // alert("touch");
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
} else {
    // alert("No touch");
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
}
