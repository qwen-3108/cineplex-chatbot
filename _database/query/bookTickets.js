const { ObjectId } = require('mongodb');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = async function bookTickets(chatId, ticketing, seatNumbers, order_info) {

    console.log('-----booking ticket-----');

    const selected = ticketing.filter(selection => selection.isSelected);
    if (selected.length !== 1) throw `Selected seating plan not unique in ticket.book.js ${JSON.stringify(selected)}`;

    const current = new Date();
    const ticketArr = [];
    const ticket = {
        scheduleId: selected[0].scheduleId,
        buyerInfo: {
            chatId: chatId,
            name: order_info.name,
            phoneNumber: order_info.phone_number
        },
        boughtOn: current
    };

    //prepare ticket arr for db insertion
    for (let i = 0; i < seatNumbers.length; i++) {
        ticket.seatNumber = seatNumbers[i];
        ticketArr.push({ ...ticket });
    }
    console.log(ticketArr);
    let response = await COLLECTIONS.tickets.insertMany(ticketArr);
    const savedTickets = response.ops;
    console.log('Saved tickets: ', JSON.stringify(savedTickets));

    const currentTime = new Date();
    const showtimeUpdateStr = {};
    //prepare to update seat status in schedule collection
    for (let j = 0; j < savedTickets.length; j++) {
        const currentTicket = savedTickets[j];
        showtimeUpdateStr[`seatingPlan.${currentTicket.seatNumber}`] = {
            status: 1,
            reserve: { by: null, at: null },
            sold: { at: currentTime, to: chatId, ticketId: currentTicket._id }
        };
    }
    console.log('bookStr: ', JSON.stringify(showtimeUpdateStr));
    console.log('Number of ticket purchased: ', Object.keys(showtimeUpdateStr).length);
    await COLLECTIONS.showtimes.updateOne({ _id: ObjectId(selected[0].scheduleId) }, { $set: showtimeUpdateStr, $inc: { sold: Object.keys(showtimeUpdateStr).length } });
    console.log('-----tickets booked successfully-----');

    return savedTickets;

}