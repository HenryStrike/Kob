import './App.css';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import Routes from './components/Routes';
import ACTIONS from './actions/types';
import { useEffect } from 'react';
import userActions from './actions/userActions';

function App() {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const routing = useRoutes(Routes(isLoggedIn));
	const dispatch = useDispatch();

	useEffect(()=>{
        // check user validation
        const token = localStorage.getItem("token");
        if(token) {
            // update token
            dispatch({
                type : ACTIONS.UPDATE_TOKEN,
                payload : token,
            });
            // check token validation
            dispatch(userActions.getInfo({
                token,
                success(){
                    // show view
                    dispatch({
                        type : ACTIONS.UPDATE_PULLING,
                        payload : false,
                    });
                },
                error(){
                    dispatch({
                        type : ACTIONS.UPDATE_PULLING,
                        payload : false,
                    });
                },
            }));
        }else{
            dispatch({
                type : ACTIONS.UPDATE_PULLING,
                payload : false,
            });
        }
    },[dispatch]);

	return (
		<div className="App">
			<NavBar />
			{routing}
		</div>
	);
}

export default App;
