const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");
const color = document.getElementById("multi-color");
const coord = document.querySelector(".coordinates");
const sizewh = document.querySelector(".size-wh");
let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
let lines = document.querySelectorAll(".line");
lines = Array.from(lines);
let ispolygon = false;
let polygonSt = [];
const shapes = ['line', 'rectangle', 'ellipse', 'polygon', 'triangle', 'right-triangle', 'diamond'];
let isDrawing = false;
let select = "pencil";
let pencilSize = 1;
let eraserSize = 5;
let pencilColor = "#000000";
let canvasColor = "#ffffff";
let prevPosX = null;
let prevPosY = null;
context.lineCap = "round";

clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        pencilColor = clr.dataset.code;
        context.strokeStyle = pencilColor;
        context.lineWidth = pencilSize;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor;
    });
});

lines.forEach(line => {
    line.addEventListener("click", () => {
        pencilSize = line.dataset.width;
        context.lineWidth = pencilSize;
        context.strokeStyle = pencilColor;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor;
    });
});
context.beginPath();

const startDrawing = (e) => {
    isDrawing = true;
    // canvas.style.cursor = 'url("https://img.icons8.com/ios/50/000000/pencil-tip.png"), auto';
    if (ispolygon) {
        return;
    }
    if (shapes.includes(select)) {
        [prevPosX, prevPosY] = getCords(e);
    }
};
const draw = (e) => {
    let [x, y] = getCords(e);
    coord.innerHTML = `(${parseFloat(x).toFixed(2)},${parseFloat(y).toFixed(2)}px)`;
    if (prevPosX == null || prevPosY == null || !isDrawing) {
        [prevPosX, prevPosY] = getCords(e);
        return
    }
    if (shapes.includes(select)) {
        return;
    } else {
        let [currPosX, currPosY] = getCords(e);
        // canvas.style.cursor = 'url("https://img.icons8.com/ios/50/000000/pencil-tip.png"), auto';
        context.beginPath();
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(prevPosX, prevPosY);
        context.lineTo(currPosX, currPosY);
        context.stroke();
        prevPosX = currPosX;
        prevPosY = currPosY;
    }
};
const stopDrawing = (e) => {
    isDrawing = false;
    if (shapes.includes(select)) {
        context.beginPath();
        context.lineCap = "round";
        context.lineJoin = "round";
        let [currPosX, currPosY] = getCords(e);
        switch (select) {
            case 'rectangle':
                drawRect(currPosX, currPosY);
                break;
            case 'ellipse':
                drawCir(currPosX, currPosY);
                break;
            case 'line':
                drawLine(currPosX, currPosY);
                break;
            case 'polygon':
                drawPoly(currPosX, currPosY);
                break;
            case 'triangle':
                drawTri(currPosX, currPosY);
                break;
            case 'right-triangle':
                drawRiTri(currPosX, currPosY);
                break;
            case 'diamond':
                drawDiamond(currPosX, currPosY);
                break;
        }
        context.stroke();
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
    context.strokeStyle = canvasColor;
    context.lineWidth = eraserSize;
    select = "eraser";
};
const pencil = () => {
    updatePencil();
    select = "pencil";
};
const drawRect = (currPosX, currPosY) => {
    context.rect(prevPosX, prevPosY, currPosX - prevPosX, currPosY - prevPosY);
};
const drawCir = (currPosX, currPosY) => {
    let cx = (prevPosX + currPosX) / 2;
    let cy = (prevPosY + currPosY) / 2;
    let rx = (currPosX - prevPosX) / 2;
    let ry = (currPosY - prevPosY) / 2;
    context.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, degToRad(0), degToRad(360), false);
    // context.arc(prevPosX, prevPosY, currPosX - prevPosX, degToRad(0), degToRad(360), false);
};
const drawLine = (currPosX, currPosY) => {
    context.moveTo(prevPosX, prevPosY);
    context.lineTo(currPosX, currPosY);
}
const drawPoly = (currPosX, currPosY) => {
    if (currPosX - polygonSt[0] <= 2 && currPosY - polygonSt[1] <= 2) {
        ispolygon = false;
        polygonSt = [];
        drawLine(currPosX, currPosY);
        return;
    }
    if (!ispolygon) {
        ispolygon = true;
        polygonSt = [prevPosX, prevPosY];
    }
    drawLine(currPosX, currPosY);
    prevPosX = currPosX;
    prevPosY = currPosY;
    isDrawing = true;
}
const drawTri = (currPosX, currPosY) => {
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
    let midX = (prevPosX + currPosX) / 2;
    context.beginPath();
    context.moveTo(prevPosX, currPosY);
    context.lineTo(currPosX, currPosY);
    context.lineTo(midX, prevPosY);
    context.closePath();
};
const drawRiTri = (currPosX, currPosY) => {
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
    }
    if (prevPosX > currPosX) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
    context.beginPath();
    context.moveTo(prevPosX, prevPosY);
    context.lineTo(prevPosX, currPosY);
    context.lineTo(currPosX, currPosY);
    context.closePath();
};
const drawDiamond = (currPosX, currPosY) => {
    let midX = (prevPosX + currPosX) / 2;
    let midY = (prevPosY + currPosY) / 2;
    context.beginPath();
    context.moveTo(prevPosX, midY);
    context.lineTo(midX, currPosY);
    context.lineTo(currPosX, midY);
    context.lineTo(midX, prevPosY);
    context.closePath();
};
document.getElementById("color-chooser").addEventListener("click", () => {
    color.click();
});
color.addEventListener("input", () => {
    pencilColor = color.value;
    context.strokeStyle = pencilColor;
    context.lineWidth = pencilSize;
    document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor;
});
const setSize = () => {
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 200;
    sizewh.innerHTML = `${canvas.width} x  ${canvas.height}px`;
}
const getCords = (e) => {
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.touches[0] || e.changedTouches[0];
        x = touch.clientX - canvas.offsetLeft;
        y = touch.clientY - canvas.offsetTop;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;
    }
    return [x, y];
}
const degToRad = (degrees) => {
    return degrees * Math.PI / 180;
}
const updatePencil = () => {
    context.strokeStyle = pencilColor;
    context.lineWidth = pencilSize;
    ispolygon = false;
    isDrawing = false;
}
const reset = () => {
    prevPosX = prevPosY = null;
    isDrawing = false;
    ispolygon = false;
    setSize();
    context.strokeStyle = pencilColor;
    context.lineWidth = pencilSize;
}
document.querySelector(".clear").addEventListener("click", reset);
document.querySelector(".pencil").addEventListener("click", pencil);
document.querySelector(".eraser").addEventListener("click", erase);
document.querySelector(".sline").addEventListener("click", () => { select = 'line'; updatePencil(); });
document.querySelector(".rectangle").addEventListener("click", () => { select = 'rectangle'; updatePencil(); });
document.querySelector(".polygon").addEventListener("click", () => { select = 'polygon'; updatePencil(); });
document.querySelector(".ellipse").addEventListener("click", () => { select = 'ellipse'; updatePencil(); });
document.querySelector(".triangle").addEventListener("click", () => { select = 'triangle'; updatePencil(); });
document.querySelector(".right-triangle").addEventListener("click", () => { select = 'right-triangle'; updatePencil(); });
document.querySelector(".diamond").addEventListener("click", () => { select = 'diamond'; updatePencil(); });
document.querySelector(".saveBtn").addEventListener("click", saveImg);
if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
} else {
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
}
setSize();
// addEventListener('resize', () => {
//     context.save();
//     canvas.width = innerWidth - 50;
//     canvas.height = innerHeight - 150;
//     context.restore();
// });
canvas.addEventListener("mouseout", () => { coord.innerHTML = ""; });
// canvas.onwheel = (e) => {
//     let factor = 1.5;
//     let [x, y] = getCords(e);
//     context.translate(x, y);
//     context.scale(factor, factor);
//     context.translate(-x, -y);
// }