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

// load category specific news
const loadThisIdNews = async category_id => {
  toggleSpinner(true);

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
  if (news.length === 0) {
    toggleSpinner(false);
    displayTotalNewsFound(0, 'Culture');
  }

  news = news.sort((a, b) => b.total_view - a.total_view);

  const newsContainer = document.getElementById('news-container');
  newsContainer.textContent = '';

  let count = 0;

  news.forEach(async item => {
    // check total number of news for a category

    let categoryName;
    const url = `https://openapi.programming-hero.com/api/news/categories`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const foundResult = data.data.news_category;

      foundResult.forEach(element => {
        if (element.category_id === item.category_id) {
          categoryName = element.category_name;
        }
      });
    } catch (error) {
      console.log(error);
    }

    if (count === 0) {
      displayTotalNewsFound(news.length, categoryName);
      count++;
    }

    let itemDetail;
    if (item.details.length > 400) {
      itemDetail = item.details.slice(0, 400);
      itemDetail += '...';
    } else {
      itemDetail = item.details;
    }

    // template sttring
    const newsElement = document.createElement('div');
    newsElement.innerHTML = `
      <div id="item-container " class="flex flex-col  items-center md:flex-row space-x-10 ">
        <div class="md:w-1/4">
          <img
            class="object-cover md:h-full md:p-5 md:rounded-3xl"
            src="${item.thumbnail_url}"
            alt=""
          />
        </div>
      
        <div class="md:w-3/4 space-y-5 p-4">
          <h1 class="text-2xl font-bold">
            ${item.title}
          </h1>
          <p class="text-gray-600">
            ${itemDetail}
          </p>
        
          <div class="flex justify-between items-center">
      
            <div class="flex flex-col md:flex-row md:items-center md:space-x-3 ">
              <img
                class="w-14 rounded-full"
                src="${item.author.img}"
                alt=""
              />
              <h4>${item.author.name ? item.author.name : 'No data found'}</h4>
            </div>

            <p><i class="fa-solid fa-eye"></i> ${
              item.total_view ? item.total_view : 'No data found'
            }</p>

            
            <!-- modal button -->
            <button onclick="loadNewsDetails('${
              item._id
            }')" type="button" class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-bs-toggle="modal" data-bs-target="#exampleModalLg">Read more</button>

          </div>
        </div>
      </div>

      
  `;

    newsElement.classList.add('bg-white');
    newsElement.classList.add('rounded-3xl');
    newsElement.classList.add('shadow-lg');

    toggleSpinner(false);

    document.getElementById('dropdown-container').classList.remove('hidden');

    document.getElementById('news-container').appendChild(newsElement);
  });
};

const getCategoryName = categoryId => {
  const url = `https://openapi.programming-hero.com/api/news/categories`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const foundResult = data.data.news_category;
      foundResult.forEach(element => {
        if (element.category_id === categoryId) {
          const cname = element.category_name;
          getName(cname);
        }
      });
    })
    .catch(error => console.log(error));
};

const getName = cname => {
  console.log(cname);
  return cname;
};

const toggleSpinner = flag => {
  // document.getElementById('spinner').classList.toggle('hidden');

  if (flag) {
    document.getElementById('spinner').classList.remove('hidden');
  } else if (!flag) {
    document.getElementById('spinner').classList.add('hidden');
  }
};

const displayTotalNewsFound = (number = 0, category = 'No news found') => {
  document.getElementById('found-message').textContent = '';

  const element = document.createElement('p');
  element.innerText = `${number} item(s) have been found for category ${category}`;

  element.classList.add('p-5');
  element.classList.add('bg-white');
  element.classList.add('mb-10');
  element.classList.add('rounded-lg');
  element.classList.add('text-2xl');
  element.classList.add('font-bold');
  element.classList.add('text-center');

  document.getElementById('found-message').appendChild(element);
};

const loadNewsDetails = async id => {
  const url = `https://openapi.programming-hero.com/api/news/${id}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const item = data.data[0];

    console.log(item);

    const modalHeader = (document.getElementById(
      'exampleModalLgLabel'
    ).textContent = item.title);

    const modalBodyElement = document.getElementById('modal-body');

    modalBodyElement.innerHTML = `
      <img class="h-14 w-14 rounded-full" src="${item.author.img}">
      <h3 class="font-bold">${
        item.author.name ? item.author.name : 'No data found'
      }</h3>
      <small>Author possesses a rating of ${item.rating.badge} ${
      item.rating.number
    } </small>
      
      <h3>Date: ${item.author.published_date}</h3>

      <div class="border-b-2 mt-5"></div>

      <img class="mb-5" src="${item.image_url}">

      <p>${item.details}</p>

      <small>This news has been read ${item.total_view} times</small>
     
    `;
  } catch (error) {
    console.log(error);
  }
};

loadNewsDetails('11468ed61aee84de492a8b04158a22f0');
loadNews();
// loadThisIdNews(1);
