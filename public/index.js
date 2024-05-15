
const show_hide_password_button = document.getElementById('show_hide_password');
let is_password_shown = false;
const username_input =  document.getElementById('username');
const password_input = document.getElementById('password');
const submit_button =  document.getElementById('submit');
const reset_password_button = document.getElementById('reset_password');

show_hide_password_button.addEventListener('click', e => {
    showOrHidePassword();
});

reset_password_button.addEventListener('click', e => {
    openResetPasswordPage();
});
submit_button.addEventListener('click', e => {
    // sendRequest('test','POST',{"name":"Adrian"});
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
    const response = await sendRequest("auth",'POST',requestBody);

    


    // await console.log('RESPONSE: '+response);
    // if(pass.length <6){

    //     console.log('password < 6 chars');
    
        // await createNotyBar('error','Incorrect username or password');
        // const noty = await document.getElementById('noty');
        // fadeIn(noty);
        // await delay(1500);
        // fadeout(noty);
    // }
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
async function fadeout(element){
for (let index = 10; index >0; index--) {
  await delay(50);
  element.style.opacity = index/20;
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
        // if (response.ok){
        //     console.log('authenticated');
        //     console.log(JSON.stringify(response.body));
        //     // const data = response.json();
        //     // createNoty('success',data);
        // }else{
        //     console.log('unauthorized');
        // }
        return response.json();
    }).then(data => {
        console.log(data);
        if( data.status == "unauthorized" ){
            console.log('USER UNAUTHORIZED');
            createNoty('error',data.message);
        }else{
            console.log('USER AUTHORIZED');
            createNoty('success',data.message);
        }
        
    });


        // if (!response.ok) {
        // //   throw new Error('Network response was not ok');
        // }
        // return response.json();
    // }).then(data => {
    //     console.log(data);
    //     // createNotyBar('error', 'Incorrect username or password.');
    //     return data;
    // }).catch(error => {
    //     console.error('Error:', error);
    //     return data;
    // });
    // await createNotyBar('error','test123');
}
async function createNoty(type,message){
    console.log('CREATE NOTY BAR');
    const noty = await createNotyBar(type,message);
    await fadeIn(noty);
    await delay(1500);
    await fadeout(noty);
}

