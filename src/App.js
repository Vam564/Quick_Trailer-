import './App.css';
import {BrowserRouter as Router , Route} from 'react-router-dom'
import DetailPage from './components/DetailPage/DetailPage';
import ListPage from './components/ListPage/ListPage';
import Footer from './components/Footer/Footer';
import CricketHome from './components/CricketScoreApp/CricketHome';

const App = () => {

  return (
    <div>
      <Router>
        <Route path="/list"  component={ListPage} />
        <Route path="/detailpage"   component={DetailPage} />
        <Route path="/" exact component={CricketHome} />
      </Router>
      <Footer></Footer>
    </div>
  )
}
export default App;
