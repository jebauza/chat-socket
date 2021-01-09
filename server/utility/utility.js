const createMsg = (from, to, message) => {
    return {
        from,
        to,
        message,
        date: new Date().getTime()
    };
}





module.exports = {
    createMsg
}