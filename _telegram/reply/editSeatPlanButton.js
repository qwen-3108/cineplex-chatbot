const axios = require('axios');

module.exports = async function editSeatPlanButton(chat_id, ticketingEntry, dateTime) {

    const { isSelected, scheduleId, seatPlanMsgId } = ticketingEntry;
    const { daysToDbDate, nextWeekAreDaysLessThan } = dateTime;

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageReplyMarkup',
        data: {
            chat_id,
            message_id: seatPlanMsgId,
            reply_markup: {
                inline_keyboard: [[{ text: isSelected ? '✅ Choosing for this plan' : '📍 Choose seats', callback_data: `uSId =${scheduleId} ${daysToDbDate} ${nextWeekAreDaysLessThan}=` }]]
            }
        }
    }
    return axios(config)
        .then(res => {
            let seatPlanCallback = res.data.result.reply_markup.inline_keyboard;
            console.log(`Edit seat plan button successfully. reply_markup: ${JSON.stringify(seatPlanCallback)}`);
            //return edited callback buttons
            return { seatPlanCallback };
        }, err => {
            console.log(JSON.stringify(err.response.data));
            return { seatPlanCallback: [] };
        });

};