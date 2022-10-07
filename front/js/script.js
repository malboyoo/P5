import { fetchAllProducts } from "./functions.js";

const showProducts = async () => {
  const products = await fetchAllProducts();
  const itemsElement = document.querySelector(".items");

  for (let product of products) {
    const aElement = document.createElement("a");
    aElement.href = `./product.html?id=${product._id}`;
    aElement.innerHTML = `<article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
      </article>`;

    itemsElement.append(aElement);
  }
};

showProducts();
