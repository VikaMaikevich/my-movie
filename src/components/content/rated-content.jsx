import { Component } from 'react'
import { Spin, Alert, Pagination } from 'antd'

import MovieList from '../movie-list/movie-list'

export default class RatedContent extends Component {
  componentDidMount() {
    const { getRatedMovies, guestSessionId } = this.props
    getRatedMovies(guestSessionId)
  }

  render() {
    const {
      dataIsLoading,
      guestSessionId,
      onSetMovieRate,
      ratedMovies,
      moviesRatings,
      currentPage,
      totalPages,
      onPageChange,
    } = this.props
    const nothingRated = !ratedMovies.results ? (
      <Alert
        message="Warning"
        description="It's empty here for now. You haven't rated any films yet"
        type="warning"
        showIcon
      />
    ) : null
    const spinner = !ratedMovies && !nothingRated && dataIsLoading ? <Spin size="large" className="spinner" /> : null
    const moviesList = ratedMovies.results
      ? ratedMovies.results.map((movie) => (
          <li key={movie.id}>
            <MovieList
              posterUrl={movie.poster_path}
              movieTitle={movie.title}
              movieDescription={movie.overview}
              releaseDate={movie.release_date}
              id={movie.id}
              vote={movie.vote_average}
              onSetMovieRate={onSetMovieRate}
              guestSessionId={guestSessionId}
              ratedMovies={ratedMovies}
              movieRating={moviesRatings.get(movie.id) ? moviesRatings.get(movie.id) : 0}
              genreIds={movie.genre_ids}
            />
          </li>
        ))
      : null
    const content = (
      <>
        <ul className="movies-cards">{moviesList}</ul>
        <Pagination
          className="pagination"
          responsive
          current={currentPage}
          total={totalPages}
          showSizeChanger={false}
          showQuickJumper={false}
          onChange={(page) => {
            onPageChange(page, guestSessionId)
          }}
          pageSize={1}
          hideOnSinglePage
        />
      </>
    )
    return (
      <>
        {spinner}
        {nothingRated}
        {content}
      </>
    )
  }
}
