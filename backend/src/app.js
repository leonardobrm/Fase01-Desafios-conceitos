const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs = [] } = req.body;

  if (!(title && url)) return res.json({ message: 'fill al fields' });

  let convertToArray = null;
  if (typeof (techs) !== 'object' && techs !== undefined) {
    convertToArray = techs.split(',');
  }

  const techsIndex = convertToArray ? convertToArray.findIndex(tech => tech === '') : techs.findIndex(tech => tech === '');

  //checks for empty techs 
  if (techsIndex > -1) return res.json({ message: 'it is not possible to enter an empty value' })

  const repository = {
    id: uuid(),
    title,
    url,
    techs: convertToArray !== null ? convertToArray : techs,
    likes: 0
  }
  repositories.push(repository)

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs = [] } = req.body;

  const repositorysIndex = repositories.findIndex(repository => repository.id === id);
  if (repositorysIndex < 0) return res.status(400).json('repository not exists');

  let convertToArray = null;
  if (typeof (techs) !== 'object' && techs !== undefined) {
    convertToArray = techs.split(separador = ',')
  }

  const techsIndex = convertToArray ? convertToArray.findIndex(tech => tech === '') : techs.findIndex(tech => tech === '');
  if (techsIndex > -1) return res.json({ message: 'it is not possible to enter an empty value' })

  const repository = {
    id,
    title: title ? repositories[repositorysIndex].title = title : repositories[repositorysIndex].title,
    url: url ? repositories[repositorysIndex].url = url : repositories[repositorysIndex].url,
    techs: convertToArray ? convertToArray : (techs[0] === undefined ? repositories[repositorysIndex].techs : techs),
    likes: repositories[repositorysIndex].likes
  }
  repositories[repositorysIndex] = repository

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const verifyRepositoryExists = repositories.findIndex(repository => repository.id === id);
  if(verifyRepositoryExists < 0) return res.status(400).json({message: 'repository not exists'});

  repositories.splice(verifyRepositoryExists, 1);

  return res.status(204).send();

});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const verifyRepositoryExists = repositories.findIndex(repository => repository.id === id);
  if(verifyRepositoryExists < 0) return res.status(400).json({message: 'repository not exists'});

  repositories[verifyRepositoryExists].likes += 1;

  return res.json(repositories[verifyRepositoryExists]);  

});

app.post("/repositories/:id/dislike", (req, res) => {
  const { id } = req.params;

  const verifyRepositoryExists = repositories.findIndex(repository => repository.id === id);
  if(verifyRepositoryExists < 0) return res.status(400).json({message: 'repository not exists'});


  if(repositories[verifyRepositoryExists].likes <= 0) return res.status(202).json({message: 'Negative likes are not possible'})
  repositories[verifyRepositoryExists].likes -= 1;

  return res.json(repositories[verifyRepositoryExists]);  

});

module.exports = app;
