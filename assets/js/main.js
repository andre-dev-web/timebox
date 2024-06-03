/*==================== NAVBAR MOSTRAR ====================*/
const showMenu = (headerToggle, navbarId) =>{
    const toggleBtn = document.getElementById(headerToggle),
    nav = document.getElementById(navbarId)
    
    // VALIDA A EXISTENCIA DAS VARIAVEIS
    if(headerToggle && navbarId){
        toggleBtn.addEventListener('click', ()=>{
        // ADICIONA A CLASSE "show-menu" NA CLASSE "nav__menu"
            nav.classList.toggle('show-menu')
            // MUDA O ICONE
            toggleBtn.classList.toggle('bx-x')
        })
    }
}
showMenu('header-toggle','navbar')

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
    linkColor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
}

linkColor.forEach(l => l.addEventListener('click', colorLink))
