class TestController{
    get(request, response){
        response.send('Test hecho')
    }
}

const testController = new TestController()
export default testController