const canvas = document.getElementById("drawing-board");
const contxt = canvas.getContext("2d");
const color = document.getElementById("multi-color");
let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
let lines = document.querySelectorAll(".line");
lines = Array.from(lines);
let ispolygon = false;
let polygonSt = [];
const shapes = ['rectangle', 'line', 'ellipse', 'polygon'];
let isDrawing = false;
let select = "pencil";
let pencilSize = 1;
let eraserSize = 5;
let pencilColor = "#000000";
let canvasColor = "#ffffff";

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
    if (ispolygon) {
        return;
    }
    if (shapes.includes(select)) {
        [prevPosX, prevPosY] = getCords(e);
    }
};
const draw = (e) => {
    if (prevPosX == null || prevPosY == null || !isDrawing) {
        [prevPosX, prevPosY] = getCords(e);
        return
    }
    if (shapes.includes(select)) {
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
    if (shapes.includes(select)) {
        contxt.beginPath();
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
        }
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
    contxt.strokeStyle = canvasColor;
    contxt.lineWidth = eraserSize;
    select = "eraser";
};
const pencil = () => {
    updatePencil();
    select = "pencil";
};
const drawRect = (currPosX, currPosY) => {
    contxt.rect(prevPosX, prevPosY, currPosX - prevPosX, currPosY - prevPosY);
};
const drawCir = (currPosX, currPosY) => {
    let cx = (prevPosX + currPosX) / 2;
    let cy = (prevPosY + currPosY) / 2;
    let rx = (currPosX - prevPosX) / 2;
    let ry = (currPosY - prevPosY) / 2;
    contxt.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, degToRad(0), degToRad(360), false);
    // contxt.arc(prevPosX, prevPosY, currPosX - prevPosX, degToRad(0), degToRad(360), false);
};
const drawLine = (currPosX, currPosY) => {
    contxt.moveTo(prevPosX, prevPosY);
    contxt.lineTo(currPosX, currPosY);
}
const drawPoly = (currPosX, currPosY) => {
    if (currPosX == polygonSt[0] && currPosY == polygonSt[1]) {
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
document.getElementById("color-chooser").addEventListener("click", () => {
    color.click();
});
color.addEventListener("input", () => {
    pencilColor = color.value;
    contxt.strokeStyle = pencilColor;
});
const setSize = () => {
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 150;
}
const getCords = (e) => {
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY - 80;
        alert(x, y);
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
    contxt.strokeStyle = pencilColor;
    contxt.lineWidth = pencilSize;
    ispolygon = false;
    isDrawing = false;
}
const reset = () => {
    prevPosX = prevPosY = null;
    isDrawing = false;
    ispolygon = false;
    setSize();
}
document.querySelector(".clear").addEventListener("click", reset);
document.querySelector(".pencil").addEventListener("click", pencil);
document.querySelector(".eraser").addEventListener("click", erase);
document.querySelector(".sline").addEventListener("click", () => { select = 'line'; updatePencil(); });
document.querySelector(".rectangle").addEventListener("click", () => { select = 'rectangle'; updatePencil(); });
document.querySelector(".polygon").addEventListener("click", () => { select = 'polygon'; updatePencil(); });
document.querySelector(".ellipse").addEventListener("click", () => { select = 'ellipse'; updatePencil(); });
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
setSize();
// addEventListener('resize', () => {
//     contxt.save();
//     canvas.width = innerWidth - 50;
//     canvas.height = innerHeight - 150;
//     contxt.restore();
// });