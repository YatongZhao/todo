import React, { useState, Dispatch, SetStateAction, useContext } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { DataByTimeRange, Action, status, projectId, ProjectMapItem } from '../Data';
import {
    Box,
    Card,
    CardHeader,
    ButtonBase,
    makeStyles,
    CardContent,
    Typography,
    Collapse,
    Tabs, Tab, ButtonGroup, Button, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { useObserver } from 'mobx-react-lite';
import { blue, yellow, amber, orange, green, grey } from '@material-ui/core/colors';
import { StoreContext } from '../store/store';
import { theme } from './Home';
import moment from 'moment';

const useStyles = makeStyles({
    root: {
        display: 'block',
        width: '100%',
        textAlign: 'left',
    },
    avatar: {
      backgroundColor: blue[100],
    },
    title: {
        fontSize: 20,
        textOverflow: 'ellipsis',
        height: 30,
        overflow: 'hidden',
    },
    span: {
        fontSize: 12,
    },
    tabs: {
        '& .MuiTabs-indicator': {
            backgroundColor: 'white',
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
        },
    }
});

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}
  
const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        {...other}
      >
        {value === index && children}
      </Typography>
    );
  }

export const ProjectItem = ({ data, expanded, setExpanded }: {
    data: ProjectMapItem;
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<number>>
}) => {
    const store = useContext(StoreContext);
    const classes = useStyles();
    const [avalibelTabIndex, setAvalibelTabIndex] = useState(0);
    const headAction = data.head.data;
    const endAction = data.end.data;
    let bgcolor;
    switch (headAction.status) {
        case 'pending':
            bgcolor = blue;
            break;
        case 'partial':
            bgcolor = yellow;
            break;
        case 'resolved':
        default:
            bgcolor = green;
            break;
    }
    const handleStatus = (projectId: projectId, status: status) => {
        store.updateProject(projectId, { status });
        setExpanded(-1);
    }
    return (
        <Box m={1} key={headAction.projectId}>
                <Card>
            <ButtonBase className={classes.root}>
                <Box bgcolor={bgcolor[200]} onClick={() => {
                    setExpanded(expanded ? -1 : headAction.projectId);
                    setAvalibelTabIndex(0);
                }}>
                    <CardHeader
                        title={headAction.title}
                    />
                </Box>
            </ButtonBase>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box bgcolor={bgcolor[50]}>
                    <Tabs value={avalibelTabIndex} onChange={(event, index) => setAvalibelTabIndex(index)} className={classes.tabs}>
                        <Tab label="detail" />
                        <Tab label="history" />
                        <Box position="absolute" right={0} padding={1}>
                            <ThemeProvider theme={theme}>
                                <ButtonGroup size="small">
                                    {headAction.status !== 'resolved'
                                        && <Button onClick={() => handleStatus(headAction.projectId, 'resolved')}>Done</Button>}
                                    {headAction.status !== 'pending'
                                        && <Button onClick={() => handleStatus(headAction.projectId, 'pending')}>Undo</Button>}
                                    {headAction.status !== 'partial'
                                        && <Button onClick={() => handleStatus(headAction.projectId, 'partial')}>Partial done</Button>}
                                </ButtonGroup>
                            </ThemeProvider>
                        </Box>
                    </Tabs>
                </Box>
                    <SwipeableViews
                        index={avalibelTabIndex}
                        onChangeIndex={(index: number) => setAvalibelTabIndex(index)}
                        >
                <CardContent>
                    <TabPanel value={avalibelTabIndex} index={0} dir={theme.direction}>
                        <Box>
                            create time: {moment(endAction.modifyTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Box>
                        <Box>
                            last modify time: {moment(headAction.modifyTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Box>
                        <Box>
                            description: {headAction.description || 'no description.'}
                        </Box>
                    </TabPanel>
                </CardContent>
                <CardContent>
                    <TabPanel value={avalibelTabIndex} index={1} dir={theme.direction}>
                    History
                    </TabPanel>
                </CardContent>
                    </SwipeableViews>
            </Collapse>
                </Card>
        </Box>
    );
}

export const Today = ({ data }: {
    data: DataByTimeRange
}) => {
    const [expendedProjectId, setExpandedProjectId] = useState(-1);

    return useObserver(() => (
    <Box>
        <Box>
            {data.resolvedData.map(item => (
                <ProjectItem key={item.head.data.projectId} data={item}
                    expanded={expendedProjectId === item.head.data.projectId} setExpanded={setExpandedProjectId} />
            ))}
        </Box>
        <Box>
            {data.partialData.map(item => (
                <ProjectItem key={item.head.data.projectId} data={item}
                    expanded={expendedProjectId === item.head.data.projectId} setExpanded={setExpandedProjectId} />
            ))}
        </Box>
        <Box>
            {data.pendingData.map(item => (
                <ProjectItem key={item.head.data.projectId} data={item}
                    expanded={expendedProjectId === item.head.data.projectId} setExpanded={setExpandedProjectId} />
            ))}
        </Box>
    </Box>
    ));
}
