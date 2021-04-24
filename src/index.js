import './styles.css';
import cardTpl from './templates/card.hbs';
import NewsApiService from './js/apiService';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import * as basicLightbox from 'basiclightbox';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import LoadMoreBtn from './js/load-more-btn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

defaults.delay = 100;
defaults.icon = false;
defaults.styling = 'material';

const refs = getRefs();
const newsApiService = new NewsApiService();
refs.container.addEventListener('click', onClickImg);
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return error('Enter search parameters!');
  }
  newsApiService.resetPage();
  clearContainer();
  document.getElementById('input').value = '';
  newsApiService.fetchArticles().then(div => {
    appendMarkup(div);
    newsApiService.incrementPage();
  });
}

function appendMarkup(hits) {
  refs.container.insertAdjacentHTML('beforeend', cardTpl(hits));
}

function getRefs() {
  return {
    searchForm: document.querySelector('.search-form'),
    container: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel'),
  };
}

function clearContainer() {
  refs.container.innerHTML = '';
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.query !== '') {
      console.log('Пора грузить еще статьи' + Date.now());
      newsApiService.fetchArticles().then(div => {
        appendMarkup(div);
        newsApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  threshold: [0, 0.2, 0.5, 1],
});
observer.observe(refs.sentinel);

function onClickImg(e) {
  //   {target:{dataset}}){
  //   basicLightbox
  //   .create(
  //     `<img width ="800" height="600" src="${dataset.src}">`
  //     ,
  //   )
  //   .show();
  // }
  if (e.target.nodeName != 'IMG') {
    return;
  }
  const src = e.target.dataset.src;
  console.log(src);
  const instance = basicLightbox.create(
    `<img src='${src}' width ="400" height="300">`,
  );
  console.dir(instance);
  instance.show();
}
