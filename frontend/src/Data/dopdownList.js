import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SettingsIcon from '@material-ui/icons/Settings';

const adminDropdownList = [
    {id:"1", name: "Account", icon: <SupervisorAccountIcon />, path: "account"},
    {id:"2", name: "Settings", icon: <SettingsIcon />, path: "settings"},
]

const cashierDropdownList = [
    {id:"1", name: "Account", icon: <SupervisorAccountIcon />, path: "account"},
]

export {adminDropdownList, cashierDropdownList};