import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import SettingsIcon from '@material-ui/icons/Settings';

const HomeMenu = [
    {
        text: "Home",
        icon: <HomeIcon />,
        link: "/",
    },
];

const MainMenu = [
    {
        text: "Wallet",
        icon: <AccountBalanceWalletIcon />,
        link: "/wallet",
    },
    {
        text: "Token Swap",
        icon: <SwapCallsIcon />,
        link: "/swap",
    },
    {
        text: "Chaos",
        icon: <LocalMallIcon />,
        link: "/chaos",
    },
];

const SubMenu = [
    {
        text: "Settings",
        icon: <SettingsIcon />,
        link: "/pref",
    },
];

const Menus = [HomeMenu, MainMenu, SubMenu];

export default Menus;

