import { Progress, Typography, Rate, Tag } from 'antd'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'

import trimText from '../../functions/trimText'
import notAvailable from '../../picture/no_image.png'
import { GenresConsumer } from '../../genres/genres'
import './movie-list.css'

const { Text, Title } = Typography
function MovieList({
  id,
  onSetMovieRate,
  guestSessionId,
  movieRating,
  vote,
  posterUrl,
  movieTitle,
  movieDescription,
  releaseDate,
  genreIds,
}) {
  const voteColor = (value) => {
    let color = ''

    if (value < 3) {
      color = '#E90000'
    } else if (value >= 3 && value < 5) {
      color = '#E97E00'
    } else if (value >= 5 && value <= 7) {
      color = '#E9D100'
    } else if (value > 7) {
      color = '#66E900'
    }
    return color
  }

  const setGenre = (array, ids) => {
    const arr = []
    ids.forEach((item) => arr.push(array.find((genre) => genre.id === item)))
    return arr.map((item) => <Tag key={item.id}>{item.name}</Tag>)
  }

  return (
    <div className="card">
      <div className="card-poster">
        <img
          src={!posterUrl ? notAvailable : `https://image.tmdb.org/t/p/original${posterUrl}`}
          alt={`${movieTitle} movie poster`}
        />
      </div>
      <div className="card-header">
        <Title level={5} className="movie-title">
          {trimText(movieTitle, 60)}
        </Title>
        <Progress
          type="circle"
          size={30}
          trailColor={voteColor(vote)}
          percent={vote.toFixed(1)}
          steps={1}
          format={(percent) => `${percent}`}
        />
      </div>
      <div className="card-meta">
        <Text type="secondary">
          {releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy', { locale: enGB }) : 'Date unknown'}
        </Text>
        <div className="movie-tags">
          <GenresConsumer>{(value) => setGenre(value, genreIds)}</GenresConsumer>
        </div>
      </div>
      <div className="card-description">
        <Text className="movie-review">{movieDescription ? trimText(movieDescription, 150) : 'No Description'}</Text>
        <Rate
          count={10}
          allowHalf
          className="movie-rate"
          onChange={(value) => onSetMovieRate(id, value, guestSessionId)}
          defaultValue={movieRating}
        />
      </div>
    </div>
  )
}
export default MovieList
