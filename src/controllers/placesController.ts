import axios from 'axios';
import { controllerFunction } from './functions';
import Place from '../models/place';

const unsplashURL = 'https://api.unsplash.com/search/photos?per_page=1&query=';
const accessKey = process.env.ACCESS_KEY;

export const createPlace: controllerFunction = async (req, res, next) => {
  if (req.body && req.body.name) {
    const { name } = req.body;

    try {
      const unsplashResponse = await axios.get(`${unsplashURL}${name}`, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      });
      const photo = unsplashResponse.data.results[0].urls.small;

      const newPlace = new Place({ name, photo });
      const savedPlace = await newPlace.save();

      res.send(savedPlace);

    } catch (e) {
      res.send('Search term not found on Unsplash');
    }
  }

  res.send('You should specify a name');
};

// export const getAllPlaces: controllerFunction = async (req, res, next) => {
//   res.send('ok');
// };

// export const getPlaceById: controllerFunction = async (req, res, next) => {
//   res.send('ok');
// };

// export const updatePlace: controllerFunction = async (req, res, next) => {
//   res.send('ok');
// };

// export const deletePlace: controllerFunction = async (req, res, next) => {
//   res.send('ok');
// };
