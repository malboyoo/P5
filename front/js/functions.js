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

export const verifyFormData = (userData) => {
  //initialisation des booléans pour verification finale
  let isFirstNameOk = false;
  let isLastNameOk = false;
  let isCityOk = false;
  let isAddressOk = false;
  let isEmailOk = false;

  // récuperation des nodes de chaque message d'erreur
  const firstNameErrorElement = document.querySelector("#firstNameErrorMsg");
  const lastNameErrorElement = document.querySelector("#lastNameErrorMsg");
  const addressErrorElement = document.querySelector("#addressErrorMsg");
  const cityErrorElement = document.querySelector("#cityErrorMsg");
  const emailErrorElement = document.querySelector("#emailErrorMsg");

  // réinitialisation des erreur avant vérification
  firstNameErrorElement.textContent = "";
  lastNameErrorElement.textContent = "";
  addressErrorElement.textContent = "";
  cityErrorElement.textContent = "";
  emailErrorElement.textContent = "";

  // récuperation des données formulaire
  let firstName = userData.get("firstName");
  let lastName = userData.get("lastName");
  let address = userData.get("address");
  let city = userData.get("city");
  let email = userData.get("email");

  //initialisation des regex pour chaque cas
  const nameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  const addressRegex =
    /^[a-zA-z0-9-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  //first name test
  nameRegex.test(firstName)
    ? (isFirstNameOk = true)
    : (firstNameErrorElement.textContent =
        "Votre prénom ne doit pas contenir de chiffres ou de caractères spéciaux.");

  //last name test
  nameRegex.test(lastName)
    ? (isLastNameOk = true)
    : (lastNameErrorElement.textContent =
        "Votre nom ne doit pas contenir de chiffres ou de caractères spéciaux.");

  //address name test
  addressRegex.test(address)
    ? (isAddressOk = true)
    : (addressErrorElement.textContent =
        "Votre adresse ne doit pas contenir de caractères spéciaux.");

  //city name test
  nameRegex.test(city)
    ? (isCityOk = true)
    : (cityErrorElement.textContent =
        "Votre ville ne doit pas contenir de chiffres ou de caractères spéciaux.");

  //email test
  emailRegex.test(email)
    ? (isEmailOk = true)
    : (emailErrorElement.textContent = "Le format de votre adresse email n'est pas valide.");

  // retourne true si l'ensemble du formulaire est valide. sinon retourne false.
  if (isFirstNameOk && isLastNameOk && isAddressOk && isCityOk && isEmailOk) {
    return true;
  } else {
    return false;
  }
};

export const validateCart = async (userData, cart) => {
  const contact = {
    firstName: userData.get("firstName"),
    lastName: userData.get("lastName"),
    address: userData.get("address"),
    city: userData.get("city"),
    email: userData.get("email"),
  };
  let products = cart.map((product) => product.id);

  const obj = { contact, products };

  try {
    const response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const loadCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    // vérifie que la quantité n'est pas supérieure à 100
    return cart.map((el) => (el.quantity > 100 ? { ...el, quantity: 100 } : el));
  } else {
    return false;
  }
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
