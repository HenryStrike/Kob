import './App.css';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import Routes from './components/Routes';
import { checkLocalUser } from './reducers/userSlice';

function App() {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const isPulling = useSelector((state) => state.user.isPulling);
	const routing = useRoutes(Routes(isLoggedIn));
	const dispatch = useDispatch();

    if(!isLoggedIn && isPulling){
        dispatch(checkLocalUser({
            success(){},
            error(){},
        }));
    }

	return (
		<div className="App">
			<NavBar />
			{routing}
		</div>
	);
}

export default App;
