const initState = {
    todos: [
      {
        id: "0",
        text: "Learn React hooks",
      },
    ],
  };
  
  const todos = (state = initState, action) => {
    switch (action.type) {
      case "ADD_TODO":
        return { todos: [...state.todos, action.payload] };
      case "DONE_TODO":
        return {
          todos: state.todos.filter(todo => todo.id !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default todos;