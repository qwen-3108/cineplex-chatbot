const post = require('../post');

module.exports = async function editSeatPlanButton(chat_id, ticketingEntry, sessionStartedAt) {

    const { isSelected, scheduleId, seatPlanMsgId } = ticketingEntry;

    let callbackButton;
    if (isSelected) {
        callbackButton = { text: '✅ Choosing for this plan', callback_data: "uSId =NA=" };
    } else {
        callbackButton = { text: '📍 Choose seats', callback_data: `uSId =${scheduleId}=` };
    }

    return await post.editMessageReplyMarkup(
        chat_id,
        seatPlanMsgId,
        { inline_keyboard: [[callbackButton]] }
    )
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