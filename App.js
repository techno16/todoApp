import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import ToDo from './ToDo';
import {v4 as uuidv4} from 'uuid';


const {height, width} = Dimensions.get('window');

export default class App extends Component {

  state = {
    newToDo: '',
    loadedTodos: false,
    toDos:{}
  }
  componentDidMount = () => {
    this._loadTodos();
  }
  render(){
    const {newToDo, loadedTodos, toDos} = this.state;

    if(!loadedTodos){
      return <AppLoading/>
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>할 일 메모 앱</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder={'할 일을 적어봅시다.'} 
          value={newToDo} onChangeText={this._controllNewToDo} 
          placeholderTextColor={'#999'} returnKeyType={'done'} autoCorrect={false}
          onSubmitEditing={this._addTodo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
            .reverse()
            .map(toDo => 
            <ToDo key={toDo.id}{...toDo} 
                  deleteToDo={this._deleteTodo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  updateToDo={this._updateToDo}
            />)}
          </ScrollView>
        </View>
      </View>
    )
  }
  _controllNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _loadTodos = async () => {
    try{
      const toDos = await AsyncStorage.getItem('toDos')
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedTodos: true, toDos: parsedToDos || {}
      })
    }catch(err){
      console.log(err)
    }
    
  }
    
  _addTodo = () => {
    const {newToDo} = this.state;
    if(newToDo !== ''){
      
      this.setState(prevState=> {
        const ID = uuidv4();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newToDo: '',
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState}
      })
    }
  }

  _deleteTodo = (id) => {
    this.setState(prevState=>{
      const toDos= prevState.toDos;
      delete toDos[id];
      const newState={
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos);
      return {...newState}
    })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
          ...prevState,
          toDos: {
              ...prevState.toDos,
              [id]: {
                  ...prevState.toDos[id],
                  isCompleted: false
              }
          }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _completeToDo = (id) => {
    this.setState(prevState => {
        const newState = {
            ...prevState,
            toDos: {
                ...prevState.toDos,
                [id]: {
                    ...prevState.toDos[id],
                    isCompleted: true
                }
            }
        }
        this._saveToDos(newState.toDos);
        return {...newState};
    })
  }

  _updateToDo = (id,text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
            ...prevState.toDos,
            [id]: {
                ...prevState.toDos[id],
               text: text
            }
        }
    }
    this._saveToDos(newState.toDos);
    return {...newState};
    })
  }

  _saveToDos = newToDos => {
    console.log(newToDos)
    const saveToDos = AsyncStorage.setItem("toDos",JSON.stringify(newToDos))
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5f27cd',
    alignItems: 'center',
    
  },
  title:{
    color: 'white',
    fontSize: 30,
    marginTop: 50,
    fontWeight: '200',
    marginBottom: 30,
  },
  card:{
    backgroundColor: 'white',
    flex:1,
    width: width -25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:{
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        showdowOffset:{
          height: -1,
          width: 0
        }
      },
      android:{
        elevation: 5,
      }
    })
  },
  input: {
    padding:20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  toDos: {
     alignItems: 'center',
  },
  
});
