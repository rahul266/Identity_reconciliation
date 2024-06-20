const Joi = require('joi')
const { STATUS } = require('../../constant');
const contactsService=require('../service/contactsService')

identityValidator = () => {
    return Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }),
        phoneNumber: Joi.string().pattern(/^\d+$/),
    }).or('email', 'phoneNumber');
};

/**
 * This method constructs error response object
 * @param {*} error 
 * @returns {Object}
 */
const getFailureResponse = (error) => {
    let json = {
        code: Number(error.code),
        type: error?.name || STATUS[error.code],
        message: error.message,
        data: error?.data
    };
    return json;
};
/**
 * Method to creates response object 
 * @param {*} err 
 * @param {*} responseData 
 * @return {Object}
 */
responseBuilder = (err, responseData) => {
    if (err) {
        return {
            error: getFailureResponse(err)
        };
    }
    let { data, message } = responseData;
    return { data, message };
};

exports.getContctsController = () => {
    return async (req, res) => {
        const { error, value } = identityValidator().validate(req.body)
        if (error) {
            res.send(error)
        }
        const data = await contactsService.identifyCustomer(value)
        res.send(data)
    }
}

