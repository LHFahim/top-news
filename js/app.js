const loadNews = async () => {
  const url = `https://openapi.programming-hero.com/api/news/categories`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayCategories(data.data.news_category);
  } catch (error) {
    console.log(error);
  }
};

const displayCategories = categories => {
  // console.log(categories);

  categories.forEach(category => {
    insertData(category, 'category-container');
  });
};

const insertData = (data, id) => {
  // console.log(data.category_id);
  // const cid = data.category_id;

  const dataElement = document.createElement('div');
  dataElement.innerHTML = `
    <button onclick="loadThisIdNews(${data.category_id})">${data.category_name}</button>
  `;

  const dataField = document.getElementById(id);
  // dataElement.id = cid;

  dataField.appendChild(dataElement);
};

const loadThisIdNews = id => {
  console.log(id);
};

loadNews();
