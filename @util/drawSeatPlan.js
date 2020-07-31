const { createCanvas } = require('canvas');
const { ROW, REGEX } = require('../@global/CONSTANTS');

module.exports = function drawSeatPlan(scheduleId, seatingPlan, isPlatinum) {

    const w = 1200;
    const h = 750;
    const padding = 30;
    const rowMg = 4;
    const aisleBp = isPlatinum ? [3, 7] : [5, 11];
    const aisleW = 40;
    const colMg = 4;
    const rowArr = isPlatinum ? ROW.PLATINUM : ROW.REGULAR;
    const colNum = isPlatinum ? 8 : 14;
    const seatPlan = new SeatPlan(w, h, padding, rowMg, aisleBp, aisleW, colMg, rowArr, colNum, scheduleId);
    seatPlan.initCanvas();;
    for (const seatNum in seatingPlan) {
        seatPlan.drawSeat(seatNum, seatingPlan[seatNum].status);
    }
    return seatPlan.printPlan();
}

//class used in helper function



class SeatPlan {
    constructor(w, h, padding, rowMg, aisleBp, aisleW, colMg, rowArr, colNum, scheduleId) {
        this.scheduleId = scheduleId;
        this.w = w;
        this.h = h;
        this.padding = padding;
        this.rowMg = rowMg;
        this.aisleBp = aisleBp.sort((a, b) => a - b);
        this.aisleW = aisleW;
        this.colMg = colMg;
        this.rowArr = rowArr;
        this.rowH = (h - 4 * padding) / rowArr.length;
        this.colW = (w - 2 * padding - aisleW * aisleBp.length) / colNum;
        this.canvas = createCanvas(w, h);
        this.ctx = this.canvas.getContext('2d');
    }

    initCanvas() {
        this.ctx.fillStyle = '#f5f6fa';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = '#353b48';
        const screenWidth = 0.7 * (this.w - 2 * this.padding);
        const xStart = (this.w - screenWidth) / 2;
        roundedRect(this.ctx, xStart, this.padding, screenWidth, 10, 4, 3);
        const fontSize = 16;
        this.ctx.font = `${fontSize}px Verdana`;
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('SCREEN', this.padding + this.rowMg, this.padding + fontSize - 5);
    }

    rowToY(rowChar) {
        return this.rowArr.indexOf(rowChar) * this.rowH;
    }

    colToX(col) {
        let aisleNum = 0;
        for (let i = 0; i < this.aisleBp.length; i++) {
            if (col < this.aisleBp[i]) {
                break;
            }
            if (col >= this.aisleBp[i]) {
                aisleNum = i + 1;
            }
        }
        return (col - 1) * this.colW + this.aisleW * aisleNum;
    }

    drawSeat(seatNumber, status) {
        const { row, num: col } = seatNumber.match(REGEX.SEAT_CHAR_NUM).groups;
        const xi = this.padding + this.colToX(col) + this.colMg;
        const yi = 3 * this.padding + this.rowToY(row) + this.rowMg;
        const seatW = this.colW - 2 * this.colMg;
        const seatH = this.rowH - 2 * this.rowMg;
        const r = 4;
        roundedRect(this.ctx, xi, yi, seatW, seatH, r, status);
        const fontSize = 16;
        this.ctx.font = `${fontSize}px Verdana`;
        const textPositionX = xi + [(this.colW - 2 * this.colMg) - this.ctx.measureText(seatNumber).width] / 2;
        const textPositionY = yi + [(this.rowH - 2 * this.rowMg) - fontSize] / 2 + fontSize;
        this.ctx.fillStyle = status === 1 ? 'white' : 'black';
        this.ctx.fillText(seatNumber, textPositionX, textPositionY);
    }

    printPlan() {
        return this.canvas.toBuffer('image/jpeg');
    }
}

function roundedRect(ctx, xi, yi, seatW, seatH, r, status) {
    ctx.beginPath();
    ctx.moveTo(xi, yi + r);
    ctx.arcTo(xi, yi, xi + r, yi, r);
    ctx.lineTo(xi + seatW - r, yi);
    ctx.arcTo(xi + seatW, yi, xi + seatW, yi + r, r);
    ctx.lineTo(xi + seatW, yi + seatH - r);
    ctx.arcTo(xi + seatW, yi + seatH, xi + seatW - r, yi + seatH, r);
    ctx.lineTo(xi + r, yi + seatH);
    ctx.arcTo(xi, yi + seatH, xi, yi + seatH - r, r);
    ctx.closePath();
    switch (status) {
        case 0: //available
            ctx.fillStyle = '#26de81';
            break;
        case 1: //sold
            ctx.fillStyle = '#eb3b5a';
            break;
        case 2: //reserved
            ctx.fillStyle = '#fd9644';
            break;
        case 3: //screen
            ctx.fillStyle = '#353b48';
            break;
        default:
            throw 'Custom error: wrong sold status code, check database';
    }
    ctx.fill();
}
