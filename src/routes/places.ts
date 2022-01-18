import { Router } from 'express';
import passport from 'passport';
import {
  createPlace,
  getAllPlaces,
// getPlaceById,
// updatePlace,
// deletePlace,
} from '../controllers/placesController';

const Places = Router();

Places.post('/', createPlace);
Places.get('/', getAllPlaces);
// Places.get('/:id', getPlaceById);
// Places.put('/', updatePlace);
// Places.delete('/:id', deletePlace);

export default Places;
