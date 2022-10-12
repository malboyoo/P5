import { fetchAllProducts } from "./functions.js";

const showProducts = async () => {
  const products = await fetchAllProducts();
  const itemsElement = document.querySelector(".items");
  let productsContent = "";

  for (let product of products) {
    productsContent += `<a href="./product.html?id=${product._id}">
      <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
      </article>
      </a>`;
  }
  itemsElement.innerHTML = productsContent;
};

showProducts();
