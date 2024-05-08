function error (message, code) {
    let e = new Error(message);

    if(code) {
        e.statusCode = code; //status probar canmbiandolo
    }

    return e;
}

module.exports = error;