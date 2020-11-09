import React from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import MainLayout from './components/MainLayout';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={}
  }

  render(){
    return (
        <MainLayout />
    );
  }
}

export default withStyles(styles)(App);
