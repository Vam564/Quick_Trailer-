import './App.css';
import {BrowserRouter as Router , Route} from 'react-router-dom'
import DetailPage from './components/DetailPage/DetailPage';
import ListPage from './components/ListPage/ListPage';
import Footer from './components/Footer/Footer';

const App = () => {

  return (
    <div>
      <Router>
        <Route path="/" exact component={ListPage} />
        <Route path="/detailpage"   component={DetailPage} />
      </Router>
      <Footer></Footer>
    </div>
  )
}
export default App;
