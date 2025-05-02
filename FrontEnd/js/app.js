async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (filter) {
            const filtered = json.filter((data) => data.categoryId === filter)
            for (let i = 0; i < filtered.length; i++) {
                setFigure(filtered[i]);
            }
        } else {
            for (let i = 0; i < json.length; i++) {
                setFigure(json[i]);
            }

        }
    } catch (error) {
        console.error(error.message);
    }
}
getWorks();

function setFigure(data) {
    const figure1 = document.createElement("figure")
    figure1.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
    <figcaption>${data.title}</figcaption>`;

    const figure2 = document.createElement("figure")
    figure2.classList.add("img-container")
    figure2.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>`

    const trashCan = document.createElement("i")
    trashCan.classList.add("fa-solid", "fa-trash-can")
    figure2.appendChild(trashCan)

    trashCan.addEventListener('click', () => {
        figure2.remove()
        figure1.remove()
        const url = `http://localhost:5678/api/works/${data.id}`
        // fetch(url, {
        //     headers: {
        //         Authorization:`Bearer ${sessionStorage.getItem("token")}`
        //     },
        //     method: "DELETE"
        // })
        // .then(response => console.log(response))
    })

    document.querySelector(".gallery").append(figure1);
    document.querySelector(".gallery-modal").append(figure2);
}

async function getCategory() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const categories = await response.json();

        const container = document.querySelector(".filters");
        //Créer le bouton "tous"
        const allBtn = document.createElement("button");
        allBtn.textContent = "Tous";
        allBtn.classList.add("btn", "active");
        allBtn.addEventListener("click", () => getWorks());
        container.appendChild(allBtn);

        // Créer un bouton pour chaque catégorie
        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("btn");
            btn.addEventListener("click", () => {
                getWorks(category.id)
                const buttons = document.querySelectorAll(".btn");
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove("active");
                }
                btn.classList.add("active")

            });
            container.appendChild(btn);
        })

        // const json = await response.json();
        // console.log(json);
        // for (let i = 0; i < json.length; i++) {
        //     setFilter(json[i]);
    } catch (error) {
        console.error(error.message);
    }
}
getCategory();

function setFilter(data) { }

//apparition de la barre noire
function adminMode() {
    if (sessionStorage.token) {
        document.querySelector(".filters").style.display = "none"

        const editBar = document.createElement('div')
        editBar.className = 'edit-bar'
        editBar.innerHTML = '<p><i class="fa-solid fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(editBar);

        const editProject = document.createElement('span');
        editProject.className = 'edit-project';
        editProject.innerHTML = '<a href="#modale" class="js-modal"><i class="fa-solid fa-pen-to-square"></i>modifier</a>';
        document.querySelector("#title-project").appendChild(editProject);

        document.querySelector(".login").textContent = "logout";
        document.querySelector(".login").addEventListener('click', () => {
            sessionStorage.removeItem("token")
            window.location.href = "index.html"
        })
    }
}

adminMode()

//modale 

let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelectorAll('.js-modal-close').forEach((e) => e.addEventListener('click', closeModal));
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", 'true')
    modal.removeAttribute("aria-modal")
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener('click', openModal);

})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e)
    }
})

// deuxieme modale

const addProjectBtn = document.querySelector(".add-project")
addProjectBtn.addEventListener('click', changeModal)

const backBtn = document.querySelector('.js-modal-back')
backBtn.addEventListener("click", changeModal)

function changeModal() {
    const galleryModale = document.querySelector(".gallery-modale");
    const addModale = document.querySelector(".add-modale");

    if (
        galleryModale.style.display === "block" ||
        galleryModale.style.display === ""
    ) {
        galleryModale.style.display = "none";
        addModale.style.display = "block";
    } else {
        galleryModale.style.display = "block";
        addModale.style.display = "none";

    }
}

// ajouter photo input

// document.querySelector("#uploadInput").style.display = "none";



// supprimer les travaux

// const suppApi = "http://localhost:5678/api/works/";

// document.querySelectorAll(".fa-trash-can").forEach((a) => {
//     a.addEventListener("click", console.log('trash button'))
// })

// const boutonTous = document.querySelector(".btn-all")
// const boutonObjets = document.querySelector(".btn-objets")
// const boutonApp = document.querySelector(".btn-app")
// const boutonHotels = document.querySelector(".btn-hotels")

// boutonObjets.addEventListener("click", () => {
//     getWorks(1)
// })

// boutonTous.addEventListener("click", () => {
//     getWorks()

// })
// boutonApp.addEventListener("click", () => {
//     getWorks(2)
// })
// boutonHotels.addEventListener("click", () => {
//     getWorks(3)
// })