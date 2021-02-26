let urlInput = "";
let generatedLink = "";

$(document).ready(function() {

    urlInput = document.getElementById("endpointUrl");
    linkTextArea = document.getElementById("generatedLink");


});

function generateLink(){
    

    template = '<a href="http://localhost:3200/signin?redirect=RESTENDPOINT" style="background-color:#007bff; border-color:#007bff;color:#fff;cursor:pointer;line-height:3rem; font-size:1.5rem; border-radius:0.3rem;display:inline-block;text-decoration:none; border:1px solid transparent;padding-left:16px;padding-right:16px;" >Sign In with CreditX Authenticator</a>'
    newLink =  template.replace("RESTENDPOINT", urlInput.value);

    linkTextArea.innerHTML = newLink
}
