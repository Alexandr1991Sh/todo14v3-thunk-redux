import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Menu} from '@mui/icons-material';
import {
    addNewTodolistTC,
    changeTodolistFilterAC, changeTodolistTitleTC, deleteTodolistTC,
    FilterValuesType, getTodoTC,
    TodolistDomainType
} from './state/todolists-reducer'
import {
    changeTaskTitleTC,
    createTaskTC,
    removeTaskTC, updateTaskTC
} from './state/tasks-reducer';
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch, useAppSelector} from './state/store';
import {TaskStatuses, TaskType} from './api/todolists-api'


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch();

    // const removeTask = useCallback(function (id: string, todolistId: string) {
    //     const action = removeTaskAC(id, todolistId);
    //     dispatch(action);
    // }, []);

    // const addTask = useCallback(function (title: string, todolistId: string) {
    //     const action = addTaskAC(title, todolistId);
    //     dispatch(action);
    // }, []);

    // const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    //     const action = changeTaskStatusAC(id, status, todolistId);
    //     dispatch(action);
    // }, []);

    // const removeTodolist = useCallback(function (id: string) {
    //     const action = removeTodolistAC(id);
    //     dispatch(action);
    // }, []);

    // const addTodolist = useCallback((title: string) => {
    //     const action = addTodolistAC(title);
    //     dispatch(action);
    // }, [dispatch]);

    // const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    //     const action = changeTaskTitleAC(id, newTitle, todolistId);
    //     dispatch(action);
    // }, []);

    // const changeTodolistTitle = useCallback(function (id: string, title: string) {
    //     const action = changeTodolistTitleAC(id, title);
    //     dispatch(action);
    // }, []);

    //================================TASK================================
    // add task thunk
    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(createTaskTC(title, todolistId));
    }, []);

    // remove task thunk
    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(removeTaskTC(taskId, todolistId));
    }, []);

    // change task status thunk
    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(todolistId, id, status));
    }, []);

    // change task title thunk
    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleTC(id, newTitle, todolistId));
    }, []);

    //================================TODOLIST================================
    //delete todolist thunk
    const removeTodolist = useCallback(function (id: string) {
        dispatch(deleteTodolistTC(id));
    }, []);

    // add new todolist thunk
    const addTodolist = useCallback((title: string) => {
        dispatch(addNewTodolistTC(title));
    }, []);

    // change todolist title thunk
    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC(id, title));
    }, [dispatch]);

    // change filter
    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);


    useEffect(() => {
        dispatch(getTodoTC())
    }, [])


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];

                            return <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
