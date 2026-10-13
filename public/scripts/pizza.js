document.getElementById("pizza-form").onsubmit = () => {
    let isValid = true;
   
    let fname = document.getElementById("fname").value.trim();
    let lname = document.getElementById("lname").value.trim();
    let email = document.getElementById("email").value.trim();

    if(fname || lname || email === ""){
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }
  
    if(lname === ""){
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }
    
    if(email === ""){
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }
 
        // do not submit the form if data is in-valid
        return isValid;
    
};

function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for(let i =0; i<errors.length;i++){
        errors[i].style.display = "none";
    }
}
