document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ticketForm");

    // Champs
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const adultType = document.getElementById("adultType");
    const visitDateInput = document.getElementById("visitDate");
    const weekdayDisplay = document.getElementById("weekdayDisplay");
    const nbEnfants = document.getElementById("nbEnfants");
    const nbAdultes = document.getElementById("nbAdultes");

    // Ateliers
    const atelierMatin = document.getElementById("atelierMatin");
    const atelierAprem = document.getElementById("atelierAprem");
    const ateliersFieldset = document.getElementById("choix-ateliers");

    const API_URL = "http://localhost:8080/api/v1/tickets/reserve";
    const ALLOWED_DAYS = [1, 2, 4, 5]; // Lundi, Mardi, Jeudi, Vendredi
    const WEEKDAYS = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

    function showError(el, msg) {
        let box = el.tagName === "FIELDSET" ? el : el.parentNode;
        let err = box.querySelector(".error-message");
        if(!err){
            err = document.createElement("small");
            err.className = "error-message";
            err.style.color = "red";
            box.appendChild(err);
        }
        err.textContent = msg;
    }

    function clearError(el) {
        let box = el.tagName === "FIELDSET" ? el : el.parentNode;
        const err = box.querySelector(".error-message");
        if(err) err.remove();
    }

    // Validations
    function validateFirstName(){ if(!firstName.value.trim()){ showError(firstName,"Le prénom est requis."); return false;} clearError(firstName); return true;}
    function validateLastName(){ if(!lastName.value.trim()){ showError(lastName,"Le nom est requis."); return false;} clearError(lastName); return true;}
    function validateEmail(){ 
        const v = email.value.trim();
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!v){ showError(email,"L'email est requis."); return false;}
        if(!re.test(v)){ showError(email,"Email invalide."); return false;}
        clearError(email); return true;
    }
    function validateAdultType(){ if(!adultType.value){ showError(adultType,"Veuillez sélectionner un type."); return false;} clearError(adultType); return true;}
    function validateVisitDate(){
        if(!visitDateInput.value){ showError(visitDateInput,"La date est requise."); weekdayDisplay.textContent=""; return false;}
        const d = new Date(visitDateInput.value);
        const day = d.getDay();
        weekdayDisplay.textContent = `Jour sélectionné : ${WEEKDAYS[day]}`;
        if(!ALLOWED_DAYS.includes(day)){ weekdayDisplay.style.color="red"; showError(visitDateInput,"Ateliers uniquement lundi, mardi, jeudi, vendredi."); return false;}
        weekdayDisplay.style.color="green"; clearError(visitDateInput); return true;
    }
    function validateRatio(){
        const enfants = Number(nbEnfants.value);
        const adultes = Number(nbAdultes.value);
        if(isNaN(enfants) || enfants<0){ showError(nbEnfants,"Nb enfants positif."); return false;}
        if(isNaN(adultes) || adultes<=0){ showError(nbAdultes,"Au moins 1 adulte."); return false;}
        if(enfants/ adultes>6){ showError(nbEnfants,"1 adulte pour 6 enfants max."); return false;}
        clearError(nbEnfants); clearError(nbAdultes); return true;
    }
    function getAteliers(){
        const list = [];
        if(atelierMatin && atelierMatin.checked) list.push("OMELETTE");
        if(atelierAprem && atelierAprem.checked) list.push("NOURRIR");
        return list;
    }
    function validateAteliers(){
        const list = getAteliers();
        if(list.length===0){ showError(ateliersFieldset,"Sélectionner au moins un atelier."); return false;}
        clearError(ateliersFieldset); return true;
    }

    // Listeners sur blur / input
    [firstName,lastName,email,adultType,visitDateInput,nbEnfants,nbAdultes].forEach(el=>{
        el.addEventListener("blur",()=>{ validateFirstName(); validateLastName(); validateEmail(); validateAdultType(); validateVisitDate(); validateRatio(); });
        el.addEventListener("input",()=>{ validateFirstName(); validateLastName(); validateEmail(); validateAdultType(); validateVisitDate(); validateRatio(); });
    });
    if(atelierMatin) atelierMatin.addEventListener("change", validateAteliers);
    if(atelierAprem) atelierAprem.addEventListener("change", validateAteliers);

    // Soumission
    form.addEventListener("submit", async (e)=>{
        e.preventDefault();

        const isValid = validateFirstName() && validateLastName() && validateEmail() && validateAdultType() &&
                        validateVisitDate() && validateRatio() && validateAteliers();
        if(!isValid){ alert("Corrigez les erreurs."); return; }

        const payload = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            adultType: adultType.value,
            visitDate: visitDateInput.value,
            nbChildren: Number(nbEnfants.value),
            nbAdults: Number(nbAdultes.value),
            ateliers: getAteliers()
        };

        console.log("Payload envoyé :", payload);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if(!response.ok){
                const text = await response.text();
                console.error("Erreur backend :", text);
                alert("Erreur lors de la réservation : " + text);
                return;
            }

            const result = await response.json();
            console.log("Réservation réussie, ticket :", result);

            const display = document.getElementById("ticketResult");
            display.innerHTML = `
                <h3>Réservation confirmée !</h3>
                <p>Ticket Number : <strong>${result.ticketNumber}</strong></p>
                <p>Date de visite : ${result.visitDate}</p>
                <p>Nom : ${result.adult.firstName} ${result.adult.lastName}</p>
                <p>Email : ${result.adult.email}</p>
                <p>Ateliers : ${result.ateliers.join(", ")}</p>
            `;

            form.reset();
            weekdayDisplay.textContent = "";

        } catch(err){
            console.error("Erreur réseau :", err);
            alert("Erreur réseau, impossible de joindre l'API.");
        }
    });
});
