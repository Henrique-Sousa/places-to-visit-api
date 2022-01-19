import request from 'supertest';
import express from 'express';
import { connect, connection } from 'mongoose';

import Place from '../models/place';
import placesRouter from '../routes/places';

const places = [
  { name: 'maringa', photo: 'url1' },
  { name: 'mariana', photo: 'url2' },
  { name: 'maryland', photo: 'url3' },
  { name: 'mar', photo: 'url4' },
  { name: 'new york', photo: 'url5' },
];

async function run(): Promise<void> {
  await connect('mongodb://localhost:27017/tindin-fase2-test');
}

beforeAll(() => (
  run().catch((err) => console.log(err))
));

afterAll(async () => {
  await connection.close();
});

async function insertPlaces() {
  for (const place of places) {
    const newPlace = new Place(place);
    await newPlace.save();
  }
}

async function cleanDatabase() {
  for (const place of places) {
    await Place.deleteOne({ name: place.name });
  }
}

afterEach(async () => {
  await cleanDatabase();
});

const app = express();
app.use(express.json());

app.use('/places', placesRouter);

test('GET /places', async () => {
  await insertPlaces();

  const result = await request(app)
    .get('/places')
    .send({
      search: 'mar',
      order: 'name',
      page: 2,
      limit: 2,
    })
    .expect('Content-Type', /json/)
    .expect(200);
  expect(result.body.length).toBe(2);
  expect(result.body[0].name).toBe('maringa');
  expect(result.body[1].name).toBe('maryland');
});
