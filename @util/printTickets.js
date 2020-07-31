const { format } = require('date-fns');
const { registerFont, createCanvas, Image } = require('canvas');
const QRCode = require('qrcode');
const { TICKET } = require('../@global/CONSTANTS');
const mapDateTime = require('./mapDateTime');

module.exports = async function printTickets(savedTickets, bookingInfo) {
    const { WIDTH, HEIGHT, LABEL_TEXTS, DETAIL_TEXTS, DISCLAIMER_LINE_1, DISCLAIMER_LINE_2 } = TICKET;
    const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    if (selected.length !== 1) throw `Seating plan selected not unique in printTickets.js ${JSON.stringify(selected)}`;
    const { movie, cinema, isPlatinum, hall, dateTime } = selected[0];

    const detailTexts = {};
    detailTexts[movie.title] = DETAIL_TEXTS.movie;
    //>>>
    const mappedDate = mapDateTime(dateTime, daysToDbDate, nextWeekAreDaysLessThan);
    const dateStr = format(mappedDate, 'd MMMM yyyy');
    const timeStr = format(mappedDate, 'h : mm aa');
    detailTexts[dateStr] = DETAIL_TEXTS.date;
    detailTexts[timeStr] = DETAIL_TEXTS.time;
    //>>>
    detailTexts[hall] = DETAIL_TEXTS.hall;
    detailTexts[cinema] = DETAIL_TEXTS.cinema;
    const experienceStr = isPlatinum ? 'PLATINUM' : 'REGULAR';
    detailTexts[experienceStr] = DETAIL_TEXTS.experience;

    const ticketBuffers = [];

    for (let i = 0; i < savedTickets.length; i++) {

        const { _id, seatNumber } = savedTickets[i];
        detailTexts[seatNumber] = DETAIL_TEXTS["seat-number"];

        //Initalize canvas
        registerFont('#asset/font/FiraMono-Regular.ttf', { family: 'Fira Mono' });
        registerFont('#asset/font/Roboto-Regular.ttf', { family: 'Roboto' });
        const ticketCanvas = createCanvas(WIDTH, HEIGHT);
        const ctx = ticketCanvas.getContext('2d');
        //labels
        ctx.fillStye = '#000';
        ctx.font = '16px Roboto';
        for (const label in LABEL_TEXTS) {
            ctx.fillText(label.toUpperCase(), LABEL_TEXTS[label].x, LABEL_TEXTS[label].y + 16);
        }
        //footer
        const logo = new Image();
        logo.onload = () => ctx.drawImage(logo, 55, 1067, 115, 30);
        logo.onerror = err => { throw err };
        logo.src = '#asset/image/logo.png';
        ctx.font = '12px Roboto';
        ctx.fillText(DISCLAIMER_LINE_1, 226, 1069 + 12);
        ctx.fillText(DISCLAIMER_LINE_2, 226, 1084 + 12);
        //fill in details
        ctx.font = '28px "Fira Mono"';
        for (const detail in detailTexts) {
            if (detail !== "_id") {
                ctx.fillText(detail.toUpperCase(), detailTexts[detail].x, detailTexts[detail].y + 28);
            }
        }
        delete detailTexts[seatNumber];
        //add qr code
        console.log('ticketId: ', _id, typeof _id);
        const qrURL = await QRCode.toDataURL(_id.toString(), {
            color: {
                dark: '#8e44adff',
                light: '#ffffffff'
            },
            width: WIDTH
        });
        const qr = new Image();
        qr.onload = () => ctx.drawImage(qr, 0, 0, 810, 810);
        qr.onerror = err => { throw err };
        qr.src = qrURL;

        ticketBuffers.push(ticketCanvas.toBuffer());
    }

    return ticketBuffers;
}