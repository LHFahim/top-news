// initialization
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

// fetching all categories
const displayCategories = categories => {
  // console.log(categories);

  categories.forEach(category => {
    insertData(category, 'category-container');
  });
};

// inserting all categories on page
const insertData = (data, id) => {
  const dataElement = document.createElement('div');

  dataElement.innerHTML = `
    <button onclick="loadThisIdNews(${data.category_id})">${data.category_name}</button>
  `;

  const dataField = document.getElementById(id);

  dataField.appendChild(dataElement);
};

const loadThisIdNews = async category_id => {
  const categoryId = '0' + category_id;

  // const url = `https://openapi.programming-hero.com/api/news/category/`;
  const url = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayNewsByCategory(data.data);
  } catch (error) {
    console.log(error);
  }
};

// display news for a specific category
const displayNewsByCategory = news => {
  console.log(news.length);
  const newsContainer = document.getElementById('news-container');
  newsContainer.textContent = '';

  news.forEach(item => {
    // console.log(item);
    let itemDetail;
    if (item.details.length > 400) {
      itemDetail = item.details.slice(0, 400);
      itemDetail += '...';
    }

    const newsElement = document.createElement('div');
    newsElement.innerHTML = `
      <div id="item-container " class="flex space-x-10">
        <div class="w-1/4">
          <img
            class="object-cover h-full"
            src="${item.image_url}"
            alt=""
          />
        </div>
      
        <div class="w-3/4 space-y-5 p-4">
          <h1 class="text-2xl font-bold">
            ${item.title}
          </h1>
          <p class="text-gray-600">
            ${itemDetail}
          </p>
        
          <div class="flex justify-between items-center">
      
            <div class="flex items-center space-x-3">
              <img
                class="w-14 rounded-full"
                src="${item.author.img}"
                alt=""
              />
              <h4>${item.author.name}</h4>
            </div>

            

            <p><i class="fa-solid fa-eye"></i> ${item.total_view}</p>
          </div>
        </div>
      </div>
  `;
    document.getElementById('news-container').appendChild(newsElement);
  });
};

loadNews();
// loadThisIdNews(1);
