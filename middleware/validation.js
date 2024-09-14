const {body} = require("express-validator");

const validationSChema = () => {
    return body().isEmpty();
}


module.exports = {
    validationSChema
}; 