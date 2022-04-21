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
const shapes = ['line', 'rectangle', 'ellipse', 'polygon', 'triangle', 'right-triangle', 'diamond', 'pentagon', 'hexagon', 'arrow-right', 'arrow-left', 'arrow-top', 'arrow-bottom'];
let isDrawing = false;
let select = "pencil";
let pencilSize = 1;
let eraserSize = 5;
let pencilColor = "#000000";
let secondaryColor = "#ffffff";
let press = 0;
let canvasColor = "#ffffff";
let prevPosX = null;
let prevPosY = null;
context.lineCap = "round";

clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        pencilColor = clr.dataset.code;
        context.strokeStyle = pencilColor;
        context.lineWidth = pencilSize;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
    });
});
clrs.forEach(clr => {
    clr.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        secondaryColor = clr.dataset.code;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
    });
});
lines.forEach(line => {
    line.addEventListener("click", () => {
        pencilSize = line.dataset.width;
        context.lineWidth = pencilSize;
        context.strokeStyle = pencilColor;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
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
    e.preventDefault();
    context.strokeStyle = (e.buttons == 2) ? secondaryColor : pencilColor;
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
            case 'pentagon':
                drawGon(currPosX, currPosY, 5);
                break;
            case 'hexagon':
                drawGon(currPosX, currPosY, 6);
                break;
            case 'arrow-right':
                arrows(currPosX, currPosY, 1);
                break;
            case 'arrow-left':
                arrows(currPosX, currPosY, 2);
                break;
            case 'arrow-top':
                arrows(currPosX, currPosY, 3);
                break;
            case 'arrow-bottom':
                arrows(currPosX, currPosY, 4);
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
const drawGon = (currPosX, currPosY, sides) => {
    var rx = (Math.abs(currPosX - prevPosX)) / 2;
    var ry = (Math.abs(currPosY - prevPosY)) / 2;
    var radius = Math.max(rx, ry);
    var x = (currPosX + prevPosX) / 2;
    var y = (currPosY + prevPosY) / 2;
    var angle = 2 * Math.PI / sides;
    context.beginPath();
    context.translate(x, y);
    context.moveTo(radius, 0);
    for (var i = 1; i <= sides; i++) {
        context.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
    }
    context.translate(-x, -y);
    context.stroke();
}
const arrows = (currPosX, currPosY, type) => {
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
    }
    if (prevPosX > currPosX) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
    let midX = (currPosX + prevPosX) / 2;
    let midY = (currPosY + prevPosY) / 2;
    let heightX = Math.abs(currPosX - prevPosX);
    let heightY = Math.abs(currPosY - prevPosY);
    context.beginPath();
    if (type == 1) {
        context.moveTo(midX, prevPosY);
        context.lineTo(currPosX, midY);
        context.lineTo(midX, currPosY);
        context.lineTo(midX, currPosY - heightY / 4);
        context.lineTo(prevPosX, currPosY - heightY / 4);
        context.lineTo(prevPosX, prevPosY + heightY / 4);
        context.lineTo(midX, prevPosY + heightY / 4);
    } else if (type == 2) {
        context.moveTo(midX, prevPosY);
        context.lineTo(prevPosX, midY);
        context.lineTo(midX, currPosY);
        context.lineTo(midX, currPosY - heightY / 4);
        context.lineTo(currPosX, currPosY - heightY / 4);
        context.lineTo(currPosX, prevPosY + heightY / 4);
        context.lineTo(midX, prevPosY + heightY / 4);
    } else if (type == 3) {
        context.moveTo(midX, prevPosY);
        context.lineTo(currPosX, midY);
        context.lineTo(currPosX - heightX / 4, midY);
        context.lineTo(currPosX - heightX / 4, currPosY);
        context.lineTo(prevPosX + heightX / 4, currPosY);
        context.lineTo(prevPosX + heightX / 4, midY);
        context.lineTo(prevPosX, midY);
    } else {
        context.moveTo(prevPosX + heightX / 4, prevPosY);
        context.lineTo(currPosX - heightX / 4, prevPosY);
        context.lineTo(currPosX - heightX / 4, midY);
        context.lineTo(currPosX, midY);
        context.lineTo(midX, currPosY);
        context.lineTo(prevPosX, midY);
        context.lineTo(prevPosX + heightX / 4, midY);
    }
    context.closePath();
}
document.getElementById("color-chooser").addEventListener("click", () => {
    color.click();
    press = 0;
});
document.getElementById("color-chooser").addEventListener("contextmenu", () => {
    color.click();
    press = 2;
});
color.addEventListener("input", () => {
    let newColor;
    if (press == 2) {
        secondaryColor = color.value || secondaryColor;
        newColor = secondaryColor;
    } else {
        pencilColor = color.value || pencilColor;
        newColor = pencilColor;
    }
    context.strokeStyle = newColor;
    context.lineWidth = pencilSize;
    document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
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
canvas.addEventListener("contextmenu", (e) => { e.preventDefault() });
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
document.querySelector(".pentagon").addEventListener("click", () => { select = 'pentagon'; updatePencil(); });
document.querySelector(".hexagon").addEventListener("click", () => { select = 'hexagon'; updatePencil(); });
document.querySelector(".arrow-right").addEventListener("click", () => { select = 'arrow-right'; updatePencil(); });
document.querySelector(".arrow-left").addEventListener("click", () => { select = 'arrow-left'; updatePencil(); });
document.querySelector(".arrow-top").addEventListener("click", () => { select = 'arrow-top'; updatePencil(); });
document.querySelector(".arrow-bottom").addEventListener("click", () => { select = 'arrow-bottom'; updatePencil(); });
document.querySelector(".saveBtn").addEventListener("click", saveImg);
if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);
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