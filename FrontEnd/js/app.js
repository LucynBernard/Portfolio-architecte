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
    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
    <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);
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
    if (localStorage.token) {
        console.log("ok")
        const editBar = document.createElement('div')
        editBar.className ='edit-bar'
		editBar.innerHTML = '<p><i class="fa-solid fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(editBar);
    }
}

adminMode()

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