
const baseurl = "http://localhost:3000";

document.getElementById('logout').addEventListener('click', function(){
    localStorage.removeItem("loginData");
    alert('redirecting to home page ...');
    window.location.href = 'index.html';
}); 

let logindata = JSON.parse(localStorage.getItem("loginData"));
if(logindata == null){
    alert('please login....');
    window.location.href = 'login.html';
}

document.getElementById("user-name").textContent = `Welcome, ${logindata.name}`;

let form = document.getElementById('todoform');
form.addEventListener('submit', async function(){
    event.preventDefault();
    let title = form.title.value;
    let deadline = form.deadline.value;
    let priority = form.priority.value;
    let todoObj = {title, deadline, priority, status:false};

    try {
        fetch(`${baseurl}/todos`,{
            method: 'POST',
            headers: {
                'content-type' : 'application/json',
            },
            body: JSON.stringify(todoObj),
        });
        alert('Todo added successfully');
    } catch(err){
        console.log("Error in adding Todo: ", err);
    }
})