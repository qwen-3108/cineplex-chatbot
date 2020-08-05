const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { format } = require('date-fns');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const mapDateTime = require('../../@util/mapDateTime');

module.exports = async function editSeatPlan(chat_id, scheduleId, bookingInfo) {

    const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
    const toEdit = bookingInfo.ticketing.filter(selection => selection.scheduleId === scheduleId);
    const { movie, dateTime, cinema, isPlatinum, seatPlanMsgId, seatPlanCallback } = toEdit[0];

    let formData = new FormData();
    //#1 form field: chat_id & message_id
    formData.append('chat_id', chat_id);
    formData.append('message_id', seatPlanMsgId);
    //#2 form field: input media photo
    const experienceStr = isPlatinum ? '\n💎 (Platinum Movie Suites)' : '';
    const mappedDate = mapDateTime(dateTime, daysToDbDate, nextWeekAreDaysLessThan);
    const caption = `*${movie.title}*\n☁️ ${format(mappedDate, 'd MMMM yyyy (E)')}, ${format(mappedDate, 'h aa')}\n🎥 ${cinema}${experienceStr}\n\`last updated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}\``;
    const inputMediaPhoto = {
        type: 'photo',
        media: 'attach://updated_seat_plan',
        caption,
        parse_mode: 'Markdown'
    };
    formData.append('media', JSON.stringify(inputMediaPhoto));
    //#3 form field: attachment
    formData.append('updated_seat_plan', fs.createReadStream(`#asset/image/seat_snapshot/${scheduleId}.jpeg`));
    //#4 form field: reply_markup
    formData.append('reply_markup', JSON.stringify({
        inline_keyboard: seatPlanCallback
    }));

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageMedia',
        data: formData,
        headers: formData.getHeaders()
    };

    let file_id;
    return await axios(config)
        .then(res => {
            file_id = res.data.result.photo[0].file_id;
            console.log(`Edit seat plan successfully. New file id: ${file_id}`);
            return COLLECTIONS.sessions.updateOne(
                { _id: chat_id },
                { $set: { "bookingInfo.ticketing.$[editedPlan].seatPlanFileId": file_id } },
                { arrayFilters: [{ editedPlan: { scheduleId: scheduleId } }] }
            );
        })
        .then(res => {
            return ({ session: chat_id, scheduleId, newFileId: file_id });
        });
}