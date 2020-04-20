import React, { useState, useEffect } from 'react'
import api from './services/api'

import './App.css'

// import backgroundImages from './assets/space-x-f-heavy.jpeg'

import Header from './components/Header'

function App() {
  // const [projects, setProjects] = useState(['Nodejs', 'React', 'VUE'])
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    api.get('/projects').then( response => {
      // console.log(response)
      setProjects(response.data)
    })
  }, [])

  async function handleAddProject() {
    // projects.push(`Teste ${date.now()}`)
    // setProjects([...projects, `Teste ${Date.now()}`])
    // setProjects([`Teste ${Date.now()}`, ...projects])
    
    const response = await api.post('/projects', {
      title: `API2 ${Date.now()}`,
      owner: '@@@@@@'
    })

    const project = response.data
    setProjects([...projects, project])

  }

  return ( 
  <>
    {/* <img width={400} src={backgroundImages} alt="falcon heavy"/> */}

    <Header title="Home Page">
      <ul>
        <li>Home</li>
        <li>Contacts</li>
      </ul>
    </Header>
    
    <Header title="Home Page 2">
      <ul>
        <li>Home 2</li>
        <li>Contacts 2</li>
      </ul>
    </Header>

    <ul>
      { projects.map(project =>
        <li key={project.id}>{ project.title }</li>
      ) }
    </ul>

      <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
  </>
  )
}

export default App