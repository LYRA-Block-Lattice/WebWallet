import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { push } from 'connected-react-router'
import { useDispatch } from 'react-redux'

import { InfoIcon, PayIcon, SwapIcon } from '../lyra/icons';

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch()

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        dispatch(push(newValue));
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Info" value="/wallet/info" icon={<InfoIcon />} />
      <BottomNavigationAction label="Pay" value="/wallet/send" icon={<PayIcon />} />
      <BottomNavigationAction label="Swap" value="/swap" icon={<SwapIcon />} />
    </BottomNavigation>
  );
}
