import React from 'react';
import axios from 'axios'

// import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import {DateFormatInput} from 'material-ui-next-pickers'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import Icon from '@material-ui/core/Icon';

import './App.css'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      todo_list: [],
      name: "",
      description: "",
      due: "",
      due_UTC: "",
      createdAt: "2019-05-15 18:36:41",
      updatedAt: "2019-05-15 18:36:41",
      color: "",
      id_counter: 0
    }
    this.createTodo = this.createTodo.bind(this)
    this.fetchTodo = this.fetchTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeDesciption = this.handleChangeDesciption.bind(this)
    this.handleChangeColor = this.handleChangeColor.bind(this)
    this.handleChangeDue = this.handleChangeDue.bind(this)
    this.formatDate = this.formatDate.bind(this)
    this.updateTodo = this.updateTodo.bind(this)
  }
  componentDidMount(){
    axios.get('http://localhost/api/Todo/read.php')
    .then(({data: todo}) => this.fetchTodo(todo))
    .catch(error => console.log(error))
  }
  updateTodo(todoItem){
    let id = todoItem['id']
    todoItem['isDone'] = !todoItem['isDone']
    // update state to force re-render
    this.setState({
      todo_list: this.state.todo_list.map(todo => 
        todo.id === id ? todoItem : todo 
      )
    })

    // deep copy todoItem and convert boolean to string
    let request = JSON.parse(JSON.stringify(todoItem))
    request['isDone'] ? request['isDone'] = '1' : request['isDone'] = '0'
    axios.post('http://localhost/api/Todo/update.php', request)
    .then(response=>console.log(response))
    .catch(error => console.log(error))
  }
  fetchTodo(t){
    // convert isDone from string to boolean
    t = t.map(todo => todo.isDone === '0' ? {...todo, isDone: false} : {...todo, isDone: true})
    this.setState({ todo_list: t })
    this.setState({ id_counter: (Number(t[t.length-1]['id']) + 1).toString() })
  }
  createTodo() {
    let state = this.state
    let new_todo = {}
    new_todo['name'] = state.name
    new_todo['description'] = state.description
    new_todo['due'] = state.due
    new_todo['createdAt'] = state.createdAt
    new_todo['updatedAt'] = state.updatedAt
    new_todo['color'] = state.color
    
    axios.post('http://localhost/api/Todo/create.php', new_todo)
    .then(response => console.log(response))
    .catch(error => console.log(error))
    
    // update state to force re-render
    new_todo['id'] = state.id_counter
    this.setState({ id_counter: this.state.id_counter+1 })
    // deep copy new_todo
    let obj = JSON.parse(JSON.stringify(new_todo))
    this.setState({
        todo_list: this.state.todo_list.concat(obj),
        name: "",
        description: "",
        due: "",
        due_UTC: "",
        color: ""
    })
  }
  deleteTodo(id){
    axios.post('http://localhost/api/Todo/delete.php', id)
    .then(response => console.log(response))
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
  handleChangeDesciption(new_desc){
    this.setState({
      description: new_desc
    })
  }
  handleChangeDue(date){
    let UTC = date
    date = this.formatDate(date)
    this.setState({
      due: date
    })
    this.setState({
      due_UTC: UTC
    })

  }
  handleChangeColor(new_color){
    this.setState({
      color: new_color
    })
  }
  formatDate(date){
    let monthNames = [
      "01", "02", "03",
      "04", "05", "06", "07",
      "08", "09", "10",
      "11", "12"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let seconds = date.getSeconds();

    // format 2019-05-15 18:36:41
    let new_date = year + '-' + monthNames[monthIndex] + '-' + day + ' ' + hour +':' + minute + ':' + seconds
    return new_date;
  }

  render() {
    let todo_list = this.state.todo_list
    console.log(todo_list)
    const { classes } = this.props;

    return (
      <div>
        <div className="tag"> An easy way to manage your work. 
          <span className="caret">|</span>
        </div>
        <div className="container mt-3">
          <div className="row justify-content-center">
            <TextField
              id="standard-name"
              label="Title"
              className="input-name mt-0 mx-3"
              value={this.state.name}
              onChange={(e) => this.handleChangeName(e.target.value)}
              margin="normal"
            />
            <TextField
              id="standard-name"
              label="Description"
              className="input-name mt-0 mx-3"
              value={this.state.description}
              onChange={(e) => this.handleChangeDesciption(e.target.value)}
              margin="normal"
            />
          </div>
          
          <div className="row justify-content-center mt-3">  
            <div className="w-small mx-3">
              <DateFormatInput 
                className='datePicker'
                label="Deadline"
                name='date-input'
                dateFormat="yyyy-MM-dd" 
                value={this.state.due_UTC} 
                onChange={(e) => this.handleChangeDue(e)}/>
            </div>

            <FormControl className="formcontrol mx-3">
              <InputLabel htmlFor="age-native-simple">Color</InputLabel>
              <Select
                native
                value={this.state.color}
                onChange={(e) => this.handleChangeColor(e.target.value)}
                inputProps={{
                  name: 'age',
                  id: 'age-native-simple',
                }}
              >
                <option value="default"></option>
                <option value="EDEDED">Grey</option>
                <option value="D4DDEE">Blue</option>
                <option value="FFE5D4">Red</option>
                <option value="DDF3D9">Green</option>
                <option value="FFF4CA">Yellow</option>
              </Select>
            </FormControl>

            <Fab 
              color="primary" 
              aria-label="Add" 
              className="addTodo align-self-center mx-4" 
              size="small" 
              onClick={ () => this.createTodo() }>
              <AddIcon />
            </Fab>
          </div>
        </div>

        <br/>
        <div>
        {
          todo_list.length === 0 ?
            <div className="container cardWidth"></div>
          :  
          todo_list.map(
            (todo) => 
              <div key={todo.id} className="container cardWidth">
                <div className={`${todo.color} colorTag`} />
                <div className="row justify-content-center todoCard">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={todo.isDone}
                        onChange={() => this.updateTodo(todo)}
                        classes={{
                          root: classes.root,
                          checked: classes.checked,
                        }}
                      />
                    }
                    label=""
                  />

                  <div className="text-center d-flex col-8">
                    <h3 className="todoName align-self-center mb-0">{todo.name}</h3>
                  </div>

                  <div className="row ml-5">
                    <Fab 
                        aria-label="Delete" 
                        size="small" 
                        className="deleteTodo align-self-end mb-2"
                        onClick={ () => this.deleteTodo(todo.id) }
                    >
                        <DeleteIcon />
                    </Fab>
                  </div>
                    
                </div>
              </div>
          )
        }
        </div>

      </div>
    )
  }
}

const styles = {
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
};

export default withStyles(styles)(App);
