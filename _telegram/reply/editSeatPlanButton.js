const post = require('../post');
const axiosErrorCallback = require('../axiosErrorCallback');
const { logInfo } = require('../../@global/LOGS');

module.exports = async function editSeatPlanButton(chat_id, ticketingEntry, sessionStartedAt) {

    const { isSelected, scheduleId, seatPlanMsgId } = ticketingEntry;

    let callbackButton;
    if (isSelected) {
        callbackButton = { text: '✅ Choosing for this plan', callback_data: "uSId =NA=" };
    } else {
        callbackButton = { text: '📍 Choose seats', callback_data: `uSId =${scheduleId}=` };
    }

    try {
        const res = await post.editMessageReplyMarkup(
            chat_id,
            seatPlanMsgId,
            { inline_keyboard: [[callbackButton]] }
        );
        let seatPlanCallback = res.data.result.reply_markup.inline_keyboard;
        logInfo(chat_id, `Edit seat plan button successfully. reply_markup: ${JSON.stringify(seatPlanCallback)}`);
        //return edited callback buttons
        return { seatPlanCallback };

    } catch (err) {
        axiosErrorCallback(chat_id, err);
        return { seatPlanCallback: [] };

    }

};