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

        if (!response.ok) {
            throw new Error('Erreur HTTP ! statut : ${response.status}');
        }

        const data = await response.json();

        console.table(data);

        displayCategories(data);
    } catch (error) {
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

    modifButton.addEventListener('click', function () {
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



// Creation modale 'Gallerie'

async function modalGallery() {
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

        deleteIcon.addEventListener('click', function () {
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

function modalAjout() {

    const modalsGroup = document.getElementById('modals');

    const overlayModal = document.querySelector('.modal-overlay');

    const secondModal = document.createElement('div');
    secondModal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const returnButton = document.createElement('span');
    returnButton.classList.add('return-button');
    returnButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';


    returnButton.addEventListener('click', () => {
        modalsGroup.removeChild(secondModal);
        modalGallery();
    });

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-btn');
    closeButton.innerHTML = '&times';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlayModal);
        modalsGroup.removeChild(secondModal);
    });

    const title = document.createElement('h2');
    title.textContent = 'Ajout photo';

    const separationLine = document.createElement('hr');
    separationLine.classList.add = ('separation-line');

    const photoForm = document.createElement('form');
    photoForm.classList.add('photo-form');

    const photoSection = document.createElement('div');
    photoSection.classList.add('photo-section');

    const uploadPhoto = document.createElement('div');
    uploadPhoto.classList.add('upload-placeholder');
    uploadPhoto.innerHTML = '<i class="fa-solid fa-image"></i>';

    const addPhotoText = document.createElement('button'); // Bouton personnalisé
    addPhotoText.textContent = '+ Ajouter une photo';
    addPhotoText.classList.add('add-photo-btn'); // Ajout d'une classe pour le style

    const imgInfo = document.createElement('p');
    imgInfo.textContent = 'jpg. png : 4mo max';
    imgInfo.classList.add('img-info');

    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('id', 'file-input');
    fileInput.classList.add('hidden');

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadPhoto.innerHTML = '';
                const imgPreview = document.createElement('img');
                imgPreview.src = e.target.result;
                imgPreview.classList.add('img-preview'); 
                uploadPhoto.appendChild(imgPreview);
                titleInput.value = fileInput.files[0].name;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    addPhotoText.addEventListener('click', (event) => {
        event.preventDefault();
        fileInput.click();
    });

    
    uploadPhoto.appendChild(addPhotoText); // Ajout du bouton à l'intérieur du placeholder
    uploadPhoto.appendChild(imgInfo);
    photoSection.appendChild(uploadPhoto);
    photoSection.appendChild(fileInput);

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';

    const titleInput = document.createElement('input');
    titleInput.setAttribute('id', 'title-input');
    
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Categorie';

    const categorySelect = document.createElement('select');
    categorySelect.setAttribute('type', 'text');

    async function populateCategorySelect() {
        try {
            const response = await fetch(apiCategoriesUrl);
            if (!response.ok) {
                throw new Error('Erreur HTTP ! statut : ${response.status}');
            }
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }
    
    populateCategorySelect();
    
    
    const validateButton = document.createElement('button');
    validateButton.textContent = 'Valider';
    validateButton.setAttribute('type', 'submit');
    validateButton.classList.add('validate-btn', 'disabled');

    validateButton.classList.add('disabled');

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            validateButton.classList.remove('disabled');
            validateButton.classList.add('active');
        }
    });

    validateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!fileInput.files || fileInput.files.length === 0) return;

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);

        try {
            const response = await fetch(apiWorksUrl, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: formData,
            });
           
            if (response.ok) {
                const newWork = await response.json();
    
                // Ajouter la nouvelle image à la galerie sans rafraîchir la page
                addImageToGallery(newWork);
    
                // Fermer la modale ou réinitialiser le formulaire ici si besoin
                document.body.removeChild(overlayModal);
                modalsGroup.removeChild(secondModal);
            } else {
                console.error('Erreur lors de l\'ajout de l\'image');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
    

    function addImageToGallery(work) {
        const galleryWorks = document.querySelector('.gallery');
    
        const imgContainer = document.createElement('div');
        const imgElement = document.createElement('img');
        const imgTitle = document.createElement('p');
    
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title || 'Image';
        imgTitle.textContent = work.title;
    
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(imgTitle);
        galleryWorks.appendChild(imgContainer);
    }

    photoForm.appendChild(photoSection);
    photoForm.appendChild(titleLabel);
    photoForm.appendChild(titleInput);
    photoForm.appendChild(categoryLabel);
    photoForm.appendChild(categorySelect);
    photoForm.appendChild(separationLine);
    photoForm.appendChild(validateButton);

    modalContent.appendChild(returnButton);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(photoForm);
   

    secondModal.appendChild(modalContent);
    modalsGroup.appendChild(secondModal);
    document.body.appendChild(overlayModal);
}





// Appel des fonctions une fois le DOM charge entierement

document.addEventListener('DOMContentLoaded', () => {
    getWorks();
    getCategories();
});