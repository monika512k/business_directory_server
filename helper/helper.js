module.exports = {
    getCurrentYear: () => {
        return moment().format('YYYY');
    },

    validationErrorConvertor: (validation) => {
        let error=Object.values(validation.errors)[0].message
        return error;
    },
    generateRandomPassword: () => {
        const randomString = Math.random().toString(36).slice(-6);
        return randomString;
    },
 
};