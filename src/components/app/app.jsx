import { Component } from 'react'
import { Tabs } from 'antd'
import { debounce } from 'lodash'

import SearchContent from '../search-content/search-content'
import RatedContent from '../content/rated-content'
import MoviesService from '../../movies-service/movies-service'
import { GenresProvider } from '../../genres/genres'

import './app.css'

export default class App extends Component {
  moviesService = new MoviesService()

  moviesRatings = new Map()

  constructor(props) {
    super(props)
    this.state = {
      foundMovies: [],
      ratedMovies: [],
      genresList: [],
      dataIsLoading: false,
      error: false,
      totalPages: null,
      currentPage: 1,
      ratedCurrentPage: 1,
      query: '',
      errorOnGetRatedMovies: false,
    }
  }

  componentDidMount() {
    this.createGuestSession()
    this.getGenresList()
  }

  onError = () => {
    this.setState({ error: true, dataIsLoading: false })
  }

  onInputChange = debounce((event) => {
    if (event.target.value.trim()) {
      this.setState({ dataIsLoading: true })
      this.moviesService
        .searchMovies(event.target.value)
        .then((foundMovies) =>
          this.setState({
            foundMovies: foundMovies.results,
            dataIsLoading: false,
            totalPages: foundMovies.total_pages,
            currentPage: foundMovies.page,
            query: event.target.value,
          })
        )
        .catch(this.onError)
    }
  }, 700)

  onPageChange = (query, page) => {
    this.setState((prevState) => {
      const updatedState = { ...prevState, dataIsLoading: true }
      return updatedState
    })
    this.moviesService
      .searchMovies(query, page)
      .then((foundMovies) =>
        this.setState((prevState) => {
          const updatedState = {
            ...prevState,
            foundMovies: foundMovies.results,
            dataIsLoading: false,
            totalPages: foundMovies.total_pages,
            currentPage: foundMovies.page,
          }
          return updatedState
        })
      )
      .catch(this.onError)
  }

  createGuestSession = () => {
    this.moviesService.createGuestSession().then((result) => {
      const { guest_session_id: guestSessionId } = result
      this.setState((prevState) => {
        const updatedState = { ...prevState, guestSessionId }
        return updatedState
      })
    })
  }

  // рейтинг
  onSetMovieRate = async (id, value, guestSessionId) => {
    this.moviesService.ratedMovie(id, value, guestSessionId)
    if (this.moviesRatings.size > 0) {
      this.getRatedMovies(guestSessionId)
    }
    this.moviesRatings.set(id, value)
  }

  // оцененные фильмы
  getRatedMovies = (guestSessionId, page) => {
    this.moviesService
      .getRatedMovies(guestSessionId, page)
      .then((ratedMovies) => {
        this.setState((prevState) => {
          const updatedState = {
            ...prevState,
            ratedMovies,
            ratedTotalPages: ratedMovies.total_pages,
            ratedCurrentPage: ratedMovies.page,
          }
          return updatedState
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
  }

  onRatedChangePage = (page, guestSessionId) => {
    this.moviesService
      .getRatedMovies(guestSessionId, page)
      .then((ratedMovies) =>
        this.setState((prevState) => {
          const updatedState = {
            ...prevState,
            ratedMovies,
            ratedTotalPages: ratedMovies.total_pages,
            ratedCurrentPage: ratedMovies.page,
          }
          return updatedState
        })
      )
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
  }

  getGenresList = () => {
    this.moviesService.getGenresList().then((genresList) => {
      this.setState((prevState) => {
        const updatedState = { ...prevState, genresList: genresList.genres }
        return updatedState
      })
    })
  }

  render() {
    const {
      guestSessionId,
      ratedMovies,
      foundMovies,
      dataIsLoading,
      error,
      totalPages,
      currentPage,
      query,
      errorOnGetRatedMovies,
      ratedCurrentPage,
      ratedTotalPages,
      genresList,
    } = this.state
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <SearchContent
            onInputChange={this.onInputChange}
            foundMovies={foundMovies}
            dataIsLoading={dataIsLoading}
            error={error}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={this.onPageChange}
            query={query}
            onSetMovieRate={this.onSetMovieRate}
            guestSessionId={guestSessionId}
            ratedMovies={ratedMovies}
            moviesRatings={this.moviesRatings}
          />
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <RatedContent
            getRatedMovies={this.getRatedMovies}
            guestSessionId={guestSessionId}
            onSetMovieRate={this.onSetMovieRate}
            errorOnGetRatedMovies={errorOnGetRatedMovies}
            ratedMovies={ratedMovies}
            moviesRatings={this.moviesRatings}
            totalPages={ratedTotalPages}
            currentPage={ratedCurrentPage}
            onPageChange={this.onRatedChangePage}
          />
        ),
      },
    ]
    return (
      <div className="main">
        <GenresProvider value={genresList}>
          <Tabs centered items={items} className="tabs" destroyInactiveTabPane />
        </GenresProvider>
      </div>
    )
  }
}
