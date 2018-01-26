import React, { Component } from 'react';
import './styles/App.css';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import UserIcon from 'material-ui-icons/Person';
import Card, { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ViewIcon from 'material-ui-icons/Visibility';
import Divider from 'material-ui/Divider';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import AddIcon from 'material-ui-icons/Add';
import SearchIcon from 'material-ui-icons/Search';
import ClientInfo from './component/ClientInfo';
import NewClient from './component/NewClient';

class App extends Component {

  state = {
    clients: [],
    infoDialogOpen: false,
    addDialogOpen: false,
    selectedClient: null,
    searchEmail: ''
  };

  componentDidMount() {
    this.downloadClients();
  }

  downloadClients(){
    fetch('/clients', { method: 'GET' }).then(res => res.json()).then((resp) => {
      if (resp.success) {
        this.setState({
          clients: resp.data
        })
      }
    })
  }

  handleInfoToggle = (data) => {
    this.setState({ infoDialogOpen: !this.state.infoDialogOpen, selectedClient: data })
  }

  handleAddToggle = (forceUpdate = false) => {
    this.setState({ addDialogOpen: !this.state.addDialogOpen })
    if(forceUpdate) {
      this.downloadClients();
    }
  }

  searchByEmail() {
    fetch(`/clients?search=${this.state.searchEmail}`, { method: 'GET' }).then(res => res.json()).then((resp) => {
      if (resp.success) {
        this.setState({
          clients: resp.data
        })
      }
    })
  }

  openById(client_id) {
    fetch(`/clients/${client_id}`, { method: 'GET' }).then(res => res.json()).then((resp) => {
      if (resp.success) {
        this.setState({
          infoDialogOpen: true,
          selectedClient: resp.data
        })
      }
    })
  }

  changeField(event) {
    const field = event.target.name;
    this.setState({
      [field]: event.target.value
    })
  }

  render() {

    let { clients, infoDialogOpen, selectedClient, searchEmail, addDialogOpen } = this.state;

    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className="appbar-text">
              Clients App
            </Typography>
            <Input
              className="search-field"
              name="searchEmail"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(event) => { this.changeField(event) }}
              onKeyDown={(event) => { event.keyCode === 13 && this.searchByEmail() }}
              startAdornment={
                <IconButton
                  onClick={() => { this.searchByEmail() }}
                >
                  <SearchIcon />
                </IconButton>
              }
            />
          </Toolbar>
        </AppBar>
        <div className="Dashboard">
          <div className="dashboard-top">
            <Typography className="title" type="title"> Clients Found </Typography>
            <Button raised color="primary" onClick={() => { this.handleAddToggle() }}>
              <AddIcon className="add-icon" />
              New Client
            </Button>
          </div>
          <Card className="card">
            <CardContent>
              <List className="list">
                {
                  clients.map((client, i) => (
                    <div key={i}>
                      <ListItem>
                        <ListItemIcon>
                          <UserIcon />
                        </ListItemIcon>
                        <ListItemText primary={client.email} />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => { this.openById(client._id) }}>
                            <ViewIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {clients.length - 1 !== i && (<Divider />)}
                    </div>
                  ))
                }
              </List>
            </CardContent>
          </Card>
        </div>
        <Dialog
          open={infoDialogOpen}
          onClose={() => { this.handleInfoToggle(null) }}
          classes={{ paper: 'clientInfo' }}
        >
          <DialogTitle>Client Info</DialogTitle>
          <DialogContent>
            <ClientInfo client={selectedClient} />
          </DialogContent>
        </Dialog>
        <Dialog
          open={addDialogOpen}
          onClose={() => { this.handleAddToggle() }}
          classes={{ paper: 'clientInfo' }}
        >
          <NewClient close={this.handleAddToggle} />
        </Dialog>
      </div>
    );
  }
}

export default App;
