const profileContainer = document.getElementById("profileContainer");    
const menuDropDown = document.getElementById("menuDropDown");

profileContainer.addEventListener("click", (e) => {
    e.preventDefault();

    if (menuDropDown.classList.contains('hidden')) {
        menuDropDown.classList.remove('hidden');
    } else {
        menuDropDown.classList.add('hidden');
    }
});