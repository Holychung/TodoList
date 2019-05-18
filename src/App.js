import React from 'react';
import axios from 'axios'

// import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

import './App.css'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      todo_list: [],
      name: "",
      description: "default",
      due: "",
      createdAt: "2019-05-15 18:36:41",
      updatedAt: "2019-05-15 18:36:41",
    }
    this.createTodo = this.createTodo.bind(this)
    this.getTodo = this.fetchTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
  }

  componentDidMount(){
    axios.get('http://localhost/api/Todo/read.php')
    .then(({data: todo}) => this.fetchTodo(todo))
    .catch(error => console.log(error))
  }
  fetchTodo(t){
    this.setState({ todo_list: t })
  }
  createTodo() {
    let state = this.state
    let new_todo = {}
    new_todo['name'] = state.name
    new_todo['description'] = state.description
    new_todo['due'] = state.due
    new_todo['createdAt'] = state.createdAt
    new_todo['updatedAt'] = state.updatedAt
    
    axios.post('http://localhost/api/Todo/create.php', new_todo)
    .then(response=>console.log(response))
    .catch(error => console.log(error))
    
    // update state to force re-render
    new_todo['id'] = this.state.todo_list.length + 1
    // for deep copy new_todo
    let obj = JSON.parse(JSON.stringify(new_todo))
    this.setState({
        todo_list: this.state.todo_list.concat(obj)
    })
  }
  deleteTodo(id){
    axios.post('http://localhost/api/Todo/delete.php', id)
    .then(response=>console.log(response))
    .catch(error => console.log(error))

    this.setState({
      todo_list: this.state.todo_list.filter(todo => todo.id !== id)
    })
  }
  handleChangeName(new_name){
    this.setState({
      name: new_name
    })
  }
  handleChangeDue(new_due){
    this.setState({
      due: new_due
    })
  }

  render() {
    let todo_list = this.state.todo_list
    console.log(this.state.todo_list)

    return (
      <div>
        PHP hello
        <form className="container" noValidate autoComplete="off">  
          <TextField
            id="standard-name"
            label="Name"
            className="input-name"
            value={this.state.name}
            onChange={(e) => this.handleChangeName(e.target.value)}
            margin="normal"
          />

          <TextField
            id="datetime-local"
            label="Next appointment"
            type="datetime-local"
            // defaultValue="2017-05-24T10:30"
            className="timeee"
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.due}
            onChange={(e) => this.handleChangeDue(e.target.value)}
          />

          <TextField
            id="standard-password-input"
            label="Password"
            className="aa"
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
        </form>

        <br/>

        {
          todo_list &&  
          todo_list.map(
            (todo) => 
              <div key={todo.id}>
                <div> {todo.id}: {todo.name} </div>
                <button onClick={ () => this.handleAddTodo(tmp_data) }>update one</button>
                <button onClick={ () => this.deleteTodo(todo.id) }>delete one</button>
              </div>
          )
        }
        <button onClick={ () => this.createTodo() }>add one</button>
      </div>
    )
  }
}

const tmp_data = {
  "name": "Yee",
  "description" : "Yee",
  "due": "2019-05-15 18:36:41",
  "createdAt": "2019-05-15 18:36:41",
  "updatedAt": "2019-05-15 18:36:41"
}

export default App
