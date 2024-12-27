
const baseurl = "http://localhost:3000";

let addTodoDiv = document.getElementById('add-todo');

document.getElementById('close_modal').addEventListener('click', function(){
    addTodoDiv.style.display = 'none';
});

document.getElementById('add_todo_btn').addEventListener('click', function(){
    addTodoDiv.style.display = 'flex';
})

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

document.getElementById("user-name").textContent = `Welcome, ${logindata.username}`;

let form = document.getElementById('form');

if(document.getElementById('form')){
    form.addEventListener('submit', async function(){
        event.preventDefault();
        let title = form.title.value;
        let deadline = form.deadline.value;
        let priority = form.priority.value;
        let todoObj = {
            title, 
            deadline, 
            priority, 
            status:false, 
            userId:logindata.id
        };
    
        let method = form.submit.value == "Add Todo" ? 'POST' : 'PATCH';
        let url = method == 'POST' ? `${baseurl}/todos` : `${baseurl}/todos/${form.todoId.value}`;
        let message = method == 'POST' ? "Todo Added" : "Todo Edited...";
    
        try {
            fetch(url,{
                method,
                headers: {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify(todoObj),
            });
            alert(message);
            loadData();
            addTodoDiv.style.display = "none";
        } catch(err){
            alert('something went wrong !!');
            console.log("Error in adding Todo: ", err);
        } finally {
            form.reset();
        }
    });
}

async function loadData() {
    let arr = await getTodos();
    displayTodos(arr);
}

async function getTodos(){
    try{
        let res = await fetch(`${baseurl}/todos`);
        let data = await res.json();
        let userTodos = data.filter((el, i) => el.userId == logindata.id);
        return userTodos;
    } catch(err){
        console.log("Error in gettion Todos :", err);
        alert('Something went wrong in getting Todos');
    }
}

function displayTodos(arr){
    let cont = document.getElementById('todo-container');
    cont.innerHTML = '';

    arr.map((el, i) => {
        let card = document.createElement('div');
        card.setAttribute("class", "todo-card");

        let title = document.createElement('h4');
        title.textContent = `Title: ${el.title}`;

        let deadline = document.createElement('h4');
        deadline.textContent = `Deadline: ${el.deadline}`;

        let priority = document.createElement('h4');
        priority.textContent = `Priority: ${el.priority}`;

        let date = new Date(el.deadline);
        if(date < Date.now() && el.status == false){
            card.classList.add("Pending");
        }
        let status = document.createElement('h4');
        status.textContent = el.status == true ? "Status: Completed" : "Status: Pending" ;

        let updateStatusButton = document.createElement('button');
        updateStatusButton.setAttribute('class', "todobtns");
        updateStatusButton.textContent = `Toggle Status`;
        updateStatusButton.addEventListener('click', async function (){
            updateStatusfn(el, i);
        });

        let editTodoButton = document.createElement('button');
        editTodoButton.setAttribute('class', 'todobtns');
        editTodoButton.textContent = `Edit Todo`;
        editTodoButton.addEventListener('click', async function() {
            editTodofn(el);
        });

        let deletTodoButton = document.createElement('button');
        deletTodoButton.setAttribute('class', 'todobtns');
        deletTodoButton.textContent = `Delete Todo`;
        deletTodoButton.addEventListener('click', async function(){
            deleteTodofn(el, i);
        });

        card.append(
            title,
            priority,
            deadline,
            status,
            editTodoButton,
            updateStatusButton,
            deletTodoButton,
        );
        cont.append(card);

    });
}

window.onload = async () => {
    let arr = await getTodos();
    displayTodos(arr);
  };

async function updateStatusfn(el, i) {
    let updatedTodo = {...el, status: !el.status };

    let todoId = el.id;

    try {

        await fetch(`${baseurl}/todos/${todoId}`, {
            method : 'PATCH',
            headers : {
                'content-type' : 'application/json',
            },
            body: JSON.stringify(updatedTodo),
        });
        alert("Todo Status Updated.....");
        loadData();
    } catch(err){
        console.log("Error in updating Todo...", err);
    }

}

async function editTodofn(todo) {
    document.getElementById('add_update_todo').textContent = "Edit Todo";
    addTodoDiv.style.display = "flex";
    form.todoId.value = todo.id;
    form.title.value = todo.title;
    form.deadline.value = todo.deadline;
    form.priority.value = todo.priority;
    form.submit.value = "Edit Todo";
}

async function deleteTodofn(el,i){
    let todoId = el.id;

    try{
        await fetch(`${baseurl}/todos/${todoId}`, {
            method : 'DELETE',
        });
        alert("Todo deleted....");
        loadData();
    } catch(err){
        alert('something went wrong ..');
        console.log("Error in deleting Todo...", err);
    }
}

if(document.getElementById('get_stats')){
    let getStats = document.getElementById('get_stats');
    getStats.addEventListener('click', async function(){
        let data = await getTodos();
        let completedTasks = data.filter((el,i) => el.status == true).length;
        let pendingTasks = data.filter((el,i) => el.status == false).length;
        let highPriorityTasks = data.filter((el,i) => el.priority == 'high').length;
        let mediumPriorityTasks = data.filter((el,i) => el.priority == 'medium').length;
        let lowPriorityTasks = data.filter((el, i) => el.priority == 'low').length;

        let card = `
        <style>
            #get_stats_data{
                font-size: 1rem;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
                padding-left: 5px;
            }
            #get_stats_data > h3{
                margin-bottom : 5px;
                color : blue;
            }
        </style>
        
        <div id="get_stats_data">
            <h2> Here is Summary of the Tasks Created by <span> ${logindata.username} </span> </h2>
            <h3> Completed Tasks : ${completedTasks} </h3>
            <h3> Pending Tasks : ${pendingTasks} </h3>
            <h3> High Priority Tasks : ${highPriorityTasks} </h3>
            <h3> Medium Priority Tasks : ${mediumPriorityTasks} </h3>
            <h3> Low Priority Tasks : ${lowPriorityTasks} </h3>   
        </div>`;

        addTodoDiv.style.display = "flex";
        document.getElementById('modal_content').innerHTML = card;
    });
}

