// ===============================
// RECUPERER LA COMMANDE
// ===============================

const commandeSauvegardee = localStorage.getItem("commande");


// Vérifier si une commande existe

if (!commandeSauvegardee) {

    alert("Aucune commande trouvée.");

    window.location.href = "index.html";

}


// Transformer le JSON en objet JavaScript

const commande = JSON.parse(commandeSauvegardee);


console.log("Commande récupérée :", commande);
console.log("Produits récupérés :", commande.produits);


// ===============================
// RECUPERER LES ELEMENTS HTML
// ===============================

const numeroCommande =
    document.getElementById("numeroCommande");

const dateCommande =
    document.getElementById("dateCommande");

const client =
    document.getElementById("client");

const produits =
    document.getElementById("produits");


// ===============================
// NUMERO DE COMMANDE
// ===============================

numeroCommande.innerText =
    `Numéro de commande : ${commande.numero}`;


// ===============================
// DATE
// ===============================

dateCommande.innerText =
    `Date : ${commande.date}`;


// ===============================
// INFORMATIONS CLIENT
// ===============================

client.innerHTML = `

    <h5>Informations client</h5>

    <p>
        Nom : ${commande.client.nom}
    </p>

    <p>
        Téléphone : ${commande.client.telephone}
    </p>

    <p>
        Email : ${commande.client.email}
    </p>

    <p>
        Ville : ${commande.client.ville}
    </p>

    <p>
        Adresse : ${commande.client.adresse}
    </p>

`;


// ===============================
// AFFICHER LES PRODUITS
// ===============================

produits.innerHTML = "";


// Vérifier qu'il y a des produits

if (!commande.produits || commande.produits.length === 0) {

    produits.innerHTML = `

        <div class="alert alert-warning">

            Aucun produit dans cette commande.

        </div>

    `;

} else {

    let totalCommande = 0;


    // Parcourir les produits

    commande.produits.forEach(produit => {

        // Prix

        const prix = Number(produit.price);


        // Quantité

        const quantite = Number(produit.quantity) || 1;


        // Sous-total

        const sousTotal = prix * quantite;


        // Ajouter au total

        totalCommande += sousTotal;


        // Afficher le produit

        produits.innerHTML += `

            <div class="card mb-3">

                <div class="card-body">

                    <h5 class="card-title">

                        ${produit.name}

                    </h5>

                    <p>

                        Prix unitaire :
                        ${prix} FCFA

                    </p>

                    <p>

                        Quantité :
                        ${quantite}

                    </p>

                    <p>

                        Sous-total :
                        ${sousTotal} FCFA

                    </p>

                </div>

            </div>

        `;

    });

    // Afficher le total

    produits.innerHTML += `

        <div class="alert alert-success">

            <h4>

                Total :
                ${totalCommande} FCFA

            </h4>

        </div>

    `;

};

// vider le panier

let retourBoutique = document.getElementById('retourBoutique');

retourBoutique.addEventListener('click', () => {

    // vider le panier
    localStorage.removeItem('panier');
});