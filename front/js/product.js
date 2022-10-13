// récupère les functions depuis le fichier functions.js
import { fetchProduct, quantityErrorMsg, loadCart, saveCart } from "./functions.js";

// on récupère l'id de l'article qu'on à générer dans le lien précedent
const params = new URLSearchParams(document.location.search);
const productId = params.get("id");

// on charge le produit avec l'API depuis l'id récupérer dans notre lien
const showProduct = async () => {
  const product = await fetchProduct(productId);
  document.title = product.name;

  // création d'un element img
  const imgDiv = document.querySelector(".item__img");
  imgDiv.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  //  création d'un element title
  const titleElement = document.querySelector("#title");
  titleElement.textContent = product.name;

  //  création d'un element price
  const priceElement = document.querySelector("#price");
  priceElement.textContent = product.price;

  //  création d'un element description
  const descriptionElement = document.querySelector("#description");
  descriptionElement.textContent = product.description;

  //  création d'un element select
  const selectColorsElement = document.querySelector("#colors");
  for (let color of product.colors) {
    const colorElement = document.createElement("option");
    colorElement.value = color;
    colorElement.textContent = color;
    selectColorsElement.append(colorElement);
  }
};

showProduct();

const addToCartBtn = document.querySelector("#addToCart");

addToCartBtn.addEventListener("click", () => {
  //on clean le sucess msg de la commande précedente au cas ou elle à eu lieu
  if (document.querySelector(".success-msg") !== null) {
    document.querySelector(".success-msg").remove();
  }
  // récupération valeur utilisateur
  const numberOfItems = parseInt(document.querySelector("#quantity").value);
  const choosedColor = document.querySelector("#colors").value;
  // vérification si valeur correctes
  const errorSelector = ".item__content__settings__quantity";
  let isQuantityOk = quantityErrorMsg(numberOfItems, errorSelector, document);
  let isColorOk = colorErrorMsg(choosedColor);
  if (isQuantityOk && isColorOk) {
    const sucessMsgElement = document.createElement("p");
    sucessMsgElement.classList.add("success-msg");
    sucessMsgElement.innerHTML = "Article ajouté au panier.";
    sucessMsgElement.style.color = "green";
    sucessMsgElement.style.textAlign = "center";
    sucessMsgElement.style.fontWeight = "bold";
    const itemContentElement = document.querySelector(".item__content");
    itemContentElement.append(sucessMsgElement);

    // update cart
    updateCart(productId, numberOfItems, choosedColor, document.title);
  }
});

//fonction erreur concernant la couleur

const colorErrorMsg = (color) => {
  // création des messages d'erreur (Element)
  const colorErrorElement = document.createElement("p");
  colorErrorElement.style.color = "red";
  colorErrorElement.style.fontWeight = "bold";
  colorErrorElement.classList.add("color-error-msg");

  const colorsElement = document.querySelector(".item__content__settings__color");

  // si la couleur n'est pas choisi, averti l'utilisateur qu'il doit faire un choix et retourne false
  if (color === "") {
    colorErrorElement.innerHTML = "Veuillez choisir une couleur.";
    colorsElement.append(colorErrorElement);
    return false;
    //sinon, supprime un éventuel message d'erreur apparu au préalable et retourne true
  } else {
    const CurrentErrorMsg = document.querySelector(".color-error-msg");
    if (CurrentErrorMsg) CurrentErrorMsg.remove();
    return true;
  }
};

// fonction d'ajout de produit au panier, utilisant localStorage
const updateCart = (id, quantity, color, name) => {
  // on charge le panier existant depuis le localStorage et ont le stock dans une variable
  const cart = loadCart();
  let alreadyInCart = false;

  // création de l'objet en rapport avec la couleur/quantité
  let cartData = {
    id: id,
    quantity: quantity,
    color: color,
    name: name,
  };

  // on vérifie si un panier existe déja, si c'est le cas, on récupère le panier pour y ajouter le nouvel article
  if (cart) {
    for (let product of cart) {
      // si le meme article avec la meme couleur est déjà dans le panier, on additionne la quantité
      if (product.id == id && product.color == color) {
        alreadyInCart = true;
        product.quantity += parseInt(quantity);
      }
    }
    // sinon, on l'ajoute au panier
    if (!alreadyInCart) {
      cart.push(cartData);
    }
    // on sauvegarde cart à la fin de la function
    saveCart(cart);
  } else {
    //sinon, on crée un nouveau tableau avec l'object
    saveCart([cartData]);
  }
};
