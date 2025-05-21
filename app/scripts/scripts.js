function registry(){

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let reType = document.getElementById('retype-password').value;

    if(!username){
        alert('Debe ingresar un nombre de usuario');
        return;
    }
    if(!password){
        alert("Debe ingresar una contraseña");
        return;
    }
    if(password!==reType){
        alert('Las contraseñas no coinciden');
        return;
    }

    if(localStorage.getItem(username)){
        alert(`Ya existe un usuario ${username}`)
        return;
    }

    let user ={
        username:username,
        password:password
    }

    console.log(user);
    
    localStorage.setItem(username, JSON.stringify(user));

    window.location.href = `home.html?name=${encodeURI(username)}`;

}
