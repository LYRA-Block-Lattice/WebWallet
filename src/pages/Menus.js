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
    },];

const MainMenu = [
    {
        text: "Wallet",
        icon: <AccountBalanceWalletIcon />,
        link: "/wallet",
        rndr: <FrontForm />,
        submenu: [WalletMenu]
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
    },
];

const SysMenu = [
    {
        text: "Settings",
        icon: <SettingsIcon />,
        link: "/pref",
        rndr: <PrefForm />,
    },
];

const HomeMenu = [
    {
        text: "Home",
        icon: <HomeIcon />,
        link: "/",
        rndr: <Welcome />,
    },
];

const Menus = [HomeMenu, MainMenu, SysMenu]

export default Menus;

