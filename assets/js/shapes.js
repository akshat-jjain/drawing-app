const drawRect = (currPosX, currPosY, context) => {
    context.rect(prevPosX, prevPosY, currPosX - prevPosX, currPosY - prevPosY);
};
const drawCir = (currPosX, currPosY, context) => {
    let cx = (prevPosX + currPosX) / 2;
    let cy = (prevPosY + currPosY) / 2;
    let rx = (currPosX - prevPosX) / 2;
    let ry = (currPosY - prevPosY) / 2;
    context.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, degToRad(0), degToRad(360), false);
};
const drawLine = (currPosX, currPosY, context) => {
    context.moveTo(prevPosX, prevPosY);
    context.lineTo(currPosX, currPosY);
}
const drawPoly = (currPosX, currPosY, context) => {
    let org = (context.canvas.dataset.type == 0) ? true : false;
    // console.log(context.canvas.dataset.type);
    if (currPosX - polygonSt[0] <= 2 && currPosY - polygonSt[1] <= 2 && org) {
        ispolygon = false;
        polygonSt = [];
        drawLine(currPosX, currPosY, context);
        return;
    }
    if (!ispolygon && org) {
        ispolygon = true;
        polygonSt = [prevPosX, prevPosY];
    }
    drawLine(currPosX, currPosY, context);
    if (org) {
        prevPosX = currPosX;
        prevPosY = currPosY;
        isDrawing = true;
    }
}
const drawTri = (currPosX, currPosY, context) => {
    let dpu = (context.canvas.dataset.type == 0) ? false : true;
    let change = false;
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
        [prevPosX, currPosX] = [currPosX, prevPosX];
        change = true;
    }
    let midX = (prevPosX + currPosX) / 2;
    context.beginPath();
    context.moveTo(prevPosX, currPosY);
    context.lineTo(currPosX, currPosY);
    context.lineTo(midX, prevPosY);
    context.closePath();
    if (dpu && change) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
};
const drawRiTri = (currPosX, currPosY, context) => {
    let dpu = (context.canvas.dataset.type == 0) ? false : true;
    let change = [false, false];
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
        change[0] = true;
    }
    if (prevPosX > currPosX) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
        change[1] = true;
    }
    context.beginPath();
    context.moveTo(prevPosX, prevPosY);
    context.lineTo(prevPosX, currPosY);
    context.lineTo(currPosX, currPosY);
    context.closePath();
    if (dpu && change[0]) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
    }
    if (dpu && change[1]) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
};
const drawDiamond = (currPosX, currPosY, context) => {
    let midX = (prevPosX + currPosX) / 2;
    let midY = (prevPosY + currPosY) / 2;
    context.beginPath();
    context.moveTo(prevPosX, midY);
    context.lineTo(midX, currPosY);
    context.lineTo(currPosX, midY);
    context.lineTo(midX, prevPosY);
    context.closePath();
};
const drawGon = (currPosX, currPosY, context, sides) => {
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
const arrows = (currPosX, currPosY, context, type) => {
    let dpu = (context.canvas.dataset.type == 0) ? false : true;
    let change = [false, false];
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
        change[0] = true;
    }
    if (prevPosX > currPosX) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
        change[1] = true;
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
    if (dpu && change[0]) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
    }
    if (dpu && change[1]) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
}
const draw4PStar = (currPosX, currPosY, context) => {
    let dpu = (context.canvas.dataset.type == 0) ? false : true;
    let change = [false, false];
    if (prevPosY > currPosY) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
        change[0] = true;
    }
    if (prevPosX > currPosX) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
        change[1] = true;
    }
    let midX = (currPosX + prevPosX) / 2;
    let midY = (currPosY + prevPosY) / 2;
    let heightX = Math.abs(currPosX - prevPosX);
    let singalPartX = heightX / 8;
    let heightY = Math.abs(currPosY - prevPosY);
    let singalPartY = heightY / 8;
    context.beginPath();
    context.moveTo(midX, prevPosY);
    context.lineTo(currPosX - singalPartX * 3, prevPosY + singalPartY * 3);
    context.lineTo(currPosX, midY);
    context.lineTo(currPosX - singalPartX * 3, currPosY - singalPartY * 3);
    context.lineTo(midX, currPosY);
    context.lineTo(prevPosX + singalPartX * 3, currPosY - singalPartY * 3);
    context.lineTo(prevPosX, midY);
    context.lineTo(prevPosX + singalPartX * 3, prevPosY + singalPartY * 3);
    context.closePath();
    if (dpu && change[0]) {
        [prevPosY, currPosY] = [currPosY, prevPosY];
    }
    if (dpu && change[1]) {
        [prevPosX, currPosX] = [currPosX, prevPosX];
    }
}