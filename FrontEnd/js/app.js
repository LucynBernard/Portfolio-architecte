async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    document.querySelector(".gallery-modal").innerHTML = "";
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
        fetch(url, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            },
            method: "DELETE"
        })
            .then(response => console.log(response))
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
    const mainModale = document.querySelector(".main-modale");
    const addModale = document.querySelector(".add-modale");

    if (
        mainModale.style.display === "block" ||
        mainModale.style.display === ""
    ) {
        mainModale.style.display = "none";
        addModale.style.display = "block";
    } else {
        mainModale.style.display = "block";
        addModale.style.display = "none";

    }
}

// ajouter photo input

const fileInput = document.getElementById("file");
const categorySelect = document.getElementById("category");
const submitButton = document.querySelector(".btn-valider");
const addProjectForm = document.getElementById('pic-form');
const titleInput = document.getElementById('title');

let uploadedFile = null;
let selectedValue = "1";
let img = document.createElement('img');

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        uploadedFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            img.alt = "uploaded Photo";
            document.getElementById("photo-container").innerHTML = '';
            document.getElementById("photo-container").appendChild(img);
        };
        reader.readAsDataURL(file);
        document
            .querySelectorAll(".after-pic")
            .forEach(e => e.style.display = "none");
    } else {
        alert("Veuillez sélectionner une image au format JPG ou PNG.");
    }
    validateForm();
});

// gérer nouveau projet 

categorySelect.addEventListener("change", function () {
    selectedValue = this.value;
    validateForm();
});

function validateForm() {
    const fileSelected = fileInput.files.length > 0;
    const titleFilled = titleInput.value.trim() !== "";
    const categorySelected = categorySelect.value !== "";

    const formIsValid = fileSelected && titleFilled && categorySelected;
    submitButton.disabled = !formIsValid;

    if (formIsValid) {
        submitButton.classList.add("active");
    } else {
        submitButton.classList.remove("active");
    }
}

titleInput.addEventListener("input", validateForm);
validateForm();

addProjectForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const titleValue = titleInput.value.trim();

    if (uploadedFile && titleValue && selectedValue) {
        const formData = new FormData();
        formData.append('image', uploadedFile);
        formData.append('title', titleValue);
        formData.append('category', selectedValue);

        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("Token d'authentification manquant.");
            return
        }
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi.")
            }
            addProjectForm.reset();
            uploadedFile = null;
            selectedValue = "";
            img.src = "";
            document.getElementById("photo-container").innerHTML = "";
            document.querySelectorAll(".after-pic").forEach(e => e.style.display = "block");
            validateForm();

            const result = await response.json();
            console.log("Projet ajouté :", result);
            getWorks();

            document.getElementById("modale").style.display = "none";

        } catch (error) {
            const errorMess = document.createElement("div");
            errorMess.className = "error-message";
            errorMess.innerHTML = "Il y a eu une erreur :" + error.message;
            document.querySelector("form").prepend(errorMess)
        }
    } else {
        alert("Veuillez ajouter une image et un titre.");
    }
});


