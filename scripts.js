$(document).ready(function () {
  //    $('#edit').hide()
  //    $('#list').hide()
  //    $('#add').hide()

  $('#login').on('submit', function (event) {
    event.preventDefault()
    const email = $('#loginEmail').val()
    const password = $('#loginPassword').val()
    login(email, password)
  })

  $('#register').on('submit', function (event) {
    event.preventDefault()
    let data = {}
    data.first_name = $('#regFirst_Name').val()
    data.last_name = $('#regLast_Name').val()
    data.email = $('#regEmail').val()
    data.password = $('#regPassword').val()
    register(data)
  })
  $('#login').hide()
  $('#home').show()

  home()
  checkStorage()
})

function home() {
  $('#homeContent').empty()
  hideAll()
  $('#home').show()
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/holidays'
  })

    .done(response => {
      $('#holidayList').empty()
      console.log(response)
      let today = new Date()
      let todaymonth = new Date().toLocaleString('default', { month: 'long' })
      $('#homeContent').html(`
            <h1>${todaymonth}<h1>
            <div class="column"></div>
            
        `)
      let temp = ``
      for (let i = 0; i < (new Date(today.getFullYear(), today.getMonth(), 0).getDate()); i++) {
        temp += `<div class="columns">`
        for (let o = 0; o < 7; o++) {
          //                console.log(response.data[0])
          for (let x = 0; x < response.data.length; x++) {
            //                    console.log(response.data[x])
            //                    console.log(i+1,response.data[x].date.datetime.day)
            if (today.getMonth() + 1 == response.data[x].date.datetime.month) {
              if (`${i + 1}` == `${response.data[x].date.datetime.day}`) {
                temp += `<div class="column has-text-centered" style="background-color:red;border-radius:50%;height:60px;">${i + 1}</div>`
                $('#holidayList').append(`<p>${response.data[x].date.datetime.day} : ${response.data[x].name}</p>`)
              } else if (today.getDate() == i + 1) {
                temp += `<div class="column has-text-centered" style="background-color:powderblue;border-radius:50%;height:60px;">${i + 1}</div>`
              } else {
                temp += `<div class="column has-text-centered" style="border-radius:50%;height:60px;">${i + 1}</div>`
              }
              break;
            }
          }
          i++
        }
        temp += `</div>`
        $('#homeContent').append(temp)
        temp = ``
      }

    })

    .fail(err => {
      console.log(err.responseJSON)
    })

}

function login(email, password) {
  //    const email = $('#loginEmail').val()
  //    const password = $('#loginPassword').val()
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/login',
    data: {
      email,
      password
    }
  })
    .done(response => {
      const token = response.token
      // const loginName = `${response.first_name} ${response.last_name}`
      $('#loginEmail').val('')
      $('#loginPassword').val('')
      localStorage.setItem('token', token)
      // localStorage.setItem('name', loginName)
      checkStorage()


    })
    .fail(err => {
      //      console.log(err)
      //      let error = err.responseJSON.err.split(",")
      $('#loginErrorHeader').show()
      $('#loginError').text(err.responseJSON.error)
      //      console.log(err.responseJSON)

    })
}

function checkStorage() {
  if (localStorage.token) {
    $('#landingPage').hide()
    $('#dashboardPage').show()
    $('#loggedin').show()
    $('#loggedout').hide()
    hideAll()
    $('#list').hide()
    $('#projectlist').show()
    $('#todoOption').hide()
    fetchProject()
    checkProjectSelect()
    // fetchToDo()
  } else {
    $('#landingPage').show()
    $('#dashboardPage').hide()
    hideAll()
    $('#login').hide()
    $('#loggedin').hide()
    $('#loggedout').show()
    $('#home').show()
  }
}

function checkProjectSelect(){
  if(localStorage.ProjectId){
    hideAll()
    $('#list').show()
    $('#todoOption').show()
    $('#projectTodo').html(`${localStorage.getItem('ProjectName')} ToDo List`)
    fetchToDo()
  }
}

function hideAll() {
  $('#home').hide()
  $('#edit').hide()
  $('#list').hide()
  $('#add').hide()
  $('#login').hide()
  $('#register').hide()
  $('#delete').hide()
  $('#projectlist').hide()
  $('#addProject').hide()
}

function fetchToDo() {
  console.log('f1')
  const token = localStorage.getItem('token')
  const ProjectId = localStorage.getItem('ProjectId')
  console.log('proejctid', ProjectId)
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/todos',
    headers: {
      token
    },
    data: {
      ProjectId
    }

  })
    .done(function (response) {
      console.log('todos',response.todos)
      console.log('f')
      $('#toDoTable').empty()
      $('#toDoTable').append(`
                <tr>
                    <td>Title</td>
                    <td>Description</td>
                    <td>Status</td>
                    <td>Due Date</td>
                    <td>Actions</td>
                </tr>`)
      const toDo = response.todos
      // console.log(toDo)
      $('#listtitle').html(`here's your toDo List for ${localStorage.ProjectName}`)
      //      console.log(response)
      toDo.forEach(temp => {
        var date = new Date(temp.due_date)
        $('#toDoTable').append(`
        <tr>
            <td>${temp.title}</td>
            <td>${temp.description}</td>
            <td>${temp.status ? 'completed' : 'incompleted'}</td>
            <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}</td>
            <td><button class="button is-small is-primary has-background-info" onclick="showEditPage(${temp.id},'${temp.title}','${temp.description}','${temp.due_date}',${temp.status},${temp.UserId})">edit</button>
            <button  class="button is-small is-primary has-background-danger" onclick="showRemoveConfirm('${temp.id}','${temp.title}')">delete</button></td>
        </tr><br>
         `)
      })
    })
    .fail(function (err) {
      console.log(err.responseJSON)
    })
}

function fetchProject() {
  const token = localStorage.getItem('token')
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/pass/',
    headers: {
      token
    }
  })
    .done(function (response) {
      console.log(response.data)
      // console.log('f')
      $('#projectTable').empty()
      $('#projectTable').append(`
                <tr>
                    <td>Name</td>
                    <td>Actions</td>
                </tr>`)
      const projects = response.data
      projects.forEach(temp => {
        $('#projectTable').append(`
        <tr>
            <td><a href="javascript:selectProject(${temp.Project.id},'${temp.Project.name}')">${temp.Project.name}</a></td>
            <td><button class="button is-small is-primary has-background-info" onclick="showEditProjectPage(${temp.Project.id},'${temp.Project.name}')">edit</button>
            <button class="button is-small is-primary has-background-primary" onclick="showInviteProjectPage(${temp.Project.id},'${temp.Project.name}')">invite</button>
            <button  class="button is-small is-primary has-background-danger" onclick="showRemoveProjectConfirm('${temp.Project.id}','${temp.Project.name}')">delete</button></td>
        </tr><br>
         `)
      })
    })
    .fail(function (err) {
      console.log(err.responseJSON)
    })
}

function addProject() {
  const token = localStorage.getItem('token')

  let name = $('#addProjectName').val()
  console.log(name)
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/projects/add',
    headers: {
      token
    },
    data: {
      name
    }
  })
    .done(response => {
      fetchProject()
      showProjectList()
    })
    .fail(err => {
      console.log(err.responseJSON)
      let error = err.responseJSON.err
      $('#addErrorProjectHeader').show()
      $('#addProjectError').text(error)
    })
}

function selectProject(id,name){
  $('#projectTodo').html(`${name} ToDo List`)
  localStorage.setItem('ProjectId', id)
  localStorage.setItem('ProjectName',name)
  hideAll()
  checkProjectSelect()
  
}


function register(userdata) {
  console.log(userdata)
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/register',
    data: {
      first_name: userdata.first_name,
      last_name: userdata.last_name,
      email: userdata.email,
      password: userdata.password
    }
  })
    .done(function (response) {
      $('#regFirst_Name').val('')
      $('#regLast_Name').val('')
      $('#regEmail').val('')
      $('#regPassword').val('')

      $('#register').hide()
      $('#login').show()

    })
    .fail(function (err) {
      //      let error = err.responseJSON.err.split(",")
      $('#registerErrorHeader').show()
      $('#registerError').text(err.responseJSON.error[0])
    })
}



function logout() {
  hideAll()
  $('#toDoHeader').hide()
  $('#loginHeader').show()
}

function showLogin() {
  hideAll()
  $('#loginErrorHeader').hide()
  $('#login').show()
}

function showRegister() {
  hideAll()
  $('#registerErrorHeader').hide()
  $('#register').show()
}

function showList() {
  hideAll()
  $('#list').show()
}

function showProjectList() {
  hideAll()
  $('#projectlist').show()
}

function showAddPage() {
  hideAll()
  $('#addErrorHeader').hide()
  $('#add').show()
}

function showAddProjectPage() {
  hideAll()
  $('#addErrorProjectHeader').hide()
  $('#addProject').show()
}

function addToDo() {
  const token = localStorage.getItem('token')

  let title = $('#addTitle').val()
  let description = $('#addDescription').val()
  let due_date = $('#adddue_date').val()
  let ProjectId = localStorage.getItem('ProjectId')
  //  $('#sumitLogin').addClass('is-loading')
  console.log(title, description, due_date)
  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/todos/add',
    headers: {
      token
    },
    data: {
      title,
      description,
      due_date,
      ProjectId
    }
  })
    .done(response => {
      fetchToDo()
      showList()
    })
    .fail(err => {
      let error = err.responseJSON.err
      $('#addErrorHeader').show()
      $('#addError').text(error[0])
    })
}



function showRemoveConfirm(id, name) {
  $('#delete').show()
  $('#delete').html(`<div class="box">
                    <h1 class="title">Delete?</h1>
                    <h3 style="margin-bottom:15px;">are you sure want to delete ${name} ?</h3>
                    <button class="button is-block is-danger is-large is-fullwidth" onclick="remove(${id})">Delete</button>
                    <section class="column is-small"></section>
                    <button class="button is-block is-info is-yellow is-small is-half" onclick="$('#delete').hide()">Cancel</button>
                    <div>
    `)
}

function showRemoveProjectConfirm(id, name) {
  $('#delete').show()
  $('#delete').html(`<div class="box">
                    <h1 class="title">Delete Project?</h1>
                    <h3 style="margin-bottom:15px;">are you sure want to delete ${name} ?</h3>
                    <button class="button is-block is-danger is-large is-fullwidth" onclick="removeProject(${id})">Delete</button>
                    <section class="column is-small"></section>
                    <button class="button is-block is-info is-yellow is-small is-half" onclick="$('#delete').hide()">Cancel</button>
                    <div>
    `)
}


function removeProject(id) {
  $('#delete').hide()
  const token = localStorage.getItem('token')
  $.ajax({
    method: 'delete',
    url: `http://localhost:3000/projects/delete/${id}`,
    params: { id },
    headers: { token }
  })
    .done(response => {
      fetchProject()
      showProjectList()
    })
    .fail(err => {
      console.log(err.responseJSON)
    })

}

function remove(id) {
  $('#delete').hide()
  const token = localStorage.getItem('token')
  $.ajax({
    method: 'delete',
    url: `http://localhost:3000/todos/${id}`,
    params: { id },
    headers: { token }
  })
    .done(response => {
      fetchToDo()
      showList()
    })
    .fail(err => {
      console.log(err.responseJSON)
    })

}

function showEditPage(id, title, description, due_date, status, UserId) {
  //  due_date = new Date(due_date)
  //  console.log(due_date)
  hideAll()
  var now = new Date(due_date);
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  //    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $('#edit').show()
  $('#edit').html(`<div class="box">
                    <h1 class="hero-body title">Edit ToDo</h1>
                    <article id="editErrorHeader" class="is-offset-3 message is-danger">
                                      <div class="message-header  is-half">
                                        <p>Error</p>
                                      </div>
                                      <h2 id="editError" class=""></h2>
                                    </article>
                    <h1 class="column">title</h1>
                    <input class="input is-medium" type="text" placeholder="title" id="editTitle" value="${title}"><br>
                    <h1 class="column">Description</h1>
                    <input class="input is-medium" type="text" placeholder="description" id="editDescription" value="${description}"><br>
                    <h1 class="column">Due Date</h1>
                    <input class="input is-medium" type="date" placeholder="due date" id="editdue_date" value="${now.getFullYear()}-${month}-${day}"><br>
                    <h1 class="column">Status</h1>
                    <div class="columns">
                    <div class="column"><input class="radio" type="radio" id="editStatus" name="status" value="false" ${!status ? "checked" : ""}><h2>not completed</h2></div>
                    <div class="column"><input class="radio" type="radio" id="editStatus" name="status" value="true" ${status ? "checked" : ""}><h2>completed</h2></div>
                    </div>
                    <hr class="login-hr">
                    <button class="button is-block is-info is-large is-fullwidth" onclick="update('${id}','${title}','${description}','${due_date}','${status}','${UserId}')">Edit</button>
                    <div>
    `)
  $('#editErrorHeader').hide()
}

function showEditProjectPage(id, name) {
  console.log(id)
  hideAll()
  $('#edit').show()
  $('#edit').html(`<div class="box">
                    <h1 class="hero-body title">Edit Project</h1>
                    <article id="editErrorProjectHeader" class="is-offset-3 message is-danger">
                                      <div class="message-header  is-half">
                                        <p>Error</p>
                                      </div>
                                      <h2 id="editProjectError" class=""></h2>
                                    </article>
                    <h1 class="column">Project Name</h1>
                    <input class="input is-medium" type="text" placeholder="title" id="editProjectName" value="${name}"><br>
                    <hr class="login-hr">
                    <button class="button is-block is-info is-large is-fullwidth" onclick="updateProject('${id}','${name}')">Edit project</button>
                    </div>
    `)
  $('#editErrorProjectHeader').hide()
}

function fetchUser(){
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/userlist'
  })
  .done(response => {
    console.log('userlist',response)
    let users =  response.results
    for(let i=0 ; i< users.length; i++){
      $('#userlist').append(`<option value="${users[i].id}">${users[i].name}</option>`)
    }
  })
  .fail(err => {
    console.log(err.responseJSON)
  })
}

function showInviteProjectPage(id,name) {
  console.log(id)
  hideAll()
  $('#edit').show()
  $('#edit').html(`<div class="box">
                    <h1 class="hero-body title">Invite to Project</h1>
                    <article id="inviteErrorHeader" class="is-offset-3 message is-danger">
                                      <div class="message-header  is-half">
                                        <p>Error</p>
                                      </div>
                                      <h2 id="inviteError" class=""></h2>
                                    </article>
                    <h1 class="column">UserId</h1>
                    <div class="select is-multiple">
                      <select id="userlist" multiple size="8">
                      </select>
                    </div>
                    <h1 class="column">Name</h1>
                    <input class="input is-medium" type="text" placeholder="title" id="invitename" value=""><br>
                    <hr class="login-hr">
                    <button class="button is-block is-info is-large is-fullwidth" onclick="inviteProject('${id}')">Invite to ${name}</button>
                    </div>
    `)
  $('#inviteErrorHeader').hide()
  fetchUser()
}

function inviteProject(id) {
  const token = localStorage.getItem('token')
  // console.log(id)
  name = $('#invitename').val()
  UserId = $('#userlist').val()[0]
  console.log(UserId)
  ProjectId = id
  // if(UserId){
   
  // console.log(due_date)
  $.ajax({
    method: 'post',
    url: `http://localhost:3000/pass/invite`,
    headers: {
      token
    },
    data: {
      name,
      UserId,
      ProjectId
    }
  })

    .done(response => {
      //      console.log("eh masuk")
      fetchProject()
      showProjectList()
    })

    .fail(err => {
      let error = err.responseJSON.err
      console.log('error',error)
      $('#inviteErrorHeader').show()
      $('#inviteError').text('please select one of UserId Available')

    })

  }

function updateProject(id) {
  const token = localStorage.getItem('token')
  console.log(id)
  name = $('#editProjectName').val()
  // console.log(due_date)
  $.ajax({
    method: 'put',
    url: `http://localhost:3000/projects/edit/${id}`,
    headers: {
      token
    },
    data: {
      name
    }
  })

    .done(response => {
      //      console.log("eh masuk")
      fetchProject()
      showProjectList()
    })

    .fail(err => {
      let error = err.responseJSON.err
      console.log(error)
      $('#editErrorProjectHeader').show()
      $('#editProjectError').text(error[0])

    })
  }


function update(id) {
  const token = localStorage.getItem('token')

  title = $('#editTitle').val()
  description = $('#editDescription').val()
  due_date = new Date($('#editdue_date').val())
  status = $("#editStatus[name=status]:checked").val()
  console.log(due_date)
  $.ajax({
    method: 'put',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      token
    },
    data: {
      title,
      description,
      due_date,
      status
    }
  })

    .done(response => {
      //      console.log("eh masuk")
      fetchToDo()
      showList()
    })

    .fail(err => {
      let error = err.responseJSON
      console.log(error)
      $('#editErrorHeader').show()
      $('#editError').text(error[0])
      //      $('#editError').html(err.responseJSON.err)
      //      console.log("eh gak")
      //      console.log(err)
    })


}

function logout() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('access_token');
    $('#main').empty();
    $('#login-navbar-button').hide();
    $('#not-login-navbar-button').show();
    showFormLogin();
  });
  localStorage.clear()

  checkStorage()
}

function onSignIn(googleUser) {

  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/logingoogle',
    headers: {
      google_token: id_token
    }
  })

    .done(response => {
      const token = response.token
      console.log(response)
      $('#loginEmail').val('')
      $('#loginPassword').val('')
      localStorage.setItem('token', token)
      checkStorage()
    })

    .fail(err => {
      console.log(err.responseJSON)
    })
}
