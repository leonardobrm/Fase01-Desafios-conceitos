import React, { useState, useEffect } from "react";
import api from './services/api'

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);


  useEffect(() => {
    api.get('repositories').then((response) => {

      setRepositories(response.data)
    })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `${Date.now()}`,
      url: "https://github.com/sTrOnG66/Fase01-Desafios-conceitos/tree/master/frontend",
      techs: [
        "React"
      ]
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`);

    const newRepositories = repositories.filter(repository => repository.id !== id)

    setRepositories(newRepositories)
  }

  async function handleLikedRepository(id) {
    api.post(`repositories/${id}/like`);

    const { data } = await api.get('repositories');
    setRepositories(data);
  }
  async function handleDislikeRepository(id) {
    api.post(`repositories/${id}/dislike`);

    const { data } = await api.get('repositories');
    setRepositories(data);
  }

  return (
    <div className="main">
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            <div className="containerInfos">
              <a href={repository.url}>{repository.title}</a>
              <p className="likes">
                {`Likes: ${repository.likes}`}
              </p>
            </div>
            <button className="buttonLike" onClick={() => handleLikedRepository(repository.id)}>
              Like
            </button>
            <button className="buttonDislike" onClick={() => handleDislikeRepository(repository.id)}>
              Dislike
            </button>
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      <button className="addButton" onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;

