import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChatRoom from './ChatRoom';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

// ReactDOM.render(<ChatRoom />, document.getElementById('root'));
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ChatRoom />
  </ThemeProvider>,
  document.getElementById('root'),
);
