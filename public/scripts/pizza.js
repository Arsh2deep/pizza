document.getElementById("pizza-form").onsubmit = () => {

    let isValid = true;

    clearErrors();

    //First name
    let fname = document.getElementById("fname").value.trim();
    if(fname || lname || email === ""){
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }
    //last name
    let lname = document.getElementById("lname").value.trim();
    if(lname === ""){
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }
    //Email
    let email = document.getElementById("email").value.trim();
    if(email === ""){
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    //validate method: pickup or delivery
    let methodSelected = false;
    let methodButtons = document.getElementById("method");
    for(let i=0; i<methodButtons.length; i ++){
        if(methodButtons[i].checked){
            methodSelected = true;
        }
    }
    if(!methodSelected){
        document.getElementById("err-method").style.display = "block";
        isValid = false;
    }

    //validate pizza size
    let size = document.getElementById('size').value;
    if(size === 'none'){
        document.getElementById("err-size").style.display = "block";
        isValid = false;
    }   


    // do not submit the form if data is in-valid
    return isValid;
    
};

function clearErrors(){
    let errors = document.getElementsByClassName("error");
    for(let i =0; i<errors.length;i++){
        errors[i].style.display = "none";
    }
}
