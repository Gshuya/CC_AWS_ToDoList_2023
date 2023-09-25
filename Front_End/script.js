var apiGatewayUrl = "https://eapp0mlpa0.execute-api.us-east-1.amazonaws.com";
//var items = [];//array for to-do-s
var count = 0;//COUNTER FOR ID
var lister = document.querySelector('ul');
var fltr = "all";//filter default value is 0(all)

addItem = () => {//ADD ITEM FROM FORM FUNCTION
    let todo = document.getElementById("inp").value;
    let priorityGet = document.getElementById("priority").value;

    if(todo && priorityGet){//CHECK IF NOT EMPTY

        
        // Prompt for user verification
        var email = prompt("Please enter your email:");
        var password = prompt("Please enter your password:");

        if (!(email && password)) {
            alert("Required user verification!");
        }

        // Make a POST request to the API Gateway endpoint to add the item
        fetch(`${apiGatewayUrl}/put`, {
            method: 'POST',
            body: JSON.stringify({ "id":email,
                                    "task": todo,
                                    "priority": priorityGet,
                                    "password": password }),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("inp").value = "";//CLEAR FIELD
            if (data == "Authentication error"){
                alert("Required registration!");
                window.location.href = "./Signup.html";
                return;
            }else{
                //FIRST, REMOVE ALL PREVIOUS ELEMENTS
                let remove = document.getElementById("todos");
                while (remove.hasChildNodes()) {
                    remove.removeChild(remove.firstChild);
                }
                let tag = document.createElement("li");
                tag.setAttribute("id",0);
                let text = document.createTextNode("Task created successfully!");//the description of the to-do
                tag.appendChild(text);
                document.getElementById("todos").appendChild(tag);
                
                count++;
            }
            
        })

        
    }
    else alert("Type something");//no null values
    
}

//DISPLAYING ALL THE TO_DO-s
displayList = list => {

    //FIRST, REMOVE ALL PREVIOUS ELEMENTS
    let remove = document.getElementById("todos");
    while (remove.hasChildNodes()) {
        remove.removeChild(remove.firstChild);
    }

    changeInfo(list);
    if(list.length == 0){return;}//if the list is empty, return

    list.map((elem,index) => {
        let tag = document.createElement("li");//create the li element of the list
        tag.setAttribute("id",index);

        let text = document.createTextNode(elem.task);//the description of the to-do
        tag.appendChild(text);

        let span = document.createElement("SPAN");//the delete button
        span.setAttribute("class","close");
        span.setAttribute("onclick", `deleteCurrent(["${elem.id}", "${elem.task}"])`)//using onclick function
        text = document.createTextNode("X");
        span.appendChild(text);
        tag.appendChild(span);

        let br = document.createElement("hr");//for separation
        tag.appendChild(br);

        text = document.createTextNode(`Priority: ${elem.priority}`);//element priority display
        tag.appendChild(text);
        document.getElementById("todos").appendChild(tag);//append all the info of the list element 
    })
}



//DELETE ITEM FROM LIST WITH API Gateway DELETE REQUEST
deleteCurrent = datalist => {
    // Make a DELETE request to the API Gateway endpoint to delete the item
    console.log(datalist);
    const id = datalist[0];
    const task = datalist[1];
    console.log(id);
    console.log(task);
    fetch(`${apiGatewayUrl}/delete`, {
        method: 'POST',
        body: JSON.stringify({ "id":id,
                                "task":task}),
    });
    
    //FIRST, REMOVE ALL PREVIOUS ELEMENTS
    let remove = document.getElementById("todos");
    while (remove.hasChildNodes()) {
        remove.removeChild(remove.firstChild);
    }
    let tag = document.createElement("li");
    tag.setAttribute("id",0);
    let text = document.createTextNode("Task deleted successfully!");//the description of the to-do
    tag.appendChild(text);
    document.getElementById("todos").appendChild(tag);
}


//SORT WITH FILTER TO NEW LIST
sortList = pr => {
    let remove = document.getElementById("todos");
    while (remove.hasChildNodes()) {
        remove.removeChild(remove.firstChild);
    }
    changeInfo([]);
    var email = prompt("Please enter your email:");
    var password = prompt("Please enter your password:");
    var vemail = JSON.stringify(email);
    var vpassword = JSON.stringify(password);
    

    if(!(email && password)){
        alert("Required user verification!");
        return;
    }
    
    if(pr != "all"){//if there is a filter applied
            pr = JSON.stringify(pr);
            fetch(`${apiGatewayUrl}/get?id=${vemail}&password=${vpassword}&priority=${pr}`,{
            method: 'GET'})
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.length ==0){
                    let tag = document.createElement("li");
                    tag.setAttribute("id",0);
                    let text = document.createTextNode("No tasks found!");//the description of the to-do
                    tag.appendChild(text);
                    document.getElementById("todos").appendChild(tag);
                    return;
                }
                if (data == "Authentication error"){
                    alert("Required registration!");
                    window.location.href = "./Signup.html";
                    return;
                }else{
                    displayList(data);
                    fltr = pr;
                }
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });       
    }
    else {  console.log("vemail", vemail);
            console.log("vpassword", vpassword);
            fetch(`${apiGatewayUrl}/getalltask?id=${vemail}&password=${vpassword}`,{
            method: 'GET'})
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.length ==0){
                    let tag = document.createElement("li");
                    tag.setAttribute("id",0);
                    let text = document.createTextNode("No tasks found!");//the description of the to-do
                    tag.appendChild(text);
                    document.getElementById("todos").appendChild(tag);
                    return;
                }
                if (data == "Authentication error"){
                    alert("Required registration!");
                    window.location.href = "./Signup.html";
                    return;
                }
                else{
                    displayList(data);
                    fltr = "all";}
            });
        }
   
}


//change the counter of to-do-s that is displayed
changeInfo = nr => {
    document.getElementById("inf").innerHTML = nr.length;//change innerHTML to display number
}


