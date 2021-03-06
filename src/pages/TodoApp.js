import React from "react";
import AddTodo from "./todo/AddTodo";
import TodoList from "./todo/TodoList";
import VisibilityFilters from "./todo/VisibilityFilters";
import "./styles.css";

export default function TodoApp() {
  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <AddTodo />
      <TodoList />
      <VisibilityFilters />
    </div>
  );
}
