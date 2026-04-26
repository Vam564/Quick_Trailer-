import './App.css';
import {BrowserRouter as Router , Route} from 'react-router-dom'
import DetailPage from './components/DetailPage/DetailPage';
import ListPage from './components/ListPage/ListPage';
import Footer from './components/Footer/Footer';
import Games from './components/Games/Games';
import Sports from './components/LiveTv/Sports/Sports';
import Series from './components/Series/Series';
import Music from './components/Music/Music';

const App = () => {

  return (
    <div className="app-wrapper">
      <div className="app-content">
        <Router>
          <Route path="/" exact component={ListPage} />
          <Route path="/detailpage"   component={DetailPage} />
          <Route path="/games"   component={Games} />
          <Route path="/sports"  component={Sports} />
          <Route path="/series"  component={Series} />
          <Route path="/music"   component={Music} />
        </Router>
      </div>
      <Footer></Footer>
    </div>
  )
}
export default App;
