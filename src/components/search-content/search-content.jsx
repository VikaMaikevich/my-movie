import { Component } from 'react'
import { Spin, Alert, Pagination } from 'antd'

import MovieList from '../movie-list/movie-list'
import Form from '../form/form'

export default class SearchContent extends Component {
  renderMovieCards = () => {
    const { guestSessionId, ratedMovies, foundMovies, onSetMovieRate, getMovieRate, moviesRatings } = this.props

    return foundMovies.map((movie) => (
      <li key={movie.id}>
        <MovieList
          id={movie.id}
          posterUrl={movie.poster_path}
          movieTitle={movie.title}
          movieDescription={movie.overview}
          releaseDate={movie.release_date}
          vote={movie.vote_average}
          onSetMovieRate={onSetMovieRate}
          guestSessionId={guestSessionId}
          ratedMovies={ratedMovies}
          getMovieRate={getMovieRate}
          movieRating={moviesRatings.get(movie.id) ? moviesRatings.get(movie.id) : 0}
          genreIds={movie.genre_ids}
        />
      </li>
    ))
  }

  render() {
    const { totalPages, currentPage, onInputChange, dataIsLoading, error, foundMovies, onPageChange, query } =
      this.props

    const hasData = !(dataIsLoading || error || totalPages === 0)

    const errorMessage = error ? (
      <Alert message="Error" description="Something went wrong..." type="error" showIcon />
    ) : null

    const nothingFound =
      totalPages === 1 && foundMovies.length === 0 ? (
        <Alert message="Oops" description="Nothing found..." type="warning" showIcon />
      ) : null

    const spinnner = dataIsLoading ? <Spin size="large" className="spinner" /> : null

    const content =
      hasData && totalPages > 0 ? (
        <>
          <ul className="movies-cards">{this.renderMovieCards()}</ul>
          <Pagination
            className="pagination"
            responsive
            current={currentPage}
            total={totalPages}
            showSizeChanger={false}
            showQuickJumper={false}
            onChange={(page) => {
              onPageChange(query, page)
            }}
            pageSize={1}
            hideOnSinglePage
          />
        </>
      ) : null

    return (
      <>
        <Form onInputChange={onInputChange} />
        {spinnner}
        {nothingFound}
        {errorMessage}
        {content}
      </>
    )
  }
}
