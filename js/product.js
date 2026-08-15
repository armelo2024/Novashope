let playimage = document.querySelector('.playimage');
let exchangeimage = true;

// Animation image
function animeImage() {

    if (!playimage) return;

    const image = document.createElement('img');

    setInterval(() => {

        if (exchangeimage) {
            image.src = "../images/ps4.png";
        } else {
            image.src = "../images/casque.png";
        }

        playimage.innerHTML = "";
        playimage.appendChild(image);

        exchangeimage = !exchangeimage;

    }, 4000);
}

animeImage();


// ================= VARIABLES =================

const carte = document.querySelector(".carte");
const panier = document.getElementById("compteur");
const panierContainer = document.getElementById("panierContainer");
const total = document.getElementById("total");
const message = document.querySelector(".message");
const viderPanier = document.getElementById("viderPanier");
const commander = document.getElementById("commander");


// ================= PANIER =================

let panierProduits = JSON.parse(localStorage.getItem("panier")) || [];


// compteur

function mettreAJourCompteur() {

    const nombreProduit = panierProduits.reduce((somme, produit) => {

        return somme + produit.quantity;

    }, 0);

    panier.innerText = `Panier ${nombreProduit}`;

}



// ================= PRODUITS =================

async function myproduct() {

    try {

        const response = await fetch("../api/produits.json");

        if (!response.ok) {

            throw new Error("Impossible de charger les produits");

        }

        const tableaux = await response.json();


        tableaux.forEach(tableau => {

            carte.innerHTML += `

            <div class="card" style="width:18rem;">

                <img src="${tableau.image}"
                class="card-img-top"
                alt="${tableau.name}">

                <div class="card-body">

                    <h5>${tableau.name}</h5>

                    <p>${tableau.price} FCFA</p>

                    <button
                    class="btn btn-primary ajouter"
                    data-id="${tableau.id}">
                    Ajouter
                    </button>

                </div>

            </div>

            `;

        });



        const boutons = document.querySelectorAll(".ajouter");


        boutons.forEach(bouton => {

            bouton.addEventListener("click", function() {

                const id = Number(this.dataset.id);

                const produit = tableaux.find(item => item.id === id);

                const produitDansPanier = panierProduits.find(item => item.id === id);


                if (produitDansPanier) {

                    produitDansPanier.quantity++;

                } else {

                    panierProduits.push({

                        ...produit,

                        quantity: 1

                    });

                }


                localStorage.setItem(

                    "panier",

                    JSON.stringify(panierProduits)

                );


                mettreAJourCompteur();

                afficherPanier();

            });

        });


        mettreAJourCompteur();

        afficherPanier();

    } catch (error) {

        console.error(error);

        message.innerHTML = `

        <div class="alert alert-danger">

            Impossible de charger les produits.

        </div>

        `;

    }

}

myproduct();




// ================= AFFICHER PANIER =================

function afficherPanier() {

    panierContainer.innerHTML = "";

    if (panierProduits.length === 0) {

        panierContainer.innerHTML = "<h3>Votre panier est vide.</h3>";

        total.innerText = "Total : 0 FCFA";

        return;

    }

    let somme = 0;

    panierProduits.forEach(produit => {

        let prix = Number(produit.price);

        let quantite = Number(produit.quantity);

        let sousTotal = prix * quantite;

        somme += sousTotal;

        panierContainer.innerHTML += `

        <div class="card mb-3">

            <div class="card-body">

                <h5>${produit.name}</h5>

                <p>Prix : ${prix} FCFA</p>

                <p>Quantité : ${quantite}</p>

                <p>Sous-total : ${sousTotal} FCFA</p>

            </div>

        </div>

        `;

    });

    total.innerText = `Total : ${somme} FCFA`;

}



// ================= VIDER PANIER =================

if (viderPanier) {

    viderPanier.addEventListener("click", () => {

        panierProduits = [];

        localStorage.removeItem("panier");

        mettreAJourCompteur();

        afficherPanier();

    });

}



// ================= COMMANDER =================

if (commander) {

    commander.addEventListener("click", () => {

        if (panierProduits.length === 0) {

            alert("Votre panier est vide.");

            return;

        }

        localStorage.setItem(

            "panier",

            JSON.stringify(panierProduits)

        );

        window.location.href = "commande.html";

    });

}