// Design tokens — paleta azul-petróleo + âmbar
export const theme = {
  colors: {
    // Azul-petróleo (5 tons)
    b1: '#2e5f7a',
    b2: '#3a7a9c',
    b3: '#2e9ac4',
    b4: '#7abcd8',
    b5: '#a8cedd',

    // Âmbar — acento quente
    amber:    '#c8821a',
    amberD:   '#a6670e',
    amberL:   '#fef3e2',
    amberM:   '#f5c87a',

    // Sage — sucesso
    teal:     '#2e8c6e',
    tealL:    '#e4f5ef',
    tealM:    '#7dcdb4',

    // Erro
    red:      '#c94f4f',
    redL:     '#fdf1f1',
    redB:     '#f0a5a5',

    // Neutros warm-slate
    g50:  '#f6f8fa',
    g100: '#edf1f5',
    g200: '#dce4eb',
    g300: '#bfcdd8',
    g400: '#9aaebb',
    g500: '#7a90a0',
    g600: '#587080',
    g700: '#3d5060',
    g800: '#253540',
    g900: '#121c23',

    white: '#ffffff',
  },

  shadows: {
    sm: '0 1px 3px rgba(30,60,80,.07), 0 1px 2px rgba(30,60,80,.04)',
    md: '0 4px 16px rgba(30,60,80,.10), 0 2px 6px rgba(30,60,80,.05)',
    lg: '0 12px 40px rgba(30,60,80,.14), 0 4px 14px rgba(30,60,80,.07)',
  },

  radii: {
    sm:  '4px',
    md:  '8px',
    lg:  '12px',
    xl:  '16px',
    xxl: '20px',
    full:'9999px',
  },

  fonts: {
    body: "'Plus Jakarta Sans', sans-serif",
  },

  fontSizes: {
    xs:  '10px',
    sm:  '11.5px',
    md:  '13px',
    lg:  '15px',
    xl:  '18px',
    xxl: '24px',
  },

  sidebar: {
    width: '220px',
  },

  topbar: {
    height: '58px',
  },
}
