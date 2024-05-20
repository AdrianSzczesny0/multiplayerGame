
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

function showHidePassword(){
    console.log('clicked show pass');
    const passInput = document.getElementById('repeat_password');
    if( !is_password_shown ){
        passInput.classList.remove('fa-eye-slash');
        passInput.classList.add('fa-eye');
        passInput.style.setProperty('-webkit-text-security','none');
        is_password_shown = true;
    }else{
        passInput.classList.remove('fa-eye');
        passInput.classList.add('fa-eye-slash');
        passInput.style.setProperty('-webkit-text-security','disc');
        is_password_shown = false;
    }
}

async function processLogin(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const requestBody = {
        "email":email,
        "password":password
    }
    await sendLoginRequest("auth",'POST',requestBody);
}

async function processRegister(){
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat_password').value;
    const requestBody = {
        "name":username,
        "email":email,
        "password":password,
        "rePass":repeatPassword
    }
    await sendRegisterRequest(requestBody);
}

async function createLoginFormView(){
    const loginFormView = `
    <div class="main" id="login_modal">
        <div class="window_wrapper">
            <div class="form_wrapper">
                <h1>LOGIN</h1>
                <div class="input_wrapper">
                    <span class="fieldName">Email</span>
                    <input class="input username" id="email" type="text" placeholder="Input email"></input>
                </div>
                <div class="input_wrapper no_bot_padding">
                    <span class="fieldName">Password</span>
                    <input class="input password" id="password" type="text" placeholder="Input password"></input>
                    <i class="fa-solid fa-eye-slash" id="show_hide_password"></i>

                </div>
                <div class="input_wrapper reset">
                    <span class="reset_button" id="reset_password">Reset password</span>
                </div>
                <div class="input_wrapper">
                    <button class="submit" id="submit" onClick="processLogin();">Submit</button>
                    
                </div>
                <div class="input_wrapper sign_up_wrapper">
                    <hr></hr>
                    <span class="sign_up" id="sign_up" onClick="moveToRegister();"> SIGN UP</span>
                </div>
            </div>
        </div>
    </div>
    `;
    const template = document.createElement('template');
    template.innerHTML = loginFormView.trim();
    view = template.content.firstElementChild;
    template.style.opacity=0;
    document.body.appendChild(view);
}
async function createRegisterFormView(){
    const loginFormView = `
    <div class="main register_form" id="register_form">
        <div class="window_wrapper register_wrapper">
            <div class="form_wrapper">
                <h1>SIGN UP</h1>
                <div class="input_wrapper">
                    <span class="fieldName">Username</span>
                    <input class="input username" id="username" type="text" placeholder="Input username"></input>
                </div>
                <div class="input_wrapper">
                    <span class="fieldName">E-mail</span>
                    <input class="input username" id="email" type="text" placeholder="Input user e-mail"></input>
                </div>
                <div class="input_wrapper">
                    <span class="fieldName">Password</span>
                    <input class="input password" id="password" type="text" placeholder="Input password"></input>
                </div>
                <div class="input_wrapper">
                    <span class="fieldName">Repeat password</span>
                    <input class="input password" id="repeat_password" type="text" placeholder="Repeat password"></input>
                    <i class="fa-solid fa-eye-slash" onClick="showHidePassword();"></i>
                </div>
                <div class="input_wrapper">
                    <button class="submit" id="submit" onClick="processRegister();">Submit</button>
                    
                </div>
                <div class="input_wrapper sign_up_wrapper">
                    <hr></hr>
                    <span class="sign_up" id="sign_up" onClick="moveToLogin();"> SIGN IN</span>
                </div>
            </div>
        </div>
    </div>
    `;
    const template = document.createElement('template');
    template.innerHTML = loginFormView.trim();
    view = template.content.firstElementChild;
    document.body.appendChild(view);
}
async function clearRegisterFormFields(){
    document.getElementById('username').value = '';
    document.getElementById('email').value= '';
    document.getElementById('password').value= '';
    document.getElementById('repeat_password').value = '';
}

async function createGameView(){
    const loggedInView = `    
    <div class="main_logged_in" id="main_logged_in">
        <div class="header_wrapper">
            <span class="logout_button" id="logout_button" onclick="logout();">Log out</span>
        </div>
        <div class="game_wrapper">
            <canvas id="game_canvas" class="game_canvas"></canvas>
        </div>
    </div>`;
    const template = document.createElement('template');
    template.innerHTML = loggedInView.trim();
    view = template.content.firstElementChild;
    await delay(1000);
    document.body.appendChild(view);
}

async function removeGameView(){
    const gameView = await document.getElementById("main_logged_in");
    await fadeout(gameView);
}

async function logout(){
    await removeLocalStorageValue('email');
    await removeLocalStorageValue('auth');
    await removeGameView();
    await createLoginFormView();
    is_user_logged_in=false;
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

async function sendLoginRequest(route,requestMethod,requestBody){
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
            handleSucessfullLogin(data,requestBody.email);
        }
    });
}

async function sendRegisterRequest(requestBody){
    await fetch(`http://localhost:3100/register`, {
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
        if( data.status == "fail" ){
            createNoty('error',data.message);
        }else{
            createNoty('success',data.message);
            clearRegisterFormFields();
        }
    });
}

async function removeLoginForm(){
    const loginView = await document.getElementById("login_modal");
    await fadeout(loginView);
}
async function removeRegisterView(){
    const registerView = await document.getElementById("register_form");
    await fadeout(registerView);
}

async function moveToRegister(){
    await removeLoginForm();
    await delay(200);
    await createRegisterFormView();

}

async function moveToLogin(){
    await removeRegisterView();
    await delay(200);
    await createLoginFormView();

}

async function addLocalStorageValue(key,value){
    window.localStorage.setItem(key, value);
}

async function removeLocalStorageValue(key){
    window.localStorage.removeItem(key);
}

async function handleSucessfullLogin(data,email){
    addLocalStorageValue('auth',data.token);
    addLocalStorageValue('email',email);
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
        email: await window.localStorage.getItem('email')
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
            fadeOutModal(document.getElementById('login_modal'),20);
            is_user_logged_in = true;
            createGameView();
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

