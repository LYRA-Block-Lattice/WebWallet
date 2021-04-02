import { Route, Switch } from 'react-router-dom';

import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import SettingsIcon from '@material-ui/icons/Settings';

import InfoIcon from '@material-ui/icons/Info';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import RestoreIcon from '@material-ui/icons/Restore';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import Welcome from './Welcome';
import FrontForm from './FrontForm';
import Swap from './Swap';
import Chaos from './Chaos';
import PrefForm from './PrefForm';

import Send from './SendForm';
import Info from './Info';
import OpenWallet from './OpenWallet';
import CreateWallet from './CreateWallet';
import RestoreWallet from './RestoreWallet';

const WalletMenu = [
    {
        text: "Info",
        icon: <InfoIcon />,
        link: "/info",
        rndr: <Info />,
    },
    {
        text: "Send",
        icon: <SendIcon />,
        link: "/send",
        rndr: <Send />,
    },
    {
        text: "Create",
        icon: <AddIcon />,
        link: "/create",
        rndr: <CreateWallet />,
    },
    {
        text: "Restore",
        icon: <RestoreIcon />,
        link: "/restore",
        rndr: <RestoreWallet />,
    },
    {
        text: "Open",
        icon: <VpnKeyIcon />,
        link: "/open",
        rndr: <OpenWallet />,
    }
];

const MainMenu = [
    {
        text: "Wallet",
        icon: <AccountBalanceWalletIcon />,
        link: "/wallet",
        rndr: <FrontForm />,
        submenu: WalletMenu
    },
    {
        text: "Token Swap",
        icon: <SwapCallsIcon />,
        link: "/swap",
        rndr: <Swap />,
    },
    {
        text: "Chaos",
        icon: <LocalMallIcon />,
        link: "/chaos",
        rndr: <Chaos />,
    }
];

const SysMenu = [
    {
        text: "Settings",
        icon: <SettingsIcon />,
        link: "/pref",
        rndr: <PrefForm />,
    }
];

const HomeMenu = [
    {
        text: "Home",
        icon: <HomeIcon />,
        link: "/welcome",
        rndr: <Welcome name="Lyrians" />,
    }
];

const Menus = [HomeMenu, MainMenu, SysMenu]

export default Menus;

export const Switches = () => <Switch>
    <Route path="/swap" key="swap" component={Swap} />
    <Route path="/chaos" key="chaos" component={Chaos} />
    <Route path="/pref" key="pref" component={PrefForm} />
    <Route
        path="/wallet"
        key="wallet"
        render={({ match: { path } }) => (
            <>
                <Route path={`${path}/`} key="walletroot" component={FrontForm} exact />
                <Route path={`${path}/info`} key="walletinfo" component={Info} />
                <Route path={`${path}/send`} key="walletsend" component={Send} />
                <Route path={`${path}/create`} key="walletcreate" component={CreateWallet} />
                <Route path={`${path}/restore`} key="walletrestore" component={RestoreWallet} />
                <Route path={`${path}/open`} key="walletopen" component={OpenWallet} />
            </>
        )}
    />
    <Route path="/wallet" component={FrontForm} />
    <Route path="/">
        <Welcome name="Lyrians" />
        </Route>
</Switch>

