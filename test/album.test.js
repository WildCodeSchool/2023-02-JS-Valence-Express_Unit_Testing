const supertest = require('supertest');

const app = require('../src/app');
const { albumToCreate, albumKeys, trackKeys } = require('./testsData');
describe('🎧 ALBUMS ROUTES', () => {
  const persistentData = {};

  it('should get the albums list 🧪 /api/albums', async () => {
    const res = await supertest(app)
      .get('/api/albums')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach((album) => {
      albumKeys.map((prop) => {
        expect(album).toHaveProperty(prop);
      });
    });
  });

  it('should get the track list of album 1 🧪 /api/albums/1/tracks', async () => {
    const res = await supertest(app)
      .get('/api/albums/1/tracks')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach((track) => {
      trackKeys.map((prop) => {
        expect(track).toHaveProperty(prop);
      });
      expect(track).toHaveProperty('id_album', 1);
    });
  });

  it('should get the album with id 1 🧪 /api/albums/1', async () => {
    const res = await supertest(app)
      .get('/api/albums/1')
      .expect(200)
      .expect('Content-type', /json/);

    expect(Array.isArray(res.body)).toBe(false);

    albumKeys.map((prop) => {
      expect(res.body).toHaveProperty(prop);
    });
  });

  it('should create a new album 🧪 /api/albums', async () => {
    const res = await supertest(app)
      .post('/api/albums')
      .send(albumToCreate)
      .expect(201)
      .expect('Content-Type', /json/);

    albumKeys.map((prop) => {
      expect(res.body).toHaveProperty(prop);
    });
    persistentData.album = res.body;
  });

  describe('modifying an album:', () => {
    let album;
    beforeEach(async () => {
      const res = await supertest(app).post('/api/albums').send(albumToCreate);
      album = res.body;
    });

    it(`should update the created album title 🧪 /api/albums/:id`, async () => {
      await supertest(app)
        .put(`/api/albums/${album.id}`)
        .send({ title: 'The Dark Side of the Sun' })
        .expect(204);

      const res = await supertest(app).get(`/api/albums/${album.id}`);

      expect(res.body).toHaveProperty('title', 'The Dark Side of the Sun');
    });

    it(`should delete the created album 🧪 /api/albums/:id`, async () => {
      // faire requete http DELETE pour supprimer l'album qu'on a persisté
      await supertest(app).delete(`/api/albums/${album.id}`).expect(204);
      // faire requete http GET sur le endpoint de l'abum et vérifier qu'on obtient bien un 404
      await supertest(app).get(`/api/albums/${album.id}`).expect(404);
    });
  });
});
