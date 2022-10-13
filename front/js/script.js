// récupère les functions depuis le fichier functions.js
import { fetchAllProducts } from "./functions.js";

// affiche les produits récupérer depuis le back-end
const showProducts = async () => {
  // stock le tableau de produit dans une variable
  const products = await fetchAllProducts();
  const itemsElement = document.querySelector(".items");
  let productsContent = "";

  // crée un contenu HTML pour chaque produit
  for (let product of products) {
    productsContent += `
      <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
  }
  // insère les produits dans la section ".items"
  itemsElement.innerHTML = productsContent;
};

showProducts();
