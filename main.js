const row = document.querySelector(".row");
const searchInput = document.querySelector(".search");

let products = []; 

const renderCards = (data) => {
  if (!row) return;
  row.innerHTML = ""; 

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("col-4");
    card.innerHTML = `
      <div class="products__card">
        <img src="${item.image}" alt="" />
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <b>${item.price}$</b>
        <a href="product.html?id=${item.id}" class="details-btn">Подробнее</a>
        <button class="delete-btn" data-id="${item.id}">Удалить</button>
      </div>
    `;
    row.appendChild(card);
  });
};

const getData = async () => {
  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    products = data;          
    renderCards(products);    
  } catch (error) {
    console.log(error);
  }
};

getData();


const form = document.querySelector('.form');

const createProduct = async (event) => {
  event.preventDefault();
  if (!form) return;

  const formData = new FormData(form); 

  try {
    const response = await fetch('http://localhost:8000/products', {
      method: 'POST',
      body: formData 
    });

    if (!response.ok) throw new Error('Ошибка при создании');

    await getData();
  } catch (err) {
    console.log(err);
  }
};

if (form) {
  form.addEventListener('submit', createProduct);
}


if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(value)
    );

    renderCards(filtered);
  });
}


const deleteProduct = async (event) => {
  
  if (!event.target.classList.contains("delete-btn")) return;

  const id = event.target.dataset.id;
  if (!id) return;

  try {
    const res = await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error('Ошибка удаления');

   
    await getData();
  } catch (e) {
    console.log(e);
  }
};

if (row) {
  row.addEventListener("click", deleteProduct);
}

// ---------------- PRODUCT PAGE ----------------
if (window.location.pathname.includes("product.html")) {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const productInfo = document.querySelector("#productInfo");

  const getProductById = async () => {
    if (!productId) {
      productInfo.innerHTML = "<p>Товар не найден</p>";
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/products/${productId}`);
      if (!res.ok) throw new Error("Ошибка при получении товара");

      const product = await res.json();

   productInfo.innerHTML = `
  <div class="products__card" style="max-width:600px; margin:0 auto;">
    <img src="${product.image}" alt="${product.title}" />
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <b>${product.price}$</b>
    <a href="index.html" class="back-btn">Назад</a>
  </div>
`;

    } catch (err) {
      console.log(err);
      productInfo.innerHTML = "<p>Товар не найден</p>";
    }
  };

  getProductById();
}
