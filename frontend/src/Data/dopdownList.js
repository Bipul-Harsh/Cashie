import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SettingsIcon from '@material-ui/icons/Settings';

const adminDropdownList = [
    {name: "Account", icon: <SupervisorAccountIcon />, path: "account"},
    {name: "Settings", icon: <SettingsIcon />, path: "settings"},
]

const cashierDropdownList = [
    {name: "Account", icon: <SupervisorAccountIcon />, path: "account"},
]

export {adminDropdownList, cashierDropdownList};