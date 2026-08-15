let formulaire = document.querySelectorAll('.formCommande')[0];

// ========================================
// INITIALISATION EMAILJS
// ========================================

emailjs.init({
    publicKey: '28lf2VzvysWnnkFfC',
});


formulaire.addEventListener('submit', async(event) => {

    event.preventDefault();

    // element du formulaire
    const nom = formulaire.elements['nom'];
    const telephone = formulaire.elements['telephone'];
    const ville = formulaire.elements['ville'];
    const email = formulaire.elements['email'];
    const adress = formulaire.elements['adresse'];
    // const submit = formulaire.elements['submit'];
    const formeMessage = document.querySelector('.formeMessage');


    // ========================================
    // CONDITION POUR NOS CHAMPS DE FORMULAIRE
    // ========================================

    if (
        nom.value.trim() === '' ||
        ville.value.trim() === '' ||
        email.value.trim() === '' ||
        adress.value.trim() === ''
    ) {

        formeMessage.innerText = 'Veuillez remplir tous les champs';
        formeMessage.style.color = 'red';

        return;
    }


    // ========================================
    // VERIFICATION DU TELEPHONE
    // ========================================


    if (!/^\d{10}$/.test(telephone.value.trim())) {

        formeMessage.innerText =
            'Veuillez entrer un numero de telephone valide';

        formeMessage.style.color = 'red';

        return;
    }


    formeMessage.innerText =
        'Votre commande est en cours de validation...';

    formeMessage.style.color = 'blue';


    // ========================================
    // RECUPERATION DU PANIER
    // ========================================

    const panier = JSON.parse(
        localStorage.getItem('panier') || '[]'
    );


    // ========================================
    // VERIFIER LE PANIER
    // ========================================

    if (panier.length === 0) {

        formeMessage.innerText =
            'Votre panier est vide';

        formeMessage.style.color = 'red';

        return;
    }


    // ========================================
    // RECUPERATION DU NUMERO DE COMMANDE
    // ========================================

    const numeroCommande = genererNumeroCommande();


    // ========================================
    // CALCUL DU TOTAL
    // ========================================

    let totalCommande = 0;

    let listeProduits = '';
    let listeQuantites = '';


    panier.forEach(produit => {

        const prix = Number(produit.price);
        const quantite = Number(produit.quantity) || 1;

        const sousTotal = prix * quantite;

        totalCommande += sousTotal;

        listeProduits += `${produit.name} - ${prix} FCFA\n`;

        listeQuantites += `${produit.name} : ${quantite}\n`;

    });


    // ========================================
    // RECUPERONS NOS COMMANDES
    // ========================================

    const commande = {

        numero: numeroCommande,

        client: {

            nom: nom.value,
            telephone: telephone.value,
            email: email.value,
            ville: ville.value,
            adresse: adress.value

        },

        produits: panier,

        date: new Date().toLocaleString()

    };


    console.log(numeroCommande);
    console.log(commande);


    // ========================================
    // ENREGISTRER LA COMMANDE
    // ========================================

    localStorage.setItem(
        'commande',
        JSON.stringify(commande)
    );


    // ========================================
    // DONNEES POUR EMAILJS
    // ========================================

    const templateParams = {

        nom: commande.client.nom,
        telephone: commande.client.telephone,
        email: commande.client.email,
        ville: commande.client.ville,
        adresse: commande.client.adresse,
        numero: commande.numero,
        date: commande.date,
        produits: listeProduits,
        quantites: listeQuantites,
        total: totalCommande

    };


    console.log('Données envoyées à EmailJS :');
    console.log(templateParams);


    // ========================================
    // ENVOI DE L'EMAIL
    // ========================================

    try {

        const response = await emailjs.send(
            'service_dflnnha',
            'template_5lbco0h',
            templateParams
        );

        console.log(
            'Email envoyé avec succès :',
            response
        );


        // ========================================
        // MESSAGE DE CONFIRMATION
        // ========================================

        formeMessage.innerText =
            'Votre commande a ete validee avec succes';

        formeMessage.style.color = 'green';


        // ========================================
        // VIDER LE PANIER
        // ========================================

        localStorage.removeItem('panier');


        // ========================================
        // VIDER LE FORMULAIRE
        // ========================================

        formulaire.reset();


        // ========================================
        // OUVRIR LA PAGE DE CONFIRMATION
        // ========================================

        window.location.href = 'confirmation.html';


    } catch (error) {

        console.error(
            'Erreur lors de l envoi de l email :',
            error
        );

        formeMessage.innerText =
            "La commande a été enregistrée, mais l'email n'a pas pu être envoyé.";

        formeMessage.style.color = 'red';

        return;
    }

});


// ========================================
// GENERER NUMERO DE COMMANDE
// ========================================

function genererNumeroCommande() {

    const dateAujourdhui = new Date();

    const prefixe = 'CMD';

    const date1 = String(
        dateAujourdhui.getDate()
    ).padStart(2, '0');

    const year = dateAujourdhui.getFullYear();

    const month = String(
        dateAujourdhui.getMonth() + 1
    ).padStart(2, '0');


    // generer des nombres aleatoires

    const aleartoirNumber =
        Math.floor(Math.random() * 2000);


    const numero =
        `${prefixe}-${year}${month}${date1}-${aleartoirNumber}`;


    console.log(numero);

    return numero;
}