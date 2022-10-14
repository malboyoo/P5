// fait une requête à l'API pour récupèrer un produit grâce à sont ID
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

// fait une requête à l'API pour récupèrer tous les produits
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
    console.log("catched error:", error);
  }
};

// fonction déstiné au message d'erreur en rapport avec la quantité
export const quantityErrorMsg = (number, selector, node) => {
  // création des messages d'erreur (Element)
  const quantityErrorElement = document.createElement("p");
  quantityErrorElement.style.color = "red";
  quantityErrorElement.style.fontWeight = "bold";
  quantityErrorElement.classList.add("quantity-error-msg");

  // supression d'un éventuel message d'erreur antérieur avant reverification
  const CurrentErrorMsg = node.querySelector(".quantity-error-msg");
  if (CurrentErrorMsg) CurrentErrorMsg.remove();

  // on cible l'element ou sera insérer l'erreur
  const quantityElement = node.querySelector(selector);

  // on établi les conditions pour que l'erreur soit insérer, si tout est correct la fonction retourne true.
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

// fonction relative à la verification du formulaire
export const verifyFormData = (userData) => {
  // initialisation des booléans pour verification finale
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

  // initialisation des regex pour chaque cas
  const nameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  const addressRegex =
    /^[a-zA-z0-9-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  // test du champ firstName
  nameRegex.test(firstName)
    ? (isFirstNameOk = true)
    : (firstNameErrorElement.textContent = "Votre prénom ne doit pas contenir de chiffres ou de caractères spéciaux.");

  // test du champ lastName
  nameRegex.test(lastName)
    ? (isLastNameOk = true)
    : (lastNameErrorElement.textContent = "Votre nom ne doit pas contenir de chiffres ou de caractères spéciaux.");

  // test du champ address
  addressRegex.test(address)
    ? (isAddressOk = true)
    : (addressErrorElement.textContent = "Votre adresse ne doit pas contenir de caractères spéciaux.");

  // test du champ city
  nameRegex.test(city)
    ? (isCityOk = true)
    : (cityErrorElement.textContent = "Votre ville ne doit pas contenir de chiffres ou de caractères spéciaux.");

  // test du champ email
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

// fonction envoyé au back-end en cas de succèss de celle-ci
export const validateCart = async (userData, cart) => {
  const contact = {
    firstName: userData.get("firstName"),
    lastName: userData.get("lastName"),
    address: userData.get("address"),
    city: userData.get("city"),
    email: userData.get("email"),
  };
  // retourne un tableau ne contenant que les ID de chaque article
  let products = cart.map((product) => product.id);

  // object retourné au back-end
  const obj = { contact, products };

  try {
    const response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      // on transforme l'object en string pour qu'il soit accepté par l'API
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

// permet de charger le tableau "cart" stocké en localStorage
export const loadCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    // vérifie que la quantité n'est pas supérieure à 100
    return cart.map((el) => (el.quantity > 100 ? { ...el, quantity: 100 } : el));
  } else {
    return false;
  }
};

// permet de sauvegarder rapidement le panier dans le local storage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// crée un message si le panier est vide lors de la commande.
export const cartIsEmpty = (parentNode) => {
  // création des messages d'erreur (Element)
  const emptyErrorElement = document.createElement("p");
  emptyErrorElement.style.color = "red";
  emptyErrorElement.style.fontWeight = "bold";
  emptyErrorElement.style.textAlign = "center";
  emptyErrorElement.classList.add("empty-error-msg");
  emptyErrorElement.textContent = "Votre panier est vide.";
  // on vérifie qu'un message d'erreur n'est pas déjà présent, si c'est le cas on le supprime.
  const currentErrorMsg = parentNode.querySelector("empty-error-msg");
  if (currentErrorMsg) currentErrorMsg.remove();
  // on ajoute l'erreur sous le formulaire
  parentNode.append(emptyErrorElement);
};
