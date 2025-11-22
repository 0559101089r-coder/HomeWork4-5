const row = document.querySelector(".row");
const searchInput = document.querySelector(".search");

let products = []; 

const renderCards = (data) => {
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
        <a href="#">Подробнее</a>
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


searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = products.filter((item) =>
    item.title.toLowerCase().includes(value)
  );

  renderCards(filtered);
});

