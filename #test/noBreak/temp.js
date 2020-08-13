db.showtimes.updateOne({ _id: ObjectId("5f1fbb80b21f8bd3567c532b") }, {
    $set: {
        "seatingPlan.Q3": {
            status: 0,
            reserve: { by: null, at: null },
            sold: { at: null, to: null, ticketId: null }
        }, "seatingPlan.Q4": {
            status: 0,
            reserve: { by: null, at: null },
            sold: { at: null, to: null, ticketId: null }
        }

    }, $inc: { sold: -3 }
});