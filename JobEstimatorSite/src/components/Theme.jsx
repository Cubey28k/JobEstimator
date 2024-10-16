import { createTheme } from "@mui/material";

export const themeOptions = {
palette: {
    mode: 'dark',
    primary: {
    main: '#49ffa5',
    },
    background: {
    default: '#585252',
    paper: '#212121',
    },
},
typography: {
    fontFamily: 'Ubuntu Mono',
    h1: {
    fontFamily: 'Ubuntu Mono',
    },
    h2: {
    fontFamily: 'Ubuntu Mono',
    },
    h3: {
    fontFamily: 'Ubuntu Mono',
    },
    h4: {
    fontFamily: 'Ubuntu Mono',
    },
    h6: {
    fontFamily: 'Ubuntu Mono',
    },
    h5: {
    fontFamily: 'Ubuntu Mono',
    },
    subtitle1: {
    fontFamily: 'Ubuntu Mono',
    },
    subtitle2: {
    fontFamily: 'Ubuntu Mono',
    },
    button: {
    fontFamily: 'Ubuntu Mono',
    fontWeight: 900,
    },
    overline: {
    fontFamily: 'Ubuntu Mono',
    },
},
};

const theme = createTheme(themeOptions);
export default theme;
