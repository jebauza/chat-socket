const createMsg = (name, message) => {
    return {
        name,
        message,
        data: new Date().getTime()
    };
}





module.exports = {
    createMsg
}