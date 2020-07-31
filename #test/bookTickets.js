const { bookTickets } = require('../_database/query');
const { COLLECTIONS } = require('../@global/COLLECTIONS');

describe('book ticket', () => {

    //define mock data
    const chatId = "750594803";
    const ticketing = [{
        isSelected: false,
        scheduleId: "5f1fbb3ab21f8bd3567c4f55",
        movie: {
            id: '5ec6603c29431975db467387',
            title: 'The Secret Garden',
            isBlockBuster: false,
            debutDateTime: new Date("2020-05-16T16:00:00.000Z")
        },
        dateTime: new Date("2020-05-28T20:00:00.000Z"),
        cinema: "The Cathay Cineplex",
        hall: 6,
        isPlatinum: false,
        seatPlanMsgId: null,
        seatPlanFileId: null,
        seatPlanCallback: []

    }];
    const order_info = {
        name: "LOH QIAO WEN",
        phone_number: "6583886548"
    }
    const seatNumbers = ["Q5, Q6, Q7"];

    beforeAll(async () => {

        await bookTickets(chatId, ticketing, seatNumbers, order_info);

    });

    test('should update status of seats to 1 in `showtimes` collection', async () => {
        const expectedSeatDetails = {
            status: 1,
            reserved: {
                by: chatId
            },
            sold: {
                at: null,
                to: null,
                ticketId: null
            }
        };

        //check status of seat
        const testShowtime = await COLLECTIONS.showtimes.findOne({ _id: ticketing[0].scheduleId }, { seatingPlan: 1 });
        const seatDetails = [];
        for (let i = 0; i < seatNumbers.length; i++) {
            const seatNumber = seatNumbers[i];
            seatDetails.push({
                seatNumber,
                ...testShowtime.seatingPlan[seatNumber]
            });
        }
        expect(seatDetails).toEqual


    });


    // test('should return error if status of seats is not 0 prior to booking', async () => {
    //     //book ticket with same seat number
    //     //should get error
    // });

    // test('should create new tickets in `tickets` collection', async () => {
    //     //search ticket collection with tickets of same scheduleId, and right seat number

    // });

    // test('tickets should contain correct scheduleId, seat number, buyer info and boughtOn', async () => {
    //     //search ticket collection for tickets and check typeof boughtOn is date
    // });

    // afterAll(() => {
    //     //release seat
    //     //delete tickets
    // });

});