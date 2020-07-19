import React, {Component} from 'react';
import {View,Text,TouchableOpacity,StyleSheet, Dimensions, TextInput} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import propTypes from 'prop-types';


const {height, width} = Dimensions.get('window');

export default class ToDo extends Component{
    constructor(props){
        super(props)
        this.state={isEditing: false, todoValue: props.text,}
    }

    static propTypes={
        text: propTypes.string.isRequired,
        isCompleted: propTypes.bool.isRequired,
        deleteToDo: propTypes.func.isRequired,
        id: propTypes.string.isRequired,
        uncompleteToDo: propTypes.func.isRequired,
        completeToDo : propTypes.func.isRequired,
        updateToDo : propTypes.func.isRequired,
    }
   


    render(){
        const { isEditing, todoValue} = this.state;
        const {text, id, deleteToDo, isCompleted} = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete}>
                        {isCompleted ? (<FontAwesome name='check-circle-o' size={25} color='#bbb' />) : (<FontAwesome name='check-circle-o' size={25} color='#5f27cd' />) }
                    </TouchableOpacity>
                    {isEditing ? (<TextInput style={[
                         styles.text,
                         styles.input,
                        isCompleted ? styles.completedText : styles.uncompletedText
                    ]} value={todoValue} multiline={true} onChangeText={this._controlInput} 
                    returnKeyType={'done'} onBlur={this._finishEditing}/>):
                (<Text style={[styles.text, isCompleted ? styles.completedText : styles.uncompletedText]}>{text}</Text>)}
                </View>
               
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <FontAwesome name="check-square-o" size={25} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <FontAwesome name="edit" size={25} color="black" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={event=> {event.stopPropagation; 
                                deleteToDo(id)}}>
                                <View style={styles.actionContainer}>
                                    <FontAwesome name="trash-o" size={25} color="black" />  
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                
            </View>

            
        )
    }

    _toggleComplete = event => {
        event.stopPropagation();
        const {isCompleted, uncompleteToDo, completeToDo, id} =this.props;
        if(isCompleted){
            uncompleteToDo(id)
        }else{
            completeToDo(id)
        }
    }

    _startEditing = event => {
        event.stopPropagation();
        this.setState({
            isEditing: true,
        })
    }

    _finishEditing = event => {
        event.stopPropagation();
        const {todoValue} = this.state;
        const {id,updateToDo} = this.props;
        updateToDo(id,todoValue)
        this.setState({
            isEditing: false
        })
    }
    _controlInput = (text) => {
        this.setState({todoValue: text})
    }
}





const styles = StyleSheet.create({
    container: {
        width: width -50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontWeight: '600',
        fontSize: 17,
        marginVertical: 20,
        position: 'absolute',
        marginStart: 40
        
    },
    completedText: {
        color:'#bbb',
        textDecorationLine: 'line-through',
    },
    uncompletedText: {

    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width / 2,
    },
    actions: {
        flexDirection: 'row',
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    input: {
        marginVertical: 15,
        width: width /2
    }

});