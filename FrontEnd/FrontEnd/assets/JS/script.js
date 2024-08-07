const apiWorksUrl = 'http://localhost:5678/api/works';
const apiCategoriesUrl = 'http://localhost:5678/api/categories'

// Fonction pour recuperer les IMAGES

async function getWorks() {
    try {
        // Effectuer la requête fetch
        const response = await fetch(apiWorksUrl);
       
        // Vérifier si la requête a réussiif(!response.ok) 
        if (!response.ok) {
            throw new Error('Erreur HTTP ! statut : ${response.status}');
        }

        // Convertir la reponse en JSON
        const data = await response.json();

        // Sauvegarder les données dans le localStorage
        localStorage.setItem('works', JSON.stringify(data));

        // Traiter les donnees
       console.table(data);

       displayWorks(data);
    } catch (error) {
        // Gerer les erreurs
        console.error('Erreur lors de la recuperation des donnees :', error);
        document.querySelector('.gallery').innerHTML = 'Erreur lors de la récupération des données.';
    }
    }


// Fonction pour recuperer les CATEGORIES

async function getCategories() {
    try {
        const response = await fetch(apiCategoriesUrl);

        if(!response.ok) {
            throw new Error('Erreur HTTP ! statut : ${response.status}');
        }

        const data = await response.json();

        console.table(data);

        displayCategories(data);
    } catch  (error) {
        console.error('Erreur lors de la recuperation des donnees :', error);
        document.querySelector('.categories-menu').innerHTML = 'Erreur lors de la recuperation des donnees.';
    }
    }

// Fonction pour afficher les IMAGES

function displayWorks(works) {
    const galleryWorks = document.querySelector('.gallery');
    galleryWorks.innerHTML = '';

    works.forEach(work => {

        const imgContainer = document.createElement('div');
        const imgElement = document.createElement('img');
        const imgTitle = document.createElement('p');

        imgElement.src = work.imageUrl;
        imgElement.alt = work.title || 'Image';
        imgTitle.textContent = work.title;

        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(imgTitle);
        galleryWorks.appendChild(imgContainer);
    });
}

// Fonction pour afficher les CATEGORIES

function displayCategories(categories) {
    const categoriesMenu = document.querySelector('.categories-menu');
    categoriesMenu.innerHTML = '';

    // Ajout du boutton 'TOUS'

    const firstButton = document.createElement('button');
    firstButton.textContent = 'Tous';
    firstButton.classList.add('category');
    firstButton.dataset.categoryId = 'all';
    categoriesMenu.appendChild(firstButton);

    categories.forEach(category => {
        const categoryElement = document.createElement('button');
        categoryElement.classList.add('category');
        categoryElement.textContent = category.name;
        categoryElement.dataset.categoryId = category.id;
        categoriesMenu.appendChild(categoryElement);
    });

    eventCategory();
}

// Fonction pour ajouter un evenement aux CATEGORIES

function eventCategory() {
    const categoryButtons = document.querySelectorAll('.category');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const categoryId = event.target.dataset.categoryId;

            filterWorks(categoryId);
            activeCategory(categoryId);
        });
    });
}

// Fonction pour filtrer les IMAGES

function filterWorks(categoryId) {

    // Récupère toutes les œuvres depuis le localStorage
    const allWorks = JSON.parse(localStorage.getItem('works'));

    // Déclare la variable pour les œuvres filtrées
    let filteredWorks;

    if (categoryId === 'all') {
        filteredWorks = allWorks;
    } else {
        filteredWorks = allWorks.filter(work => work.categoryId === parseInt(categoryId));
    }

    displayWorks(filteredWorks);
}


// Fonction pour definir la categorie 'ACTIVE'

function activeCategory(categoryId) {
    const categoryButtons = document.querySelectorAll('.category');

    categoryButtons.forEach(button => {
        if (button.dataset.categoryId === categoryId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}


// Appel des fonctions une fois le DOM charge entierement

document.addEventListener('DOMContentLoaded', () => {
    getWorks();
    getCategories();
});