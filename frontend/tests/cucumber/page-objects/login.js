const { client } = require('nightwatch-api');

const CREDENTIALS = {
    valid: {
        user: 'MEYER',
        pass: '12345'
    },
    invalid: {
        user: 'MEYER',
        pass: 'nixda'
    }
};
const ELEMENTS = {
    tf_username: 'input[id="username"]',
    tf_password: 'input[id="password"]',
    btn_sign_in: 'input[id=kc-login]',
    span_input_error: 'span[id="input-error"]'
};
const LOGINPAGE = {
    elements: ELEMENTS,
    credentials: CREDENTIALS
}

const login = function (username, password) {
    return client
    .assert.visible(ELEMENTS.tf_username)
    .setValue(ELEMENTS.tf_username, username)
    .assert.visible(ELEMENTS.tf_password)
    .setValue(ELEMENTS.tf_password, password)
    .assert.visible(ELEMENTS.btn_sign_in)
    .click(ELEMENTS.btn_sign_in);
}

// module.exports = {
//     ELEMENTS: ELEMENTS,
//     CREDENTIALS: CREDENTIALS,
//     login: login
// }
exports.loginpage = LOGINPAGE;
exports.CREDENTIALS = CREDENTIALS;
exports.login = login;
