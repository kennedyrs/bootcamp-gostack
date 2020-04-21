import React, { useState, useEffect } from "react";

import api from './services/api'

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [techs, setTechs] = useState([])

  useEffect(() => {
    async function getRepositories(){
      const res = await api.get('/repositories')

      const repos = res.data
      // console.log(repos)

      setRepositories(repos)
    }

    getRepositories()
  }, [])

  async function handleAddRepository() {

    // const techsArray = techs.split(',')
    // console.log(techsArray)

    // setTechs(techsArray)

    const res = await api.post('/repositories', { title, url, techs: [techs] })

    const repo = res.data

    setRepositories([...repositories, repo])
  }

  async function handleRemoveRepository(id) {
    const res = await api.delete(`/repositories/${id}`)
    // console.log(res)

    const repos = repositories.filter((item) => {
      return item.id !== id
    })
    // console.log(repos)

    setRepositories(repos)

    // alert('Item removido')
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository =>
          <li key={repository.id}>
            { repository.title }

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        )}
      </ul>


        <input
          placeholder="TITLE"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          placeholder="URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

      <input
        placeholder="Techs"
        value={techs}
        onChange={e => setTechs(e.target.value)}
      />

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
