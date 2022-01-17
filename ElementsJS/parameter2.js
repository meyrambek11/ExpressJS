function myFunction(){
    const obj = document.getElementById("id1");
    const res = document.getElementById("demo")
    if(obj.checkValidity() === true){
        res.innerHTML = "Input, OK";

    }else{
        res.innerHTML = obj.validationMessage
    }
    //window.history.back()
    //window.history.forward()
    //window.history.go(-2)
}