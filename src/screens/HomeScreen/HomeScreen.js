import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'

export default function HomeScreen(props, {navigation}) {

    const [tareaText, setTareaText] = useState('') //variable para crear una tarea
    const [tareas, setTareas] = useState([]) //arregeloo de todas las tareas

    const tareaRef = firebase.firestore().collection('tareas') //definimos la colleción
    const userID = props.extraData.id //obtenemos el usuario conectado

    useEffect(() => { //traemos todas las tareas del usuario conectado ordenados por fecha dexc
        tareaRef
            .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newTareas = [] //Creamos un arreglo auxiliar
                    querySnapshot.forEach(doc => { //iteramos, extraemos los datos de la BD
                        const tarea = doc.data()
                        tarea.id = doc.id
                        newTareas.push(tarea) //se recorre cada elemento y se agrega al arreglo newTareas
                    });
                    setTareas(newTareas) //Modificamos el estado de tareas con el arreglo newTareas
                },
                error => {
                    console.log(error)
                }
            )
    }, [])

    const onAddButtonPress = () => { //funcion para agregar tarea
        if (tareaText && tareaText.length > 0) { //revisamos que no sea nulo
            const timestamp = firebase.firestore.FieldValue.serverTimestamp(); //nos traemos la fecha y hora del servidor de firestor
            //objeto tarea
            const data = { //declaramos la siguiente estructura, que se almacenará en la bd
                texto: tareaText, //texto de la tarea es igual a lo que capturamos
                authorID: userID, //usuario logeado
                createdAt: timestamp, //la fecha y hora
            };

            tareaRef
                .add(data) // agregamos a tarea el objeto data construido previamente
                .then(_doc => { //es una promesa, si se cumple entonces seguimos
                    setTareaText('') //limipamos la variable, (eesta conectada con el input)
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const renderTarea = ({item, index}) => { //funcion que renderiza cada tarea, recibe dos parametros
        return (//mostramos en un componente texto la tarea (item.texto) 
            <View style={styles.tareaContainer}>
                <Text style={styles.tareaText}> 
                    {item.texto}
                </Text>
            </View>
        )
    }

    const cerrar  = () => { 
        firebase.auth().signOut()
       
        .then(() => {
            alert("Saliendo...");
            window.location.href = window.location.href; //Cerrando sesión 
        })
        .catch((error) => {
            alert(error)
        });
        
    }

    return ( //retornamos la vista un textInput que esta conectatdo a tareaText, setTareaText
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={cerrar}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            <View style={styles.formContainer}>
                
                <TextInput
                    style={styles.input}
                    placeholder='Agregar una nueva tarea'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setTareaText(text)}
                    value={tareaText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
            </View>
            { tareas && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={tareas}
                        renderItem={renderTarea}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}
