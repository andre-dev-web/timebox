function mostrarSenha(){
    var inputPass = document.getElementById('senha')

    if(inputPass.type === 'password'){
        inputPass.setAttribute('type', 'text')
    }else{
        inputPass.setAttribute('type', 'password')
    }
}