import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppActionsType, AppThunkType} from "./store";


//====================================TYPES====================================
export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}
export type SetTodolistACType = ReturnType<typeof setTodolistAC>

export type TodolistActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistACType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]


//====================================REDUCER====================================
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "SET-TODO-LISTS": {
            return action.todolist.map(tl => ({...tl, filter: "all"}))
        }
        default:
            return state;
    }
}

//====================================ACTION CREATOR====================================
export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}
export const setTodolistAC = (todolist: TodolistType[]) => {
    return {type: 'SET-TODO-LISTS', todolist} as const
}


// ===============================THUNKS===============================

// export const getTodoTC = (): AppThunkType => (dispatch, getState: any) => {
//     todolistsAPI.getTodolists()
//         .then((res) => {
//             dispatch(setTodolistAC(res.data))
//         })
// }

// export const addNewTodolistTC = (title: string): AppThunkType => (dispatch, getState: any) => {
//     todolistsAPI.createTodolist(title)
//         .then((res) => {
//             dispatch(addTodolistAC(title))
//         })
// }

// export const deleteTodolistTC = (id: string): AppThunkType => (dispatch, getState: any) => {
//     todolistsAPI.deleteTodolist(id)
//         .then((res) => {
//             dispatch(removeTodolistAC(id))
//         })
// }

// export const changeTodolistTitleTC = (id: string, title: string): AppThunkType => (dispatch, getState: any) => {
//     todolistsAPI.updateTodolist(id, title)
//         .then((res) => {
//             dispatch(changeTodolistTitleAC(id, title))
//         })
// }

// ===============================async await===============================
export const getTodoTC = (): AppThunkType => async dispatch => {
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistAC(res.data))
    } catch (e) {
        console.error(e)
        throw new Error('Error getTodoTC')
    }
}


export const addNewTodolistTC = (title: string): AppThunkType => async dispatch => {
    try {
        await todolistsAPI.createTodolist(title)
        dispatch(addTodolistAC(title))
    } catch (e) {
        console.error(e)
        throw new Error('Error addNewTodolistTC')
    }
}

export const deleteTodolistTC = (id: string): AppThunkType => async dispatch => {
    try {
        await todolistsAPI.deleteTodolist(id)
        dispatch(removeTodolistAC(id))
    } catch (e) {
        console.error(e)
        throw new Error('Error deleteTodolistTC')
    }
}

export const changeTodolistTitleTC = (id: string, title: string): AppThunkType => async dispatch => {
    try {
        await todolistsAPI.updateTodolist(id, title)
        dispatch(changeTodolistTitleAC(id, title))
    } catch (e) {
        console.error(e)
        throw new Error('Error changeTodolistTitleTC')
    }
}






