
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-login');
    const errorLogin = document.querySelector('.error-login');


    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empeche la soumission par defaut du formulaire

        // Recupere les valeurs des champs

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Envoie les donnees a l'API de connexion
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
           
            // Verifie si la reponse est correcte
            if (response.ok) {
                const data = await response.json();

                // Sauvegarde le token dans le localStorage
                localStorage.setItem('token', data.token);

                // Redirige vers la page d'accueil
                window.location.href = 'index.html';
            } else {
                
                // Affiche le message d'erreur
                errorLogin.style.display = 'block';
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);

             // Affiche le message d'erreur
             errorLogin.style.display = 'block';
        }
    });
});