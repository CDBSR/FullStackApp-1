// scripts
import { renderNavbar } from "./navbar.js";
import { renderFooter } from "./navbar.js";
import { baseurl } from "./baseUrl.js";

// // initialize navbar and footer on all pages
renderNavbar();
renderFooter();


if(document.getElementById('signUpForm')){
    let signUpform = document.getElementById('signUpForm');
    signUpform.addEventListener('submit', async function(event) {
        event.preventDefault();

        let username = signUpform.username.value;
        let email = signUpform.email.value;
        let password = signUpform.password.value;
        let userObj = { username, email, password };

        if(!username || !email || !password){
            alert('All fields are required. please fill in all details');
            return;
        }

        try {
            let res = await fetch(`${baseurl}/users`);
            let data = await res.json();

            let user = data.filter(el => el.email === email);
            if (user.length !== 0) {
                alert('User already registered, please login');
                window.location.href = 'login.html';
            } else {
                let response = await fetch(`${baseurl}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userObj),
                });

                if (response.ok) {
                    alert('SignUp successful');
                } else {
                    alert('Failed to sign up. Please try again.');
                }
            }
        } catch (err) {
            console.log(err);
            alert('Something went wrong, please try again later');
        }
    });
}


if(document.getElementById('loginForm')){
    let loginform = document.getElementById('loginForm');
    loginform.addEventListener('submit', async function(event) {
        event.preventDefault();

        let email = loginform.email.value;
        let password = loginform.password.value;

        if(!email || !password){
            alert('All fields are required. please fill in all details');
            return;
        }

        try {
            let res = await fetch(`${baseurl}/users`);
            let data = await res.json();

            let user = data.filter(el => el.email === email);
            if (user.length !== 0) {
                if(user[0].password == password){
                    alert('Login successfull');
                    localStorage.setItem("loginData", JSON.stringify(user[0]));
                    window.location.href = 'todos.html';
                }
                else{
                    alert('Wrong Password !!!');
                }
            }
            else {
                alert('User Not registered, please Sign up !!');
                window.location.href = 'signUp.html';
            } 
        
        } catch (err) {
            console.log(err);
            alert('Something went wrong, please try again later');
        }
    });
}


















// const baseurl = "http://localhost:3000";

// let signUpform = document.getElementById('signUpForm');
// signUpform.addEventListener('submit', function(){
//     event.preventDefault();
//     let username = signUpform.username.value;
//     let email = signUpform.email.value;
//     let password = signUpform.password.value;
//     let userObj = {username, email, password};

//     fetch(`${baseurl}/users`)
//     .then((res) => res.json())
//     .then((data) => {
//         let user = data.filter((el,i) => el.email == email);
//         if(user.length != 0){
//             alert('User already registered, please login');
//         }
//         else {
//             fetch(`${baseurl}/users`, {
//                 method: 'POST',
//                 headers: {
//                     'content-type': 'application/json',
//                 },
//                 body: JSON.stringify(userObj),
//             }).then(() => {
//                 alert('SignUp successfull');
//             });
//         }
//     })
//     .catch((err) => {
//         console.log(err);
//         alert('Something went wrong, please try again later');
//     });
// });

