const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const indicator = document.querySelector("[data-indicator]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const copyMsg = document.querySelector("[data-copyMsg]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const copyBtn = document.querySelector("[data-copy]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
const copyImg= document.querySelector(".copy-img")
let password="";
let passwordLength=8;
let checkCount=0;
setIndicator("#ccc");
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;
    console.log("length display is set")
    const minN=inputSlider.min;
    const maxX=inputSlider.max;
    const x=(passwordLength - minN) * 100 / (maxX - minN);
    console.log(x);
    inputSlider.style.backgroundSize=`${x}% 100%`;
    console.log("slider kardia");
}
handleSlider();  //ui ko update karna based on password length jo m select karuga

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML='Copied';
    }

    catch(e){
        copyMsg.innerHTML='Failed';
    }

    copyMsg.classList.add('tooltip');

    setTimeout(()=>{
        copyMsg.classList.remove('tooltip');
        copyImg.classList.add('tooltip2');
        copyMsg.innerHTML="";
    },2000);
}
function handleCheckBoxManage(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxManage)
})


inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generateBtn.addEventListener('click',()=>{
    if(checkCount==0){
        return;
    }
    // if(passwordLength<checkCount){
    //     passwordLength=checkCount;
    //     handleSlider();
    // }

    console.log("Starting the Journey");
    password="";
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");
    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("random adddition done");

    //shuffling the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    console.log("UI adddition done");
    calcStrength();
});
