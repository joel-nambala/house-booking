'use strict';

// Select DOM Elements
const copyYear = document.querySelector('.copy-year');

const headerBtns = document.querySelectorAll('.header-btn');
const houseList = document.querySelector('.house-list');
const bookmarkBtn = document.querySelector('.header-text');
const property = document.querySelector('.property');

// State variables
const bookmarks = [];

// Change the copyright year dynamically
const changeCopyYear = function () {
  const now = new Date().getFullYear();
  copyYear.textContent = now;
};
changeCopyYear();

// Format numbers
const formatNumber = function (number, locale) {
  return new Intl.NumberFormat(locale).format(number);
};

// Display the property list
const displayPropertyList = function (property) {
  const html = `
  <li class="house-item" data-id="${property.id}">
    <img src="${property.image}" alt="${property.name}" class="house-img" />
    <div>
      <h4 class="house-name">${
        property.name.length > 24
          ? property.name.split('').slice(0, 24).join('') + '...'
          : property.name
      }</h4>
      <h5 class="house-location">${property.location}</h5>
    </div>
  </li>
`;

  houseList.insertAdjacentHTML('beforeend', html);
};

// Display the property details
const displayProperty = function (house) {
  const html = `
        <figure class="property-figure">
          <img src="${house.image}" alt="${house.name}" class="property-img" />
        </figure>
        <div class="property-description">
          <div class="property-details">
            <h2 class="property-name">${house.name}</h2>
            <button class="property-btn" data-id="${house.id}">Book now</button>
            <p class="property-location">${house.location}</p>
          </div>
          <p class="property-price">Starting from, ${formatNumber(
            house.price,
            'en-US'
          )} kshs</p>
          ${house.description
            .split('%')
            .map(des => `<p class="property-text">${des}</p>`)
            .join('')}
          <div class="property-rating">
            <div class="rating">${house.rating}</div>
            <div class="quote">${house.quote}</div>
            <div class="reviews">${formatNumber(
              house.reviews,
              'en-US'
            )} reviews</div>
          </div>
        </div>
      `;

  property.insertAdjacentHTML('beforeend', html);
};

// Get the properties from an external API
const getProperty = async function () {
  let currentProperty;
  const response = await fetch('products.json');
  const result = await response.json();

  headerBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      houseList.innerHTML = '';
      const button = e.target;
      const id = button.dataset.name;
      currentProperty = result[id];

      currentProperty.forEach(function (prop) {
        displayPropertyList(prop);
      });
    });
  });

  houseList.addEventListener('click', function (e) {
    property.innerHTML = '';
    const clickedItem = e.target.closest('.house-item');
    if (clickedItem) {
      const id = +clickedItem.dataset.id;

      const mainHouse = currentProperty.find(prop => prop.id === id);
      displayProperty(mainHouse);
    }
  });

  // property.addEventListener('click', function (e) {
  //   const btn = e.target.classList.contains('property-btn');
  //   if (!btn) return;
  //   const btnBook = e.target;
  //   const id = btnBook.dataset.id;
  //   const bookmarkedItem = currentProperty.find(prop => (prop.id = id));
  //   bookmarks.push(bookmarkedItem);
  //   btnBook.textContent = 'Booked';
  //   btnBook.disabled = true;
  // });
};

getProperty();
