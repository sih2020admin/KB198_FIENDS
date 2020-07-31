import React from "react";
import StartFile from "./components/StartFile";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <StartFile />
    </BrowserRouter>
  );
}
