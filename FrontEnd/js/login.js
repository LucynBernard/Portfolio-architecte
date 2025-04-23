const loginApi = "http://localhost:5678/api/users/login";

document.getElementById('loginform').addEventListener('submit', getSubmit);

async function getSubmit(event) {
    event.preventDefault();

    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    try {
        let response = await fetch(loginApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        if (response.status != 200) {
            if (!document.querySelector(".error-message")) {
                const errorMess = document.createElement("div");
                errorMess.className = "error-message";
                errorMess.innerHTML = "Erreur dans l'e-mail ou le mot de passe";
                document.querySelector("form").prepend(errorMess)
            }

            return
        }
        let result = await response.json();
        console.log(result)

        localStorage.setItem("token", result.token)
        window.location.href = "index.html"


        console.log('E-mail:', user.email);
        console.log('Mot de passe', user.password);
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
}