const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = async (req, res) => {
  try {
    const [result] = await db.query('select * from albums');
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
};

const getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await db.query('SELECT * FROM albums WHERE id = ?', [id]);
    console.log(result);
    if (result.length === 0) {
      res.status(404).send('Not found');
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error(err);
  }
};

const getTracksByAlbumId = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await db.query('SELECT * FROM track WHERE id_album = ?', [
      id,
    ]);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
};

const postAlbums = async (req, res) => {
  const { title, genre, picture, artist } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO albums (title, genre, picture, artist) VALUES (?,?,?,?)',
      [title, genre, picture, artist]
    );
    res
      .status(201)
      .json({ title, genre, picture, artist, id: result.insertId });
  } catch (err) {
    console.error(err);
  }
};

const updateAlbums = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { title, genre, picture, artist } = req.body;
    await db.query(
      'UPDATE albums SET title = ?, genre = ?, picture = ?, artist = ? WHERE id = ?',
      [title, genre, picture, artist, id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};

const deleteAlbums = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await db.query('DELETE FROM albums WHERE id = ?', [id]);
    if (!result.affectedRows) res.status(404).send('Album not found');
    else res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
