const fs = require('fs');
const FormData = require('form-data');
const calculatePrice = require('../../@util/calculatePrice');
const sendPhoto = require('../post/sendPhoto');

module.exports = async function faqTicketPrice(chat_id, currentSession, customerType) {

    console.log('-----Getting ticket price-----')
    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('photo', fs.createReadStream('#asset/image/faq/ticketPrice.png'));

    const {movie, dateTime, experience} = currentSession.bookingInfo;

    let caption = "";
    if(experience != null && movie != null && dateTime.start != null){
        const isPlatinum = experience == 'Regular';
        const price = calculatePrice({dateTime: dateTime.start, isPlatinum: isPlatinum, movie: movie});
        caption = `Referring to the table above, the ticket price for ${movie.title} is ${price} :) `;

    }else if(experience != null && dateTime.start != null){
        const isPlatinum = (experience != 'Regular');
        const dayName = dateTime.start.toLocaleDateString('en-US', {weekday: 'long'});

        if([1,2,3,4].includes(dateTime.start.getDay())){
            if(isPlatinum){
                caption = `As shown in the table, platinum ticket costs $28/$38 on ${dayname}, `+
                            'the actual price depends on the debut date of the movie (shrug) ';
            }else{
                caption = `As shown in the table, regular ticket costs $9.50/$9.00 on ${dayname}, `+
                            'the actual price depends on the debut date of the movie (shrug) ';
            }
        }else{
            if(isPlatinum){
                caption = `On ${dayName}, a platinum movie ticket costs $38 (no matter the debut date of the movie!) `;
            }else{
                caption = `On ${dayName}, a regular ticket is costs $13.00/$13.50, `+
                            'the actual price depends on the debut date of the movie (shrug) ';
            }
        }

    }else if(experience != null){
        const isPlatinum = (experience != 'Regular');
        if(isPlatinum){
            caption = "A platinum ticket for a premium experience! One ticket for either $28 or $38. "+
                        "For more details please refer to the attached diagram :) ";
        }else{
            caption = "Depending on various factors, a regular ticket could cost from $9.00/$9.50 to $13.00/$13.50. "+
                        "Please refer to the attached diagram for more details :) ";
        }

    }else if(dateTime.start != null){
        const dayName = dateTime.start.toLocaleDateString('en-US', {weekday: 'long'});
        if([1,2,3,4].includes(dateTime.start.getDay())){
            caption = `A regular ticket costs $9.00/$9.50 on ${dayName}. For more details please refer to the attached diagram :) `;
        }else{
            caption = `A regular ticket costs $13.00/$13.50 on ${dayName}. For more details please refer to the attached diagram :) `;
        }

    }else{
        caption = "Here you go! The full pricing of our tickets~";
    }

    if(customerType !== '' && customerType !== 'adult'){
        caption += `**We currently do not support special price for ${customerType}**`
    }
    formData.append('caption', caption);
    console.log("Ticket price respond: ", caption);

    await sendPhoto(formData);

}