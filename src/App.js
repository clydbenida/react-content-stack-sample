import logo from './logo.svg';
import './App.css';
import { useEffect } from "react";
import { getAboutPage, getHomePageLandingRes } from "./helpers";

function App() {
  useEffect(() => {
    const getLandPage = async () => {
      const response = await getHomePageLandingRes();
      console.log(response);
    };

    const getAbout = async () => {
      const response = await getAboutPage();
      console.log("About", response);
    };

    getLandPage();
    getAbout();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
