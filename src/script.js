// Mensagem de erro na seleção de usuário

const selectUserBtn = document.getElementById('selectUserBtn');
const selectUserBtnSecond = document.getElementById('selectUserBtn2');
const submitButton = document.getElementById('submitButton');
const errorMessage = document.getElementById('error');

selectUserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    selectUserBtn.classList.toggle('activated');
    selectUserBtnSecond.classList.remove('activated');
});

selectUserBtnSecond.addEventListener('click', (e) => {
    e.preventDefault();
    selectUserBtnSecond.classList.toggle('activated');
    selectUserBtn.classList.remove('activated');
});

submitButton.addEventListener('click', (e) => {
        e.preventDefault();
    if (!selectUserBtn.classList.contains('activated') && !selectUserBtnSecond.classList.contains('activated')) {
        e.preventDefault();
        errorMessage.classList.remove('hidden')
    } else {
        errorMessage.style.display = 'none';
    }
});



