'use strict';

const fortunes = [
    'A horse sized duck or 100 duck sized horses?',
    'Say no, then negotiate.',
    'Time and tide wait for no one.',
    'To teach is to learn.',
    'Phone a friend.',
    'Llamas are awesome.',
    'Alpacas are awesome.',
    'Never ask the barber if you need a haircut.',
    'We sing in the shower, too.',
    'Fortune favors the lucky.',
    'Don\'t worry, be happy.',
    'Hope all is well.',
    'Have a great day!'
];

const fortune = () => {
    const random = Math.trunc(Math.random() * fortunes.length);
    return fortunes[random];
};

module.exports = fortune;
