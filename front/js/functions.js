export const fetchProduct = async (id) => {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    if (response.status < 300) {
      const data = await response.json();
      return data;
    } else {
      console.log("status error:", response.status);
    }
  } catch (error) {
    console.log("catched error", error);
  }
};

export const fetchAllProducts = async () => {
  try {
    let response = await fetch("http://localhost:3000/api/products");
    if (response.status < 300) {
      const data = await response.json();
      return data;
    } else {
      console.log("status error:", response.status);
    }
  } catch (error) {
    console.log("catched error", error);
  }
};

export const quantityErrorMsg = (number, CartPage, node) => {
  //création des messages d'erreur
  const quantityErrorElement = document.createElement("p");
  quantityErrorElement.style.color = "red";
  quantityErrorElement.style.fontWeight = "bold";
  quantityErrorElement.classList.add("quantity-error-msg");
  //supression d'un éventuel message d'erreur antérieur avant reverification
  const CurrentErrorMsg = node.querySelector(".quantity-error-msg");
  if (CurrentErrorMsg) CurrentErrorMsg.remove();
  let quantitySelector = CartPage
    ? ".cart__item__content__settings__quantity"
    : ".item__content__settings__quantity";
  const quantityElement = node.querySelector(quantitySelector);
  if (number <= 0 || "") {
    quantityErrorElement.innerHTML = "Vous devez selectionner au moins 1 article.";
    quantityElement.append(quantityErrorElement);
    return false;
  } else if (number > 100) {
    quantityErrorElement.innerHTML = "Vous ne pouvez prendre que 100 articles au maximum.";
    quantityElement.append(quantityErrorElement);
    return false;
  } else {
    if (CurrentErrorMsg) CurrentErrorMsg.remove();
    return true;
  }
};
