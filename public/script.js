const output = document.getElementById("div2");
const ul = document.getElementById("list");
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const taskbox = document.getElementById("taskbox");
const taskStatus = document.getElementById("taskStatus");


var tasks = [];

var listId = Date.now();

function pushTaskOnUiFromServer() {
    const request = new XMLHttpRequest();

    request.open("GET", "/getTask");
    request.send();

    request.addEventListener("load", () => {
        tasks = JSON.parse(request.responseText);
        //console.log(tasks);
        ul.innerText = "";
        if (tasks.length) {
            tasks.forEach(val => {
                addTask(val);
            })
        }
    })
}

pushTaskOnUiFromServer();

btn.addEventListener("click", function (events) {
    var task = input.value;

    let file = document.getElementById("file");
    let fileImage = file.files[0];
    events.preventDefault();
    let formData = new FormData();
    formData.append('avatar', fileImage);
    const req = new XMLHttpRequest();
    req.open("post", "/image");
    req.send(formData);
    req.addEventListener("load", function () {
        console.log(req.response)
    })

    if (!task.trim().length) {
        var div3 = document.getElementById("div3");
        var error = document.createElement("p");
        error.setAttribute("class", "error");
        error.innerHTML = "Oops! Please input valid task!!";
        div3.appendChild(error);
        setTimeout(function () {
            error.remove();
        }, 1000)
        input.value = "";
        return;
    }
    else {
        let newId = listId;
        var todo = {
            name: task,
            id: newId,
            isCompleted: false,
            path: "images/" + fileImage.name
        }
        tasks.push(todo);
        // addTaskToLocalStorage(tasks);
        addTaskToServer(tasks);
        input.value = "";
        file.value = null;
        ++listId;
    }
})

// function addTaskToLocalStorage(tasks) {
//     let stringyForm = JSON.stringify(tasks);
//     localStorage.setItem("task", stringyForm);
//     pushTaskOnUi(tasks);
// }

function addTaskToServer(val) {
    const request = new XMLHttpRequest();

    request.open("POST", "/save");
    request.setRequestHeader("Content-type", "application/json");

    request.send(JSON.stringify(val));

    request.addEventListener("load", function () {
        //console.log(request.responseText);
        pushTaskOnUiFromServer();
    })
}

function addTask(value) {
    const li = document.createElement("li");
    li.setAttribute("id", `li${value.id}`);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "check");
    checkbox.checked = value.isCompleted;


    const textNode = document.createTextNode(value.name);

    const label = document.createElement("label");
    label.setAttribute("id", value.id);
    label.appendChild(textNode);

    const edtButton = document.createElement("button");//Button
    edtButton.setAttribute("type", "checkbox");//checkbox
    //edtButton.setAttribute("src","\\edit.svg.png");
    edtButton.setAttribute("class", "edtbtn");
    edtButton.innerHTML = "E";
    edtButton.addEventListener("click", function () {
        editTask(value);
    })

    const img = document.createElement("img");
    img.src = value.path;
    img.setAttribute("class", "img");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.setAttribute("class", "dltButton");
    deleteButton.addEventListener("click", function () {
        deleteTask(value.id);
    });

    checkbox.addEventListener("change", function () {
        checkStatus(value.id);
    })

    li.appendChild(deleteButton);
    li.appendChild(edtButton);
    li.appendChild(checkbox);
    li.appendChild(img);
    li.appendChild(label);
    ul.appendChild(li);

    const hrLine = document.createElement("hr");
    ul.appendChild(hrLine);
}
function checkStatus(id) {
    tasks.forEach(function (value) {
        if (value.id === id)
            value.isCompleted = !value.isCompleted;
    })
    //addTaskToLocalStorage(tasks);
    addTaskToServer(tasks);
}

function deleteTask(id) {
    // console.log(id);
    tasks = tasks.filter(value => {
        return value.id !== id;
    })

    addTaskToServer(tasks);
    // addTaskToLocalStorage(tasks);
}

function editTask(value) {
    //console.log();
    // console.log("edit button clicked");
    taskbox.style.display = "none";
    taskStatus.innerText = "EDIT TASK";

    var div3 = document.getElementById("div3");

    var input = document.createElement("input");
    input.setAttribute("id", "edit");
    input.setAttribute("type", "text");
    //input.setAttribute("placeholder", "Edit task ...");
    input.value = value.name;

    div3.appendChild(input);

    input.addEventListener("keyup", function (events) {
        if (events.keyCode === 13) {
            var task = input.value;
            if (!task.trim().length) {
                var div3 = document.getElementById("div3");
                var error = document.createElement("p");
                error.setAttribute("class", "error");
                error.innerHTML = "Oops! Please input valid task!!";
                div3.appendChild(error);
                setTimeout(function () {
                    error.remove();
                }, 1000)
                input.value = "";
                return;
            }
            else {
                tasks.forEach(function (val) {
                    if (val.id === value.id)
                        value.name = task;
                })
                //addTaskToLocalStorage(tasks);
                taskbox.style.display = "block";
                taskStatus.innerText = "ADD NEW TASK";
                addTaskToServer(tasks);
                input.remove();
            }
        }
    }
    )
}