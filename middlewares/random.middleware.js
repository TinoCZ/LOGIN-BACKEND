
//logger


function randomMiddleware (request, response, next){

    //Determina la suerte del cliente
    const numero = Math.random()


    /* 
    Un middleware si quiere puede comunicarse con el controlador mediante request
    */
    if(numero >= 0.5){
        request.suerte = true
    }
    else {
        request.suerte = false
    }

    next()
}

export default randomMiddleware