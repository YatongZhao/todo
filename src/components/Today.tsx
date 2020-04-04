import React, { useState, Dispatch, SetStateAction } from 'react';
import { DataByTimeRange, Action } from '../Data';
import { Box, Card, CardHeader, ButtonBase, makeStyles, CardActions, IconButton, Avatar, CardContent, Typography, Collapse } from '@material-ui/core';
import { useObserver } from 'mobx-react-lite';
import { blue, yellow, amber, orange, green, grey } from '@material-ui/core/colors';

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
    }
});

export const ProjectItem = ({ data, expanded, setExpanded }: {
    data: Action;
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<number>>
}) => {
    const classes = useStyles();
    let bgcolor;
    switch (data.status) {
        case 'pending':
            bgcolor = blue[200];
            break;
        case 'partial':
            bgcolor = yellow[200];
            break;
        case 'resolved':
        default:
            bgcolor = green[200];
            break;
    }
    return (
        <Box m={1} key={data.projectId}>
            <ButtonBase className={classes.root}>
                <Card>
                    <Box bgcolor={bgcolor} onClick={() => {
                        setExpanded(expanded ? -1 : data.projectId);
                    }}>
                        <CardHeader
                            title={data.title}
                        />
                    </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                        minutes.
                    </Typography>
                    <Typography paragraph>
                        Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                        heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                        browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                        and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                        pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                        saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                    </Typography>
                    <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                        without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                        medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                        again without stirring, until mussels have opened and rice is just tender, 5 to 7
                        minutes more. (Discard any mussels that don’t open.)
                    </Typography>
                    <Typography>
                        Set aside off of the heat to let rest for 10 minutes, and then serve.
                    </Typography>
                    </CardContent>
                </Collapse>
                </Card>
            </ButtonBase>
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
                <ProjectItem key={item.head.data.projectId} data={item.head.data}
                    expanded={expendedProjectId === item.head.data.projectId} setExpanded={setExpandedProjectId} />
            ))}
        </Box>
        <Box>
            {data.partialData.map(item => (
                <ProjectItem key={item.head.data.projectId} data={item.head.data}
                    expanded={expendedProjectId === item.head.data.projectId} setExpanded={setExpandedProjectId} />
            ))}
        </Box>
        <Box>
            {data.pendingData.map(item => (
                <ProjectItem key={item.head.data.projectId} data={item.head.data}
                    expanded={expendedProjectId === item.head.data.projectId} setExpanded={setExpandedProjectId} />
            ))}
        </Box>
    </Box>
    ));
}
