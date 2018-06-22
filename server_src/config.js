
const secret = 'ForeverAut';
const admin = {
    email: 'pax.artics@gmail.com',
    lockword: 'q4EdPikOtiK7991dE39',
    password: 'admin'
};
const recapchar = {
    secret: '6LelPF8UAAAAABqpdKNV8svKtP1HOE96lUm4Lsiu'
}
//millisecord
const time_email_validate_expired = 5 * 60 * 1000;
const serverhost = 'http://localhost:3000';
const webhost = 'http://localhost:8080';
const timeSchedule = '*/5 * * * * *';

const unlock = (str) => {
    return str.toLowerCase().slice(2 * 2 + 1 - 1, 2 * 2 - 1 + 11 + 1).split('').reverse().join('');
}

const interal_error = (err) => {
    return { message: (((err || {}).parent || {}).sqlMessage || 'error')}
};

module.exports = {
    secret,
    admin,
    time_email_validate_expired,
    serverhost,
    webhost,
    unlock,
    interal_error,
    recapchar,
    timeSchedule
};