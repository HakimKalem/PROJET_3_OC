
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is fully loaded');
    getWorks();
    getCategories();
});

// Fonction pour recuperer les projets

function getWorks (){
    fetch ('http://localhost:5678/api/works')
       .then(response => {
          if(!response.ok)  {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        afficherWorks(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


// Fonction pour afficher les projets dans la galerie

function afficherWorks (works) {
    const gallery = document.querySelector('.gallery');
    if(!gallery) return;
    gallery.innerHTML='';

    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.setAttribute('id', work.id);
        const img = document.createElement('img');
        const figCaption = document.createElement('fig-caption');

        img.src = work.imageUrl
        img.alt = work.title
        figCaption.textContent = work.title

        figure.appendChild(img);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);

    });
}


// Fonction pour récupérer les catégories

function getCategories() {
    console.log('Fetching categories...');
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Categories data:', data);
            afficherCategories(data);
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        });
}

// Fonction pour afficher les catégories

function afficherCategories(categories) {
    console.log('Displaying categories:', categories);
    const categoriesMenu = document.querySelector('.categories-menu');
    if (!categoriesMenu) {
        console.error('Categories menu element not found');
        categoriesMenu.innerHTML = '';
        return;
    }
  
    const button = document.createElement("button");
    button.textContent = "Tous";
    categoriesMenu.appendChild(button);


    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.addEventListener('click', () => {
            filterProjects(category.id, projects);
            setActiveCategory(button);
        });
        categoriesMenu.appendChild(button);
    });

    const firstButton = categoriesMenu.querySelector('button');
    firstButton.classList.add('active');
}

// Filtrer les projets par catégorie

function filterProjects(category, projects) {
    if (category === 'Tous') {
        displayWorks(projects);
    } else {
        const filteredProjects = projects.filter(project => project.category.name === category);
        displayWorks(filteredProjects);
    }
}

// Définir la catégorie active

function setActiveCategory(activeButton) {
    const buttons = document.querySelectorAll('.categories-menu button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}


document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});