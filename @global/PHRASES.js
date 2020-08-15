const { REGEX } = require("./CONSTANTS");

module.exports = {
    GREETING: function () {
        const chatDate = new Date();
        let timeStr = '';
        if (chatDate.getHours() < 12) {
            timeStr = 'Good morning! ';
        } else if (chatDate.getHours() < 18) {
            timeStr = 'Good afternoon! ';
        } else {
            timeStr = 'Good evening! ';
        }
        return timeStr;
    },
    POSITIVE: function () {
        const phraseBank = [
            'Awesome. ',
            'Great! ',
            'Brilliant. '
        ];
        return phraseBank[Math.floor(Math.random() * phraseBank.length)];
    },
    ACKNOWLEDGEMENT: function (text) {
        let phraseBank;
        if ((/(can|could)\s(i|you|we)/i).test(text)) {
            phraseBank = ['Sure! ', 'Of course :) '];
        } else if ((/(sorry|oops)/i).test(text)) {
            phraseBank = ['No problem :) ', 'Okay :) ', 'Sure :) '];
        } else if ((/(i|please )('d like| would like| want|help)\s(to)?/i).test(text)) {
            phraseBank = ['Okay. '];
        } else if ((/(what about|how about)/i).test(text)) {
            phraseBank = [''];
        } else if ((/(do you have)/i).test(text)) {
            phraseBank = ['Yep. ', 'We do. '];
        } else {
            phraseBank = ['Cool. ', 'Great. ', 'Okay. '];
        }
        return (phraseBank[Math.floor(Math.random() * phraseBank.length)]);
    },
    DOUBLE_CHECK: function () {

        const phraseBank = [
            'Is this correct?',
            'Am I right?',
            'Did I get you correctly?'
        ];
        return phraseBank[Math.floor(Math.random() * phraseBank.length)];
    },
    CANCEL: function (text) {
        const hasThanks = REGEX.THANKS.test(text);
        const cancelAcknowledgement = hasThanks ? 'No problem. ' : 'Okay. ';
        const phraseBank = [
            'Is there anything else I can help?',
            'Can I help you with anything else?'
        ]
        return cancelAcknowledgement + phraseBank[Math.floor(Math.random() * phraseBank.length)];
    },
    END: function (text) {
        const hasThanks = REGEX.THANKS.test(text);
        const hours = new Date().getHours();
        const endAcknowledgement = hasThanks ? 'No problem. ' : 'Sure. ';
        const phraseBank_2 = ['I am always here to assist :)', "Feel free to talk to me again if there is"];
        const wishes = hours > 20 ? 'Have a nice day' : 'Good night';
        return (endAcknowledgement + phraseBank_2[Math.floor(Math.random()) * phraseBank_2.length] + wishes);
    },
    MY_PLEASURE: function () {
        const phraseBank = [
            'No problem :) ',
            'My pleasure :) ',
            "It's nothing :)",
            "Glad to help :)"
        ];
        return phraseBank[Math.floor(Math.random() * phraseBank.length)];
    },
    SUGGEST_ALTERNATIVE_ACTIONS: function () {
        const phraseBank = [
            'Would you like me to do that?',
            'Is that okay?',
            'What do you think?'
        ];
        return phraseBank[Math.floor(Math.random() * phraseBank.length)];
    },
    DONT_UNDERSTAND: function () {
        const phraseBank = [
            "Hm I don't get you? ",
            "I'm sorry? ",
            "Sorry I don't get you. ",
            "I don't quite get that. "
        ];
        return phraseBank[Math.floor(Math.random() * phraseBank.length)];
    }
};