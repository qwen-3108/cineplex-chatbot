

module.exports = async function rejectedConfirmHandler({ sessionToMutate }) {

    //if no not reply on confirm stage, invoke fallback


    //status driven reply
    const { chatId, status } = sessionToMutate;
    switch (status.secondary) {

    }

}