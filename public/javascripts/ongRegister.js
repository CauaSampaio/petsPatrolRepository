document.addEventListener("DOMContentLoaded", function() {
    const toggleLink = document.getElementById("toggleForm");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    
    if (toggleLink && registerForm && loginForm) {
        toggleLink.addEventListener("click", function(event) {
            event.preventDefault();
            
            if (!registerForm.classList.contains("hidden")) {
                // Se o segundo formulário está oculto, mostre-o e oculte o primeiro
                loginForm.classList.remove("hidden");
                registerForm.classList.add("hidden");

                toggleLink.textContent = 'Cadastrar'
            } else {
                // Caso contrário, mostre o primeiro formulário e oculte o segundo
                loginForm.classList.add("hidden");
                registerForm.classList.remove("hidden");
            }
        });
    }
});

