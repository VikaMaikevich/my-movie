export default class MoviesService {
  #apiBase = 'https://api.themoviedb.org/3/'

  #options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2EwNzhiYzUyNzg4NTQ1MmFkYWE0Mjc2MTljNDNhNiIsInN1YiI6IjY2MjZhNGE5NjNlNmZiMDE2NWZjNGViYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LjzTREmYh06mVmjFNDaSw7sC9DT5C0JJsSPJ0_wB4kE',
    },
  }

  #apiKey = 'cca078bc527885452adaa427619c43a6'

  async getResource(url, options = this.#options) {
    const res = await fetch(`${this.#apiBase}${url}`, options)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    return res.json()
  }

  async searchMovies(query, page = 1) {
    const url = `search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`
    const res = await this.getResource(url)
    return res
  }

  async createGuestSession() {
    const url = `authentication/guest_session/new?api_key=${this.#apiKey}`
    const res = await this.getResource(url)
    return res
  }

  async ratedMovie(id, value, guestSessionId) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value }),
    }
    const url = `movie/${id}/rating?api_key=${this.#apiKey}&guest_session_id=${guestSessionId}`
    const res = await this.getResource(url, options)
    return res
  }

  async getRatedMovies(guestSessionId, page = 1) {
    const url = `guest_session/${guestSessionId}/rated/movies?api_key=${this.#apiKey}&language=en-US&page=${page}`
    const res = await this.getResource(url)
    return res
  }

  async getGenresList() {
    const url = 'genre/movie/list'
    const res = await this.getResource(url)
    return res
  }
}

// получение данных с сайта
