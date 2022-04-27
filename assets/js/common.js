const canvas = document.getElementById("drawing-board");
const canvas2 = document.getElementById("imaginery-board");
const cxt = canvas.getContext("2d");
const cxt2 = canvas2.getContext("2d");
const color = document.getElementById("multi-color");
const colors = ['#000000', '#696969', '#8B0000', '#FF0000', '#FFA500', '#FFFF00', '#008000', '#30D5C8', '#4b0082', '#800080', '#FFFFFF', '#D3D3D3', '#FF007F', '#FFD700', '#FFFFE0', '#00FF00', '#AFEEEE', '#6699CC', '#E6E6FA'];
const sizes = ['1', '3', '5', '8', '10'];
document.querySelector(".non-selected").innerHTML = '';
colors.forEach(color => {
    document.querySelector(".non-selected").innerHTML += `<div class="clr" data-code="${color}" style="background: ${color};"> </div>`;
});
document.cookie = "SameSite=None";
document.querySelector(".size-block").innerHTML = '';
sizes.forEach(height => {
    document.querySelector(".size-block").innerHTML += `<div class="line"  data-width="${height}" >${height}px<hr style="height: ${height}px;"></div>`;
});
document.querySelector(".size-block").innerHTML += `<div class="fea-name">Size</div>`;
const coord = document.querySelector(".coordinates");
const sizewh = document.querySelector(".size-wh");
let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
let lines = document.querySelectorAll(".line");
lines = Array.from(lines);
let feaHeader = document.querySelectorAll(".fea-header");
feaHeader = Array.from(feaHeader);
let shape = document.querySelectorAll(".shape");
shape = Array.from(shape);
let ispolygon = false;
let polygonSt = [];
const shapes = ['line', 'rectangle', 'ellipse', 'polygon', 'triangle', 'right-triangle', 'diamond', 'pentagon', 'hexagon', 'arrow-right', 'arrow-left', 'arrow-top', 'arrow-bottom', '4p-star'];
let isDrawing = false;
let select = "pencil";
let pencilSize = 1;
let eraserSize = 8;
let isErasing = false;
let pencilColor = "#000000";
let secondaryColor = "#ffffff";
let press = 0;
let canvasColor = "#ffffff";
let prevPosX = null;
let prevPosY = null;
let elemLeft = canvas.offsetLeft + canvas.clientLeft, elemTop = canvas.offsetTop + canvas.clientTop;
cxt.lineCap = "round";

clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        pencilColor = clr.dataset.code;
        updatePencil();
        isErasing = false;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
        if (select == "eraser") {
            select = "pencil";
        }
    });
});
clrs.forEach(clr => {
    clr.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        secondaryColor = clr.dataset.code;
        isErasing = false;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
        if (select == "eraser") {
            select = "pencil";
        }
    });
});
lines.forEach(line => {
    line.addEventListener("click", () => {
        pencilSize = line.dataset.width;
        updatePencil();
        isErasing = false;
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
    });
});
feaHeader.forEach(headers => {
    headers.addEventListener("click", () => {
        fixActive();
        let active = headers.dataset.name;
        document.querySelector(`.${active}`).setAttribute("style", "display:flex");
    });
});
const fixActive = () => {
    feaHeader.forEach(head => {
        let name = head.dataset.name;
        document.querySelector(`.${name}`).removeAttribute("style");
    })
};
cxt.beginPath();

const startDrawing = (e) => {
    fixActive();
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
    cxt.strokeStyle = (e.buttons == 2) ? secondaryColor : pencilColor;
    cxt2.strokeStyle = (e.buttons == 2) ? secondaryColor : pencilColor;
    if (isErasing && select == "eraser") {
        cxt.strokeStyle = canvasColor;
        cxt2.strokeStyle = canvasColor;
    }
    let [x, y] = getCords(e);
    coord.innerHTML = `${parseFloat(x).toFixed(2)},${parseFloat(y).toFixed(2)}px`;
    // if (select == "eraser") {
    //     // canvas.style.cursor = `url("https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/${eraserSize}/000000/external-square-music-royyan-wijaya-detailed-outline-royyan-wijaya.png"), auto`;
    //     moveX += e.movementX;
    //     moveY += e.movementY;
    //     document.querySelector("#eraser-cursor").style = `display: flex;top: ${moveY}px;left: ${moveX}px;width: ${eraserSize}px;height: ${eraserSize}px`;
    //     // canvas.style.cursor = 'none';
    // } else {
    //     // canvas.style.cursor = 'cross-hair';
    //     document.querySelector("#eraser-cursor").style = ``;
    // }
    if (prevPosX == null || prevPosY == null || !isDrawing) {
        [prevPosX, prevPosY] = getCords(e);
        return
    }
    fixActive();
    if (shapes.includes(select)) {
        canvas.style = "opacity: .1;";
        setSize(canvas2, cxt2);
        cxt2.drawImage(canvas, 0, 0);
        cxt2.strokeStyle = pencilColor;
        cxt2.lineWidth = pencilSize;
        cxt2.lineCap = "round";
        cxt2.lineJoin = "round";
        let [currPosX, currPosY] = getCords(e);
        document.querySelector(".select-area").innerHTML = `${Math.abs(currPosX - prevPosX)} x ${Math.abs(currPosY - prevPosY)}px`;
        switch (select) {
            case 'rectangle':
                drawRect(currPosX, currPosY, cxt2);
                break;
            case 'ellipse':
                drawCir(currPosX, currPosY, cxt2);
                break;
            case 'line':
                drawLine(currPosX, currPosY, cxt2);
                break;
            case 'polygon':
                drawPoly(currPosX, currPosY, cxt2);
                break;
            case 'triangle':
                drawTri(currPosX, currPosY, cxt2);
                break;
            case 'right-triangle':
                drawRiTri(currPosX, currPosY, cxt2);
                break;
            case 'diamond':
                drawDiamond(currPosX, currPosY, cxt2);
                break;
            case 'pentagon':
                drawGon(currPosX, currPosY, cxt2, 5);
                break;
            case 'hexagon':
                drawGon(currPosX, currPosY, cxt2, 6);
                break;
            case 'arrow-right':
                arrows(currPosX, currPosY, cxt2, 1);
                break;
            case 'arrow-left':
                arrows(currPosX, currPosY, cxt2, 2);
                break;
            case 'arrow-top':
                arrows(currPosX, currPosY, cxt2, 3);
                break;
            case 'arrow-bottom':
                arrows(currPosX, currPosY, cxt2, 4);
                break;
            case '4p-star':
                draw4PStar(currPosX, currPosY, cxt2);
                break;
        }
        cxt2.stroke();
    } else {
        let [currPosX, currPosY] = getCords(e);
        cxt.beginPath();
        cxt.lineJoin = "round";
        cxt.lineCap = "round";
        cxt.moveTo(prevPosX, prevPosY);
        cxt.lineTo(currPosX, currPosY);
        cxt.stroke();
        prevPosX = currPosX;
        prevPosY = currPosY;
    }
};
const stopDrawing = (e) => {
    document.querySelector(".select-area").innerHTML = ``;
    canvas.style = "opacity: 1;";
    fixActive();
    isDrawing = false;
    if (shapes.includes(select)) {
        cxt.beginPath();
        cxt.lineCap = "round";
        cxt.lineJoin = "round";
        let [currPosX, currPosY] = getCords(e);
        switch (select) {
            case 'rectangle':
                drawRect(currPosX, currPosY, cxt);
                break;
            case 'ellipse':
                drawCir(currPosX, currPosY, cxt);
                break;
            case 'line':
                drawLine(currPosX, currPosY, cxt);
                break;
            case 'polygon':
                drawPoly(currPosX, currPosY, cxt);
                break;
            case 'triangle':
                drawTri(currPosX, currPosY, cxt);
                break;
            case 'right-triangle':
                drawRiTri(currPosX, currPosY, cxt);
                break;
            case 'diamond':
                drawDiamond(currPosX, currPosY, cxt);
                break;
            case 'pentagon':
                drawGon(currPosX, currPosY, cxt, 5);
                break;
            case 'hexagon':
                drawGon(currPosX, currPosY, cxt, 6);
                break;
            case 'arrow-right':
                arrows(currPosX, currPosY, cxt, 1);
                break;
            case 'arrow-left':
                arrows(currPosX, currPosY, cxt, 2);
                break;
            case 'arrow-top':
                arrows(currPosX, currPosY, cxt, 3);
                break;
            case 'arrow-bottom':
                arrows(currPosX, currPosY, cxt, 4);
                break;
            case '4p-star':
                draw4PStar(currPosX, currPosY, cxt);
                break;

        }
        cxt.stroke();
    }
};

const saveImg = (type) => {
    let ext = "", drawing;
    switch (type) {
        case 1:
            drawing = canvas.toDataURL("image/jpeg");
            ext = "jpg";
            break;
        case 2:
            drawing = canvas.toDataURL("image/bmp");
            ext = "bmp";
            break;
        case 3:
            drawing = canvas.toDataURL("image/gif");
            ext = "gif";
            break;
        default:
            drawing = canvas.toDataURL("image/png");
            ext = "png";
            break;
    }
    fixActive();
    let a = document.createElement("a");
    a.href = drawing;
    a.download = `painting.${ext}`;
    a.click();
    a.remove();
};
const erase = () => {
    cxt.strokeStyle = canvasColor;
    cxt.lineWidth = eraserSize;
    select = "eraser";
    isErasing = true;
};
const pencil = () => {
    updatePencil();
    select = "pencil";
    isErasing = false;
};
const picker = () => {
    select = "picker";
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
    cxt.strokeStyle = newColor;
    cxt.lineWidth = pencilSize;
    document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
    if (select == "eraser") {
        select = "pencil";
    }
});
const setSize = (canvas, context) => {
    let xDiff = 50, yDiff = 20;
    canvas.width = window.innerWidth - xDiff;
    canvas.height = window.innerHeight - yDiff;
    sizewh.innerHTML = `${canvas.width} x  ${canvas.height}px`;
    context.fillStyle = canvasColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fill();
}
const getCords = (e) => {
    let xDiff = canvas.offsetLeft - window.screenX, yDiff = canvas.offsetTop - window.scrollY;
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.touches[0] || e.changedTouches[0];
        x = touch.clientX;
        y = touch.clientY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        x = e.clientX;
        y = e.clientY;
    }
    x -= xDiff;
    y -= yDiff;
    return [x, y];
}
const degToRad = (degrees) => {
    return degrees * Math.PI / 180;
}
const updatePencil = () => {
    cxt.strokeStyle = pencilColor;
    cxt.lineWidth = pencilSize;
    ispolygon = false;
    isDrawing = false;
}
const reset = () => {
    prevPosX = prevPosY = null;
    setSize(canvas, cxt);
    setSize(canvas2, cxt2);
    updatePencil();
}
canvas.addEventListener("contextmenu", (e) => { e.preventDefault() });
window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "+" && select == "eraser") {
        e.preventDefault();
        eraserSize++;
        console.log(eraserSize);
        erase();
    }
    if (e.ctrlKey && e.key === "-" && select == "eraser") {
        e.preventDefault();
        eraserSize++;
        console.log(eraserSize);
        erase();
    }
});
document.querySelector(".clear").addEventListener("click", reset);
document.querySelector(".pencil").addEventListener("click", pencil);
document.querySelector(".eraser").addEventListener("click", (e) => { moveX = e.pageX; moveY = e.pageY; erase(); });
document.querySelector(".picker").addEventListener("click", picker);
shape.forEach(shp => {
    shp.addEventListener("click", () => {
        select = shp.dataset.shape;
        updatePencil();
    });
});
document.querySelector(".saveBtn").addEventListener("click", () => { saveImg(0) });
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
setSize(canvas, cxt);
setSize(canvas2, cxt2);
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
canvas.addEventListener("mouseout", () => { coord.innerHTML = ""; });
canvas.addEventListener("click", (e) => {
    if (select == "picker") {
        let x = e.pageX - elemLeft, y = e.pageY - elemTop;
        let pixelData = cxt.getImageData(x, y, 1, 1).data;
        if ((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)) {
            return;
        }
        pencilColor = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
        document.body.style = "--picked-size :" + pencilSize + "px;--picked-color :" + pencilColor + ";--secondary-color :" + secondaryColor;
        select = "pencil";
    }
});