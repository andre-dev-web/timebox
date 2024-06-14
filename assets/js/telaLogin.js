function mostrarSenha() {
    var inputPass = document.getElementById('senha');
    if (inputPass.type === 'password') {
        inputPass.setAttribute('type', 'text');
    } else {
        inputPass.setAttribute('type', 'password');
    }
}

function validarCampos(event) {
    event.preventDefault(); // previne o comportamento padrão do botão de submit

    var inputMail = document.getElementById('email').value;
    var inputPassword = document.getElementById('senha').value;
    var errorMessage = document.getElementById('error-message');
    var errorText = document.getElementById('error-text');

    if (inputMail === '' || inputPassword === '') {
        errorText.textContent = 'Preencha todos os campos!';
        errorMessage.style.display = 'block';
    } else if (inputMail !== 'admin' || inputPassword !== '1234') {
        errorText.textContent = 'Login não efetuado, tente novamente!';
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
        console.log('Login efetuado com sucesso!');
        location.href = 'index.html';
    }
}



document.getElementById('btnEntrar').addEventListener('click', validarCampos);
