import React from 'react';
import { Box, Typography, Button, ButtonGroup, IconButton, createMuiTheme, ThemeProvider } from '@material-ui/core';
import logo from '../logo2.png';
import HelpIcon from '@material-ui/icons/Help';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SettingsIcon from '@material-ui/icons/Settings';
import { lightBlue, blueGrey } from '@material-ui/core/colors';


export const theme = createMuiTheme({
    palette: {
      primary: blueGrey,
    },
});

export const Home = () => {
    return (
    <Box height='50vh' display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <img src={logo} alt="todo-logo" width="80"/>
        <Box mx={8} mt={4} textAlign="center" color={blueGrey[600]}>
            这是一款可以做时间旅行的TODO任务管理App，您的每一步操作都会被记录，有迹可查。
        </Box>
        <Box mt={4}>
            <ThemeProvider theme={theme}>
                <ButtonGroup size="small" variant="text" color="primary">
                    <Button><SettingsIcon /></Button>
                    <Button><FeedbackIcon /></Button>
                    <Button><HelpOutlineIcon /></Button>
                </ButtonGroup>
            </ThemeProvider>
        </Box>
    </Box>
    )
}