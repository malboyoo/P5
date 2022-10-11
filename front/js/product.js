const params = new URLSearchParams(document.location.search);
const productId = params.get("id");
import { fetchProduct, quantityErrorMsg } from "./functions.js";
//localStorage.clear();

const showProduct = async () => {
  const product = await fetchProduct(productId);
  document.title = product.name;

  // img
  const imgDiv = document.querySelector(".item__img");
  imgDiv.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  // title
  const titleElement = document.querySelector("#title");
  titleElement.innerHTML = product.name;

  //price
  const priceElement = document.querySelector("#price");
  priceElement.innerHTML = product.price;

  //description
  const descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = product.description;

  //select colors
  const selectColorsElement = document.querySelector("#colors");
  for (let color of product.colors) {
    const colorElement = document.createElement("option");
    colorElement.value = color;
    colorElement.innerHTML = color;
    selectColorsElement.append(colorElement);
  }
};

showProduct();

// add to cart
const addToCartBtn = document.querySelector("#addToCart");

const colorErrorElement = document.createElement("p");
colorErrorElement.style.color = "red";
colorErrorElement.style.fontWeight = "bold";

addToCartBtn.addEventListener("click", () => {
  //on clean le sucess msg de la commande précedente au cas ou elle à eu lieu
  if (document.querySelector(".success-msg") !== null) {
    document.querySelector(".success-msg").remove();
  }
  // récupération valeur utilisateur
  const numberOfItems = document.querySelector("#quantity").value;
  const choosedColor = document.querySelector("#colors").value;
  // vérification si valeur correctes
  let isQuantityOk = quantityErrorMsg(numberOfItems, false, document);
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
  const colorsElement = document.querySelector(".item__content__settings__color");
  if (color === "") {
    colorErrorElement.innerHTML = "Veuillez choisir une couleur.";
    colorsElement.append(colorErrorElement);
    return false;
  } else {
    colorErrorElement.remove();
    return true;
  }
};

// fonction d'ajout de produit au panier, utilisant local storage
const updateCart = (id, quantity, color, name) => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let alreadyInCart = false;
  // création de l'objet en rapport avec la couleur/quantité
  let cartData = {
    id: id,
    quantity: parseInt(quantity),
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
    if (!alreadyInCart) {
      cart.push(cartData);
    }
  } else {
    //sinon, on crée un nouveau tableau avec l'object
    localStorage.setItem("cart", JSON.stringify([cartData]));
  }
  // on sauvegarde cart à la fin de la function
  localStorage.setItem("cart", JSON.stringify(cart));
};
