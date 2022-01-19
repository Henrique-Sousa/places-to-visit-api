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

interface FindQuery {
  name?: RegExp,
}

interface FindOptions {
  sort?: { [key: string]: number },
  skip?: number,
  limit?: number,
}

export const getAllPlaces: controllerFunction = async (req, res, next) => {
  const query: FindQuery = {};
  const options: FindOptions = {};

  if (req.body) {
    const {
      search, order, page, limit,
    } = req.body;

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    if (order) {
      options.sort = { [order]: 1 };
    }

    if (limit) {
      options.limit = limit;
    } else {
      options.limit = 50;
    }

    if (page) {
      options.skip = limit * (page - 1);
    }
  }

  try {
    const places = await Place.find(query, null, options);
    res.send(places);
  } catch (e) {
    console.log(e);
  }

  res.end();
};

export const getPlaceById: controllerFunction = async (req, res, next) => {
  const placeResult = await Place.findById(req.params.id);
  res.send(placeResult);
};

export const updatePlace: controllerFunction = async (req, res, next) => {
  if (req.body && req.body.name && req.body._id) {
    const { _id, name } = req.body;
    const inDatabase = await Place.findById(_id);
    if (inDatabase) {
      const regex = new RegExp(name, 'i');
      if (regex.test(inDatabase.name)) {
        res.send('This place id has that name already');
      } else {
        try {
          const unsplashResponse = await axios.get(`${unsplashURL}${name}`, {
            headers: { Authorization: `Client-ID ${accessKey}` },
          });
          const photo = unsplashResponse.data.results[0].urls.small;

          const newPlace = new Place({ _id, name, photo });
          const result = await Place.findByIdAndUpdate(_id, newPlace);

          if (result) {
            const placeToSend = {
              _id: result._id,
              name,
              photo,
            };
            res.send(placeToSend);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      res.send('This id is not on database');
    }

    res.end();
  } else {
    res.send('You should specify an id and a name');
  }
};

export const deletePlace: controllerFunction = async (req, res, next) => {
  await Place.findByIdAndRemove(req.params.id);
  res.end();
};
