const express = require("express");
const app = express();

app.use("/about",function(request,response){
    console.log(request.query);
    let n = request.query.name;
    let texttt = "<ul>";
    for(let i = 0;i<n.length;i++){
        texttt = texttt + "<li>" + n[i] + "</li>";
    }
    texttt = texttt + "</ul>";
    response.send(texttt);
})
app.listen(3000);