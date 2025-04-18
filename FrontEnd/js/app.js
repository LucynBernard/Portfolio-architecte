async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            setFigure(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function getCategory() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
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

getCategory();



function setFilter(data) {
    const div = document.createElement("div")
    div.innerHTML = `${data.name}`

    document.querySelector(".gallery").append(div);
}



// // gestion des filtres
// const boutonTous = document.querySelector(".btn-all")

// const boutonObjets = document.querySelector(".btn-objets")

// boutonObjets.addEventListener("click", function () {
//     const objetsOnly = figure.filter(function (figure) {
//         return figure.categoryId(1)
//     })
// })