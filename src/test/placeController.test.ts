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
  await Place.deleteOne({ name: 'chicago' });
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

test('GET /places/:id', async () => {
  await insertPlaces();

  const place = await Place.findOne({ name: 'maringa' });
  if (place) {
    const id = place._id;
    const result = await request(app)
      .get(`/places/${id}`)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(result.body._id).toBe(id.toString());
    expect(result.body.name).toBe('maringa');
    expect(result.body).toHaveProperty('photo');
  }
});

test('DELETE /places/:id', async () => {
  await insertPlaces();

  const placesResult = await Place.find();
  const id = placesResult[0]._id;

  await request(app)
    .delete(`/places/${id}`);

  const result = await Place.find();
  expect(result);
  if (result) {
    expect(result.length).toBe(4);
  }
});

test('PUT /places/:id with an id that doesnt exists', async () => {
  await insertPlaces();

  const place = await Place.findOne({ name: 'maringa' });

  const result = await request(app)
    .put('/places/')
    .send({
      _id: '000000000000000000000000',
      name: 'chicago',
    });
  expect(result.text).toBe('This id is not on database');
});

test('PUT /places/:id with a wrong id', async () => {
  await insertPlaces();

  const place = await Place.findOne({ name: 'maringa' });

  if (place) {
    const result = await request(app)
      .put('/places/')
      .send({
        _id: place._id.toString(),
        name: place.name,
      });
    expect(result.text).toBe('This place id has that name already');
  }
});

test('PUT /places/:id OK', async () => {
  await insertPlaces();

  const place = await Place.findOne({ name: 'maringa' });
  if (place) {
    const id = place._id.toString();

    const result = await request(app)
      .put('/places/')
      .send({
        _id: id,
        name: 'chicago',
      });
    expect(result.body._id).toBe(id);
    expect(result.body.name).toBe('chicago');
    expect(result.body).toHaveProperty('photo');
  }
});
