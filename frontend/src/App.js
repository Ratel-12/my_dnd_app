import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import CreateMonster from './components/CreateMonster';
import EditMonster from './components/EditMonster';
import MonsterDetails from './components/MonsterDetails';
import DeleteAccount from './components/DeleteAccount';
import ChangePassword from './components/ChangePassword';
import MonsterList from './components/MonsterList';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/users" component={UserList} />
                    <Route path="/create-monster" component={CreateMonster} />
                    <Route path="/edit-monster/:monsterId" component={EditMonster} />
                    <Route path="/monster-details/:monsterId" component={MonsterDetails} />
                    <Route path="/delete-account" component={DeleteAccount} />
                    <Route path="/change-password" component={ChangePassword} />
                    <Route path="/user/:userId/monsters" component={MonsterList} />
                    <Route path="/" component={UserList} /> {/* Default Route */}
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
