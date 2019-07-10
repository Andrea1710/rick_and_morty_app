import React from "react";
import ListGrid from "./containers/ListGrid/ListGrid";

function App() {
  return (
    <div>
      <h1 className="h1 ml-4">
        Rick and Morty App
        <br />
        <small className="text-muted">Look for your favorite character!</small>
      </h1>
      <ListGrid />
    </div>
  );
}

export default App;
