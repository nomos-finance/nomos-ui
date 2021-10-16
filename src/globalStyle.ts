import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/screen-size';
  @import 'src/_mixins/vars';
  @import 'src/_mixins/font-face';
`;

export default staticStyles;
