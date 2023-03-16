import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  evt.preventDefault();
  const value = evt.target.value.trim();
  if (!value) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(result => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      if (result.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (result.length === 1) {
        renderCountryInfo(result);
        return;
      } else {
        renderCountryList(result);
      }
    })
    .catch(onError);
}

function onError() {
  Notify.failure('Oops, there is no country with that name');
}

function countryListMarkup(data) {
  return data
    .map(({ name, flags }) => {
      return `<li>
      <img src='${flags.svg}' alt='${name.official}' width='60' height='auto'>
      <h2 class='card-title'>${name.official}</h2>
    </li>`;
    })
    .join('');
}
function countryInfoMarkup(data) {
  return data
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <div class='card'>
         <div class='flag'>
           <img src='${flags.svg}' alt='${
        name.official
      } width='100' height='auto'>
      </div>
      <div class='card__body'>
         <div>${name.official}</div>
           <p class='card__text'>Capital: ${capital}</p>
           <p class='card__text'>Population: ${population}</p>
           <p class='card__text'>Languages: ${Object.values(languages)}</p>
      </div>
      </div>
    `;
    })
    .join('');
}

function renderCountryList(country) {
  const markup = countryListMarkup(country);
  refs.countryList.innerHTML = markup;
  return;
}

function renderCountryInfo(country) {
  const markup = countryInfoMarkup(country);
  refs.countryInfo.innerHTML = markup;
  return;
}
