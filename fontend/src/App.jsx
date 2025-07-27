import { useState, useEffect } from 'react'
import noteService from './services/notes'
import axios from 'axios'
import Note from './components/Note'
import Footer from './components/Footer'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
  console.log('effect')
  noteService      
  .getAll()      
  .then(initialNotes => {
    setNotes(initialNotes)
  })
}, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }
    noteService      
    .create(noteObject)      
    .then(returnedNotes => {        
      setNotes(notes.concat(returnedNotes))        
      setNewNote('')      
    })
  }
  const toggleImportanceOf = (id) => {
      const note = notes.find(n => n.id === id)
      const changedNote = { ...note, important: !note.important }  

      noteService      
      .update(id, changedNote)      
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {      
        setErrorMessage(          `Note '${note.content}' was already removed from server`        )        
        setTimeout(() => {
          setErrorMessage(null)        
        }, 5000) 
      })
    }
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
  const notesToShow = showAll    
  ? notes    
  : notes.filter(note => note.important === true)
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>        
        <button onClick={() => setShowAll(!showAll)}>          
          show {showAll ? 'important' : 'all'}        
        </button>     
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note 
          key={note.id} 
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input 
        value={newNote}
        onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App