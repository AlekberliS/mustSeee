import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Main from "./components/Main";
import ListPage from "./components/ListPage";


function App() {
  const [listName, setListName] = useState("");
  const [listItems, setListItems] = useState([]);

  return (
    <div className="App">
      <main className="mainn">
        <Router>
        <Routes>
        <Route path="/" element={<Main />} />
        <Route
  path="/list/:listName"
  element={<ListPage listItems={listItems} />}
/>
      </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;