export const keys = {
  number: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  biaodian: [
    '@',
    '#',
    '$',
    '&',
    '%',
    '*',
    '(',
    ')',
    '/',
    '.',
    '-',
    ',',
    '"',
    "'",
    '+',
    '=',
    ';',
    ':',
    '!',
    '?',
    '、',
    '。',
  ],
  letter: [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
  ],
  cap_letter: [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
  ],
};

export const layout = {
  default: [
    'q w e r t y u i o p {bksp}',
    'a s d f g h j k l {enter}',
    '{shift} z x c v b n m , . 。',
    '{alt} {smileys} {space}',
  ],
  shift: [
    'Q W E R T Y U I O P {bksp}',
    'A S D F G H J K L {enter}',
    '{shiftactivated} Z X C V B N M , . 。',
    '{alt} {smileys} {space}',
  ],
  alt: [
    '1 2 3 4 5 6 7 8 9 0 {bksp}',
    `@ # $ & * ( ) ' " {enter}`,
    '{shift} % - + = / ; : ! ? 、',
    '{default} {smileys} {space}',
  ],
  smileys: [
    '😀 😊 😅 😂 🙂 😉 😍 😛 😠 😎 {bksp}',
    `😏 😬 😭 😓 😱 😪 😬 😴 😯 {enter}`,
    '😐 😇 🤣 😘 😚 😆 😡 😥 😓 🙄 {shift}',
    '{default} {smileys} {space}',
  ],
};

export const display = {
  '{alt}': '.?123',
  '{smileys}': '\uD83D\uDE03',
  '{shift}': '⇧',
  '{shiftactivated}': '⇧',
  '{enter}': 'return',
  '{bksp}': '⌫',
  '{space}': ' ',
  '{default}': 'ABC',
};

export enum LayoutName {
  DEFAULT = 'default',
  SHIFT = 'shift',
  ALT = 'alt',
  SMILEYS = 'smileys',
}

export const numbersReg = new RegExp(/\d/);
export const capReg = new RegExp(/[A-Z]/);

export type Lang = 'cn' | 'en';
export type Mode = 'biaodian' | 'funcBtn' | 'letter';

export enum modeEnum {
  BIAODIAN = 'biaodian',
  FUNCBTN = 'funcBtn',
  LETTER = 'letter',
}

export enum funcBtnKey {
  BACKSPACE = '{bksp}',
  SPACE = '{space}',
  EMOJI = '{smileys}',
  CAP = '{shift}', //切换大写
  ALT = '{alt}',
  LOWER = '{shiftactivated}', // 切换小写
  ENTER = '{enter}',
}

export const checkTypes = (key: string) => {};
