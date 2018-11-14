import axios from 'axios';

export function getAPOD(date = '') {
  return axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=xskOcLyR9cCgZI36ZAMUEZdghKZijJxd3JglqCv5&date=${date}`,
  );
}
