const apiWorksUrl = 'http://localhost:5678/api/works';
const apiCategoriesUrl = 'http://localhost:5678/api/categories'

// Fonction pour recuperer les IMAGES

async function getWorks() {
    try {
        // Effectuer la requête fetch
        const response = await fetch(apiWorksUrl);
       
        // Vérifier si la requête a réussii
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

// Fonction pour integrer le mode 'Edition'

document.addEventListener('DOMContentLoaded', () => {
    const loginLogout = document.querySelector('.login-logout');
    const editMode = document.querySelector('.mode-edition');
    const modifButton = document.querySelector('.modif-button');
    const cateMenu = document.querySelector('.categories-menu');

    // Verifier l'etat de connexion

    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            // Utilisateur connecte
            loginLogout.textContent = 'Logout';
            editMode.style.display = 'block';
            modifButton.style.display = 'inline-block';
            cateMenu.style.display = 'none';
        } else {
            // Utilisateur non connecte
            loginLogout.textContent = 'Login';
            editMode.style.display = 'none';
            modifButton.style.display = 'none';
            cateMenu.style.display = 'flex';
        }
    }

    
   // document.addEventListener('DOMContentLoaded', () => {
       // const modifButton = document.querySelector('.modif-button');
        console.log(modifButton);
    
        modifButton.addEventListener('click', function() {
            console.log('bonjour');

            const overlayModal = document.createElement('div');
            overlayModal.classList.add('modal-overlay');

            document.body.appendChild(overlayModal);

            modalGallery(); // Ouvre la modale et charge les œuvres
           
        });
    //});

    // Verifie l'etat de connexion au chargement de la page

    checkLoginStatus();

    // Gestion Login/Logout

    loginLogout.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Deconnexion
            localStorage.removeItem('token');
            location.reload();
            checkLoginStatus();
        } else {
            // Redirige vers la page de connexion
            window.location.href = 'login.html';
        }
    });

    });

    // Ouvrir modal via 'MODIFIER'

  

    // Creation modale 'Gallerie'

    async function modalGallery () {
        console.log('bonjour222');

        // Recuperation gallerie via l'API
        try {
            const response = await fetch(apiWorksUrl);

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }

            const works = await response.json();
        
        const modalsGroup = document.getElementById('modals');
        modalsGroup.innerHTML = '';

        const firstModal = document.createElement('div');
        firstModal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-btn');
        closeButton.innerHTML = '&times;';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Gallerie photo';

        const separationLine = document.createElement('hr');
        separationLine.classList.add = ('separation-line');

        const galleryModal = document.createElement('div');
        galleryModal.classList.add('modal-gallery');

        const addButton = document.createElement('button');
        addButton.textContent = 'Ajouter une photo';
        addButton.classList.add('add-btn');


        renderGallery(works, galleryModal);

        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalTitle);
        modalContent.appendChild(galleryModal);
        modalContent.appendChild(separationLine);
        modalContent.appendChild(addButton);
        firstModal.appendChild(modalContent);
        modalsGroup.appendChild(firstModal);

        closeButton.addEventListener('click', () => {
            firstModal.style.display = 'none';
            document.querySelector('.modal-overlay').remove();
        });

        addButton.addEventListener('click', function () {
            document.getElementById('modals').innerHTML = '';
            modalAjout();
        });
    } catch (error) {
        console.error('Erreur lors de la recuperation des donnees pour la modale:', error);
        const modalsGroup = document.getElementById('modals');
        modalsGroup.innerHTML = 'Erreur lors de la recuperation des donnees.';
    }
}

    // Fonction pour creer la gallerie dans la 'MODALE'

    function renderGallery(works, galleryModal) {
        galleryModal.innerHTML = '';

        works.forEach(work => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('modal-img-container');
            imgContainer.id = work.id;

            const imgElement = document.createElement('img');
            imgElement.src = work.imageUrl
            imgElement.alt = work.title || 'Image';
            imgElement.classList.add('img-modal');

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa-regular', 'fa-trash-can');

            deleteIcon.addEventListener('click', function() {
                const workId = work.id;
                console.log(work);
                console.log(work.id);
                deleteWork(workId);
            });

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(deleteIcon);
            galleryModal.appendChild(imgContainer);
        });

    }


            // Supprimer image modal

        async function deleteWork(workId) {
            const token = localStorage.getItem('token');

            const confirmed = confirm('Voulez-vous vraiment supprimer la photo ?');
            if (confirmed) {
                try {
                    const response = await fetch('http://localhost:5678/api/works/' + workId, {
                        method: "DELETE",
                        headers: {
                            Authorization: 'Bearer ' + token,
                        },
                });

                    if (response.ok) {
                        alert('Image supprime avec succes');

                        let allWorks = JSON.parse(localStorage.getItem('works'));
                        allWorks = allWorks.filter(work => work.id !== workId);
                        localStorage.setItem('works', JSON.stringify(allWorks));


                        const imgBase = document.getElementById(workId);
                        if (imgBase) {
                            imgBase.remove();
                        }
                        const imgModal = document.getElementById('modal' + workId);
                        if (imgModal) {
                            imgModal.remove();
                        }


                        displayWorks(allWorks);

                    } else {
                        const errorText = await response.text();
                        console.error('Erreur lors de la suppression de la photo:', errorText);
                        alert('Erreur lors de la suppression : ' + errorText);
                    }

                } catch (error) {
                    console.error('Erreur lors de la supprression de la photo');
                }
            
            }
        }

        // Creation modale 'AJOUT PHOTO'

        function addPhotoModal() {

            const modalsGroup = getElementById('modals');
            const secondModal = document.createElement('div');
            secondModal.classList.add('modal');

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            const returnButton = document.createElement('span');
            returnButton.classList.add('return-button');
            returnButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

            const closeButton = document.createElement('span');
            closeButton.classList.add('close-btn');
            closeButton.innerHTML='&times';

            const title = document.createElement('h2');
            title.textContent = 'Ajout photo';

            const photoSection = document.createElement('div');
            photoSection.classList.add('photo-section');

            
        }




// Appel des fonctions une fois le DOM charge entierement

document.addEventListener('DOMContentLoaded', () => {
    getWorks();
    getCategories();
});