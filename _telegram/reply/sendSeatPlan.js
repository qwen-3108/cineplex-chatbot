const fs = require('fs');
const FormData = require('form-data');
const { format } = require('date-fns');
const drawSeatPlan = require('../../@util/drawSeatPlan');
const mapDateTime = require('../../@util/mapDateTime');
const post = require('../post');

module.exports = async function sendSeatPlan({ chat_id, bookingInfo, seatingPlan }) {

    const { scheduleId, movie, dateTime, cinema, isPlatinum } = bookingInfo.ticketing[bookingInfo.ticketing.length - 1];

    const formData = new FormData();

    //#1 form field: chat_id, parse_mode
    formData.append('chat_id', chat_id);
    formData.append('parse_mode', 'Markdown');

    //#2: form field: reply_markup, add button if not the first seat plan sent
    if (bookingInfo.ticketing.length > 1) {
        console.log('Seating plan has button');
        const reply_markup = { inline_keyboard: [[{ text: '📍 Choose seats', callback_data: `uSId =${scheduleId}=` }]] };
        formData.append('reply_markup', JSON.stringify(reply_markup));
    }

    //#3 form field: image
    const seatPlanBuf = drawSeatPlan(scheduleId, seatingPlan, isPlatinum);
    fs.writeFileSync(`#asset/image/seat_snapshot/${chat_id}.jpeg`, seatPlanBuf);
    formData.append('photo', fs.createReadStream(`#asset/image/seat_snapshot/${chat_id}.jpeg`));

    //#4 form field: caption
    const mappedDate = mapDateTime(dateTime, bookingInfo.dateTime.sessionStartedAt);
    const experienceStr = isPlatinum ? '\n💎 (Platinum Movie Suites)' : '';
    const caption = `*${movie.title}*\n☁️ ${format(mappedDate, 'd MMMM yyyy (E)')}, ${format(mappedDate, 'h aa')}\n🎥 ${cinema}${experienceStr}\n\`last updated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}\``;
    console.log('caption: ', caption.split('\n').join(' '));
    formData.append('caption', caption);

    //posting
    return await post.sendPhoto(formData)
        .then(res => {
            const { message_id, photo } = res.data.result;
            let seatPlanCallback = [];
            if (res.data.result.hasOwnProperty('reply_markup')) {
                seatPlanCallback = res.data.result.reply_markup.inline_keyboard;
            }
            console.log(`Send seat plan successfully. message_id: ${message_id} file_id: ${photo[0].file_id} reply_markup: ${JSON.stringify(seatPlanCallback)}`);
            //delete seat plan from server
            fs.unlinkSync(`#asset/image/seat_snapshot/${chat_id}.jpeg`);
            console.log(`#asset/image/seat_snapshot/${chat_id}.jpeg was deleted`);
            //return msg id, file id, and callback butons (if applicable)
            return { seatPlanMsgId: message_id, seatPlanFileId: photo[0].file_id, seatPlanCallback };
        }, err => {
            console.log(err);
            return { seatPlanMsgId: "", seatPlanFileId: "", seatPlanCallback: [] };
        });
};


