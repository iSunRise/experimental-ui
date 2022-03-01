import React from 'react';
import { QueryClientProvider } from "react-query";

import './App.css';
import TodoList from "./Todo/TodoList";
import queryClient from "./queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <TodoList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
