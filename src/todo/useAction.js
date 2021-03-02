export const addTodo = ({ id, text }) => ({
    type: "ADD_TODO",
    payload: {
      id,
      text,
    },
  });
  
  export const doneTodo = id => ({
    type: "DONE_TODO",
    payload: id,
  });