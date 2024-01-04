import React, { Fragment, useState, useRef, useEffect } from 'react'
import { TodoItem } from './TodoItem';
import axios from 'axios';

export function TodoList() {

    const [todos, setTodos] = useState([]);

    const taskRef = useRef();

    useEffect(() => {
        refreshTodos();
    }, [])

    const refreshTodos = () => {
        axios
            .get('api/todos/')
            .then((response) => setTodos(response.data))
            .catch((response) => console.error(response))
    }


    const agregarTarea = () => {
        console.log("AGREGANDO TAREA");
        const task = taskRef.current.value;
        const todo = {
            task: task
        }
        axios
            .post('api/todos/',todo)
            .then((response) => {
                alert("Exito");
                refreshTodos();
            })
            .catch((response) => alert(response))
       
    }

    const ResumenTareas = () => {
        const cant = cantidadTareas()
        if (cant === 0) {
            return (
                <div className="alert alert-success mt-3">
                    Felicitaciones no tienes tareas pendientes! :
                </div>
            )
        }

        if (cant === 1) {
            return (
                <div className="alert alert-info mt-3">
                    Te queda solamente una tarea pendiente!
                </div>
            )
        }

        return (
            <div className="alert alert-info mt-3">
                Te quedan {cant} tareas pendientes!
            </div>
        )
    }

    const cantidadTareas = () => {
        return todos.filter((todo) => !todo.completed).length;
    }

    const cambiarEstadoTarea = (id) => {
        const todoToUpdate = todos.find((t) => t.id === id);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

        axios
            .put(`api/todos/${id}/`, updatedTodo)
            .then((response) => {
                alert("Exito");
                refreshTodos();
            })
            .catch((error) => alert(error))
    }

    const eliminarTareasCompletadas = () => {
        axios
            .get('/api/todos/') 
            .then((response) => {
                const completedTodos = response.data.filter((todo) => todo.completed);
    
                
                completedTodos.forEach((todo) => {
                    axios
                        .delete(`/api/todos/${todo.id}/`)
                        .then((response) => {
                            console.log(`Tarea ${todo.id} eliminada corrrectamente`);
                        })
                        .catch((error) => {
                            console.error(`Error al eliminar ${todo.id}:, error`);
                        });
                });
    
                
                refreshTodos();
            })
            .catch((error) => alert(error));
        }
    return (

        <Fragment>
            <h1>Listado de Tareas</h1>

            <div className="input-group mt-4 mb-4">
                <input ref={taskRef} placeholder='Ingrese una tarea' className="form-control" type="text"></input>
                <button onClick={agregarTarea} className="btn btn-success ms-2"><i className="bi bi-plus-circle"></i></button>
                <button onClick={eliminarTareasCompletadas} className="btn btn-danger ms-2"><i className="bi bi-trash"></i></button>
            </div>

            <ul className="list-group">
                {todos.map((todo) => (
                    <TodoItem todo={todo} key={todo.id} cambiarEstado={cambiarEstadoTarea}></TodoItem>
                ))}
            </ul>

            <ResumenTareas />
        </Fragment>

    );
}
