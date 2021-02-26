import GoogleSans from "../assets/font/GoogleSans-Regular.ttf";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const getTheme = () => {

    const googleSans = {
        fontFamily: 'GoogleSans',
        fontStyle: 'normal',
        fontDisplay: 'swap',
        fontWeight: 400,
        src: `
    local('GoogleSans'),
    local('GoogleSans-Regular'),
    url(${GoogleSans}) format('truetype')
  `,
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
    };

    return  createMuiTheme({
        typography: {
            fontFamily: [
                'GoogleSans'
            ].join(','),
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    '@font-face': [googleSans],
                    '*::-webkit-scrollbar': {
                        width: '0.4rem',
                        margin: '1rem',
                        padding: '1rem',
                    },
                    '*::-webkit-scrollbar-track': {
                        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
                        backgroundColor: 'transparent',
                        margin: '1rem 0 1rem 0'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgb(160, 160, 160)',
                        outline: '1px solid slategrey',
                        borderRadius: '0.2rem',
                    },
                },
            },
            MuiTextField: {
                root: {
                    borderRadius: 5
                }
            },
            MuiSpeedDialAction: {
                staticTooltipLabel: {
                    borderRadius: '2rem',
                    transform: 'translateX(2.3rem)',
                    cursor: 'pointer'
                },
                fab: {
                    color: '#65dec6',
                    '&:hover': {
                        backgroundColor: '#FFF',
                        color: '#65dec6'
                    }
                }
            }
        },
        zIndex: {
            appBar: 1350
        },
        /*palette: {
            primary: {
                main: 'rgba(47, 186, 137, 1)'
            }
        }*/
    });

};

export default getTheme;