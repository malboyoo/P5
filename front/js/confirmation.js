// on récupère le numéro de commande qui à été push par l'API dans les Params de l'url
const params = new URLSearchParams(document.location.search);
const orderId = params.get("order");

// on insère le numéro de commande dans la balise span #orderId
const orderIdElement = document.querySelector("#orderId");
orderIdElement.textContent = orderId;
