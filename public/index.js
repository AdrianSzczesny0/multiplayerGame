
const login_modal = document.getElementById('login_modal');
const show_hide_password_button = document.getElementById('show_hide_password');
let is_password_shown = false;
const username_input =  document.getElementById('username');
const password_input = document.getElementById('password');
const submit_button =  document.getElementById('submit');
const reset_password_button = document.getElementById('reset_password');
let is_user_logged_in = false;
show_hide_password_button.addEventListener('click', e => {
    showOrHidePassword();
});

reset_password_button.addEventListener('click', e => {
    openResetPasswordPage();
});
submit_button.addEventListener('click', e => {
    processLogin();
});

function showOrHidePassword(){
    console.log('clicked show pass');
    if( !is_password_shown ){
        show_hide_password_button.classList.remove('fa-eye-slash');
        show_hide_password_button.classList.add('fa-eye');
        password_input.style.setProperty('-webkit-text-security','none');
        is_password_shown = true;
    }else{
        show_hide_password_button.classList.remove('fa-eye');
        show_hide_password_button.classList.add('fa-eye-slash');
        password_input.style.setProperty('-webkit-text-security','disc');
        is_password_shown = false;
    }
}
function testReturn(){
    return 'DUPA';
};
console.log(testReturn());

async function processLogin(){
    const username = username_input.value;
    const password = password_input.value;
    const requestBody = {
        "name":username,
        "password":password
    }
    await sendRequest("auth",'POST',requestBody);
}

async function createNotyBar(type,message){
    const noty = await document.getElementById('noty');
    if ( noty != undefined){
        noty.remove();
    }
    const notyBar = `<div class="not_wrapper" id="noty">
    <div class="notification_window ${type}">
        <div class="noty_icon_wrapper"></div>
            <i class="fa-solid fa-circle-exclamation noty_icon" id="show_hide_password"></i>
        <div class="noty_message_wrapper"></div>
        <span class="notification_message">${message}</span>
        </div>
    </div>`;
    const template = document.createElement('template');
    template.innerHTML = notyBar.trim();
    notyBarelement = template.content.firstElementChild;
    document.body.appendChild(notyBarelement);
    template.classList.add(type);
    return notyBarelement;
}
function delay(time){
    return new Promise(resolve => setTimeout(resolve, time)); 
}

async function fadeIn(element){
for (let index = 0; index <10; index++) {
  await delay(20);
  element.style.opacity = index/10;
}
}
async function fadeout(element,iterations){
if (iterations == undefined){
    for (let index = 10; index >0; index--) {
        await delay(20);
        element.style.opacity = index/20;
      }
}else{
    for (let index = iterations; index >0; index--) {
        await delay(20);
        element.style.opacity = index/20;
      }
}

element.remove();
}

async function sendRequest(route,requestMethod,requestBody){
    await fetch(`http://localhost:3100/${route}`, {
        method: requestMethod,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        if( data.status == "unauthorized" ){
            console.log('USER UNAUTHORIZED');
            createNoty('error',data.message);
        }else{
            console.log('USER AUTHORIZED');
            handleSucessfullLogin(data,requestBody.name);
        }
    });
}
async function addLocalStorageValue(key,value){
    window.localStorage.setItem(key, value);
}
async function handleSucessfullLogin(data,user_name){
    addLocalStorageValue('auth',data.token);
    addLocalStorageValue('userName',user_name);
    init();
}


async function createNoty(type,message){
    console.log('CREATE NOTY BAR');
    const noty = await createNotyBar(type,message);
    await fadeIn(noty);
    await delay(1500);
    await fadeout(noty);
}
async function fadeOutModal(element,iterations){
    await fadeout(element,iterations);
    await element.remove();
}

async function init(){
    const requestBody = {
        token: await window.localStorage.getItem('auth'),
        username: await window.localStorage.getItem('userName')
    }
    console.log(JSON.stringify(requestBody));

    await fetch(`/isAuth`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        if( data.status == "unauthorized" ){
            console.log('USER UNAUTHORIZED');
        }else{
            console.log('USER AUTHORIZED');
            createNoty('success','User successfully logged in.');
            fadeOutModal(login_modal,20);
            is_user_logged_in = true;
        }
    });
}
async function handlEnter(){
    document.body.addEventListener("keydown", (ev) =>{
        if(!is_user_logged_in){
            if(ev.key=='Enter'){
                processLogin();
            }
        }
    });
}


handlEnter();
init();

