import { fetchProduct, quantityErrorMsg, validateCart, verifyFormData } from "./functions.js";

//localStorage.clear();

//récuperation des données stockées dans le localStorage:
let cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);
//on tri le cart si il existe
if (cart) {
  cart.sort((a, b) => a.name.localeCompare(b.name));
}

const createArticle = async (product) => {
  let content = "";
  //on récupère les données du produit depuis l'api
  const productData = await fetchProduct(product.id);
  content += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
  <div class="cart__item__img">
    <img src="${productData.imageUrl}" alt="${productData.altTxt}">
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${productData.name}</h2>
      <p>${product.color}</p>
      <p class="price">${productData.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p class="quantity">Qté : ${product.quantity} </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
    </div>
    </article>`;
  return content;
};

const DisplayArticles = async (cart) => {
  let content = "";
  for (let article of cart) {
    content += await createArticle(article);
  }
  const cartItemsElement = document.querySelector("#cart__items");
  cartItemsElement.innerHTML = content;
  editArticle();
  deleteArticle();
};

//sauvegarde des nouvelles données dans le localStorage:
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const editArticle = () => {
  const allArticles = document.querySelectorAll(".cart__item");
  for (let article of allArticles) {
    //on cible l'input de l'article en question et on ecoute un changement de valeur
    const itemQuantityElement = article.querySelector(".itemQuantity");
    itemQuantityElement.addEventListener("input", () => {
      let quantityOk = quantityErrorMsg(itemQuantityElement.value, true, article);
      quantityChange(article, itemQuantityElement, quantityOk);
      saveCart(cart);
      refreshCartTotal();
    });
  }
};

const quantityChange = (article, eventListenedNode, quantityOk) => {
  if (quantityOk) {
    let quantityElement = article.querySelector(".quantity");
    quantityElement.textContent = `Qté : ${eventListenedNode.value}`;
    for (let product of cart) {
      if (product.id == article.dataset.id && product.color == article.dataset.color) {
        product.quantity = eventListenedNode.value;
      }
    }
  }
};

const refreshCartTotal = async () => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  // calcule de la quantité d'articles
  const totalQuantity = cart.reduce((total, article) => parseInt(article.quantity) + total, 0);
  const totalQuantityElement = document.querySelector("#totalQuantity");
  totalQuantityElement.textContent = totalQuantity;

  //cacule du prix total
  let totalPrice = 0;
  for (let article of cart) {
    const articleData = await fetchProduct(article.id);
    totalPrice += articleData.price * article.quantity;
  }
  const totalPriceElement = document.querySelector("#totalPrice");
  totalPriceElement.textContent = totalPrice;
};

const deleteArticle = () => {
  const allArticles = document.querySelectorAll(".cart__item");
  for (let article of allArticles) {
    //on cible le bouton supprimer de l'article
    const deleteBtnElement = article.querySelector(".deleteItem");
    deleteBtnElement.addEventListener("click", async (event) => {
      const newCart = cart.filter(
        (el) => el.id !== article.dataset.id || el.color !== article.dataset.color
      );
      saveCart(newCart);
      refreshCartTotal();
      article.remove();
    });
  }
};

if (cart) {
  DisplayArticles(cart);
}
refreshCartTotal();

// PARTIE FORMULAIRE

const formElement = document.querySelector(".cart__order__form");
//const orderBtnElement = document.querySelector("#order");

formElement.addEventListener("submit", async (event) => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  const userData = new FormData(formElement);
  const isFormValid = true;
  event.preventDefault();
  if (verifyFormData(userData) && cart[0]) {
    const order = await validateCart(userData, cart);
    saveCart([]);
    window.location.replace(
      `http://127.0.0.1:5500/front/html/confirmation.html?order=${order.orderId}`
    );
  }
});
