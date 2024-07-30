let form = document.querySelector("#form")
let username = document.querySelector("#username")
let email = document.querySelector("#email")
let password = document.querySelector("#pass")
let cpassword = document.querySelector("#cpass")
let btn = document.getElementById("signbtn")


form.addEventListener('submit',(e)=>{
   

    if(!validateInputs()){
        e.preventDefault();
    }
});

const setError = (element,message)=>{
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')

};

const setSuccess = (element)=>{
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');

};

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};



const validateInputs = ()=>{
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const cpasswordValue = cpassword.value.trim();
    let success = true

    if(usernameValue===''){
        success = false;
        setError(username,'Username is required')
    }else{
        setSuccess(username);
    }

    if(emailValue===''){
        success=false;
        setError(email, 'Email is Required')
    }else if(!isValidEmail(emailValue)){
        success=false;
        setError(email,'provide a valid email address')
    }else{
        setSuccess(email)
    }

    if(passwordValue===''){
        success=false;
        setError(password,'Pessword is required')
    }else if(passwordValue.length < 8){
        success=false;
        setError(password,'Password must be at least 8 character.')
    }else{
        setSuccess(password)
    }

    if(cpasswordValue===''){
        success=false;
        setError(cpassword,'please confirm your password')
    }else if (cpasswordValue !== passwordValue){
        success=false;
        setError(cpassword,"password doesn't Match")
    }else{
        setSuccess(cpassword)
    }
    return success;

}