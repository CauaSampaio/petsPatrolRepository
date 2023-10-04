// Selecionar os elementos do formulário e os links
const form = document.getElementById('formContainer');
const formSec = document.getElementById('formContainerSec');
const linkLogin = document.getElementById('alterButton');
const linkCad = document.getElementById('alterButtonSec');

// Adicionar um ouvinte de evento para o link "alterButton"
linkLogin.addEventListener('click', () => {

    if (!form.classList.contains('hidden')) {
        formSec.classList.remove('hidden');
        form.style.display = 'none';
    }

    
    return false;
    
});

// Adicionar um ouvinte de evento para o link "alterButtonSec"
linkCad.addEventListener('click', () => {

    // Verificar se o primeiro formulário está visível (não possui a classe 'hidden')
    if (!formSec.classList.contains('hidden') && form.style.display == 'none') {
        // Ocultar o primeiro formulário
        formSec.classList.add('hidden');

        // Mostrar o segundo formulário
        form.style.display =   'block';
    }
});
