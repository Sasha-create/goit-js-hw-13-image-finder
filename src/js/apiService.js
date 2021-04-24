import { Utils } from 'handlebars';

const API_KEY = '21313028-b99aca8e3911f90d2c8e33bee';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    const searchParams = new URLSearchParams({
      image_type: this.photo,
      orientation: this.horizontal,
      q: this.searchQuery,
      page: this.page,
      per_page: 12,
    });
    const url = `${BASE_URL}?${searchParams}&key=${API_KEY}`;
    // const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}=&page=${this.page}&per_page=12&key=${API_KEY}`;
    return await fetch(url)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        return data.hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
