// récupère les functions depuis le fichier functions.js
import {
  fetchProduct,
  loadCart,
  quantityErrorMsg,
  validateCart,
  verifyFormData,
  saveCart,
  cartIsEmpty,
} from "./functions.js";

//récuperation des données stockées dans le localStorage:
const cart = loadCart();

//on tri le cart si il existe
if (cart.length) {
  cart.sort((a, b) => a.name.localeCompare(b.name));
}

// function qui retourne le contenu d'un produit sous forme de string
const createArticle = async (product) => {
  // on récupère les données du produit depuis l'api
  const productData = await fetchProduct(product.id);

  // on génère le contenu souhaite
  let content = `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
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

  // retourne le contenu d'article individuel
  return content;
};

// boucle sur les articles du panier, récupère le contenu dans une string et l'affiche en une seule fois avec "innerHTML"
const DisplayArticles = async (cart) => {
  let content = "";
  for (let article of cart) {
    content += await createArticle(article);
  }
  const cartItemsElement = document.querySelector("#cart__items");
  cartItemsElement.innerHTML = content;
  // on attend que les articles soit créer pour placer les event listener (editArticle() et deleteArticle())
  editArticle();
  deleteArticle();
};

// prend en compte une modification de la quantité et affiche un message d'erreur en cas de montant invalide
const editArticle = () => {
  const allArticles = document.querySelectorAll(".cart__item");
  for (let article of allArticles) {
    //on cible l'input de l'article en question et on ecoute un changement de valeur pour chaque article
    const itemQuantityElement = article.querySelector(".itemQuantity");
    itemQuantityElement.addEventListener("input", () => {
      const errorSelector = ".cart__item__content__settings__quantity";
      // retourne true ou false, si false, affiche un message d'erreur
      let quantityOk = quantityErrorMsg(itemQuantityElement.value, errorSelector, article);
      quantityChange(article, itemQuantityElement, quantityOk);
      refreshCartTotal();
    });
  }
};

// applique un changement de quantité, et met à jour le panier en localStorage
const quantityChange = (article, eventListenedNode, quantityOk) => {
  if (quantityOk) {
    // on charge le panier pour avoir des données à jour
    const cart = loadCart();
    let quantityElement = article.querySelector(".quantity");
    quantityElement.textContent = `Qté : ${eventListenedNode.value}`;
    // on fais le lien entre les produits du panier et ceux de la page HTML grace à l'attribut HTML
    // data-id et data-color pour adapter la quantité du panier final
    for (let product of cart) {
      if (product.id == article.dataset.id && product.color == article.dataset.color) {
        product.quantity = parseInt(eventListenedNode.value);
      }
    }
    // on sauvegarde les changements
    saveCart(cart);
  }
};

// rafraichis dynamiquement le nombre d'articles et le montant total du panier
const refreshCartTotal = async () => {
  const cart = loadCart();
  // calcule de la quantité d'articles
  const totalQuantity = cart.reduce((total, article) => parseInt(article.quantity) + total, 0);
  const totalQuantityElement = document.querySelector("#totalQuantity");
  totalQuantityElement.textContent = totalQuantity;

  //calcule du prix total
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
    // on cible le bouton supprimer de l'article
    const deleteBtnElement = article.querySelector(".deleteItem");
    deleteBtnElement.addEventListener("click", async (event) => {
      const cart = loadCart();
      // on crée un nouveau tableau en filtrant l'id et la couleur qui vient d'être supprimer
      const newCart = cart.filter((el) => el.id !== article.dataset.id || el.color !== article.dataset.color);
      saveCart(newCart);
      refreshCartTotal();
      // on supprimer la node de l'article en question
      article.remove();
    });
  }
};

if (cart) {
  DisplayArticles(cart);
  refreshCartTotal();
}

// PARTIE FORMULAIRE

const formElement = document.querySelector(".cart__order__form");

// on écoute la soumission du formulaire,
formElement.addEventListener("submit", async (event) => {
  const cart = loadCart();
  const userData = new FormData(formElement);
  event.preventDefault();
  // si les données sont valide, on envoi la commande au back-end
  if (!cart.length) {
    cartIsEmpty(formElement);
  } else if (verifyFormData(userData)) {
    const order = await validateCart(userData, cart);
    // réinitialisation du panier
    saveCart([]);
    // redirige l'utilisateur vers la confirmation de commande
    window.location.replace(`http://127.0.0.1:5500/front/html/confirmation.html?order=${order.orderId}`);
  }
});
