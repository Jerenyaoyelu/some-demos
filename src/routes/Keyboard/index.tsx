import { useEffect, useRef, useState } from 'react';
import { keys, Mode, funcBtnKey, Lang, layout, display, LayoutName, modeEnum, numbersReg } from './constant';
import Keyboard from 'simple-keyboard';
import { pinyin_dict_notone } from './pinyin_dict_notone';
import 'simple-keyboard/build/css/index.css';
import './index.css';
import { includes } from 'lodash';

const specials = ['u', 'v', 'i'];

const endAddable = ['h', 'o', 'n', 'a', 'e', 'i']; // 后面可能还会跟其他字母

export const MyKeyboard: React.FC = () => {
  // const [mode, setMode] = useState<Mode>('letter');
  const [input, setInput] = useState<string>('');
  const kb = useRef<any>(null);
  const [chinese, setChinese] = useState<string>('');
  const [candidates, setCandidates] = useState<string>('');
  const [dict, setDict] = useState<{ [propName: string]: string }>(pinyin_dict_notone);
  const inputRef = useRef<string>('');
  const modeRef = useRef<Mode>(modeEnum.LETTER);
  const [lang, setLang] = useState<Lang>('cn');
  const candidatesRef = useRef<string>('');

  useEffect(() => {
    if (!kb.current) {
      kb.current = new Keyboard({
        onChange: input => onChange(input),
        onKeyPress: button => onKeyPress(button),
        layout,
        display,
        theme: "hg-theme-default hg-theme-ios",
      });
    }
  }, [])

  const onChange = (v: string) => {
    console.log('change', v);
  }

  const handleLayoutChange = (button: string) => {
    let currentLayout = kb.current.options.layoutName;
    let layoutName: LayoutName = LayoutName.DEFAULT;

    switch (button) {
      case "{shift}":
      case "{default}":
      case "{shiftactivated}":
        layoutName = currentLayout === LayoutName.DEFAULT ? LayoutName.SHIFT : LayoutName.DEFAULT;
        break;

      case "{alt}":
        layoutName = currentLayout === LayoutName.ALT ? LayoutName.DEFAULT : LayoutName.ALT;
        break;

      case "{smileys}":
        layoutName = currentLayout === LayoutName.SMILEYS ? LayoutName.DEFAULT : LayoutName.SMILEYS;
        break;
      default:
        break;
    }

    if (layoutName) {
      kb.current.setOptions({
        layoutName: layoutName
      });
    }
  }

  const onKeyPress = (btn: string) => {
    console.log('press', btn, inputRef.current);
    const old = modeRef.current; // 缓存旧模式，用于点击了alt/shift等按键时需要选择中文
    // 重置默认模式
    modeRef.current = modeEnum.LETTER;
    if (lang === 'cn') { // 中文模式且有输入
      const isBiaodian = keys.biaodian.includes(btn);
      if (isBiaodian) {
        modeRef.current = modeEnum.BIAODIAN;
      }
      const isFuncBtn = btn.includes("{") && btn.includes("}");
      if (isFuncBtn) {
        modeRef.current = modeEnum.FUNCBTN;
      }
      console.log('run here', btn, modeRef.current);
      if (modeRef.current === modeEnum.LETTER && old === modeEnum.LETTER) {
        // 继续输入拼音
        searchAndPart(btn);
      } else if (modeRef.current === modeEnum.FUNCBTN) {
        // 删除键
        if (btn === funcBtnKey.BACKSPACE) {
          inputRef.current = inputRef.current.slice(0, -1);
          const last = inputRef.current.slice(-1);
          searchAndPart(last);
          setInput(inputRef.current);
        } else if (inputRef.current && [funcBtnKey.ENTER, funcBtnKey.EMOJI, funcBtnKey.SPACE].includes(btn as any)) {
          // 点击了表情、回车、空白键
          chooseCharacter(modeEnum.FUNCBTN, btn);
        } else {
          handleLayoutChange(btn);
        }
      } else { // 键盘的标点.,。
        console.log('runnnnnnnnn here', btn, modeRef.current);
        chooseCharacter(modeRef.current, btn);
      }
    }
  }

  const searchAndPart = (key: string) => {
    const newInput = inputRef.current + key;
    const pySetList = newInput.split("'");
    const newTyped = pySetList[pySetList.length - 1];
    console.log('last', newTyped);
    const reg = new RegExp(`^${newTyped}\\w*`);
    const letters = newTyped.split('');
    const keys: string[] = Object.keys(pinyin_dict_notone).filter((k) => {
      const isEndAddable = endAddable.includes(letters[letters.length - 1]);
      if (newTyped.length > 1 && !isEndAddable) {
        return k === newTyped;
      } else {
        return reg.test(k);
      }
    }).sort();
    const cans = keys.reduce((a, b) => a + dict[b], '');
    console.log('candidates chinese', cans);
    const valueToSet = !cans ? newInput.replace(new RegExp(`(.*)${key}`),
      `$1'${key}`) : newInput;
    // 设置输入预览值
    setInput(valueToSet);
    inputRef.current = valueToSet;
    // 设置匹配的中文
    updateCandidates(cans || '');
  }

  const chooseCharacter = (mode: Mode, key: any) => {
    console.log('pppp', candidatesRef.current);

    if (!candidatesRef.current) {
      const sentence = key === funcBtnKey.SPACE ? ' ' : key;
      updateChinese(sentence); // 输入空格
      return;
    };
    let index: number = 0;
    if (numbersReg.test(key)) { // 点击了默认键盘的切换键后点击数字
      // 也兼容了点击0的场景
      index = parseInt(key);
    }
    updateChinese(candidatesRef.current[index - 1]);
  }

  useEffect(() => {
    console.log('change chiness', chinese.length);

  }, [chinese])

  const updateChinese = (c: string) => {
    const nc = chinese + c;
    setChinese(nc);
    updateCandidates('');
    setInput('');
  }
  const updateCandidates = (v: string) => {
    setCandidates(v);
    candidatesRef.current = v;
  }

  return (
    <div className='kb-wrapper'>
      <input type="text" value={chinese} onChange={(e) => {
        console.log('eee', e);
        setChinese(e.target.value);
      }} />
      <div className='input-py'>{input}</div>
      <DisplayCandidatesChinese cans={candidates} onChoose={(c) => {
        updateChinese(c);
      }} />
      <div className="simple-keyboard"></div>
    </div>
  )
}

interface DisplayCansProp {
  cans: string;
  noChinese?: boolean;
  onChoose?: (v: string) => void;
}

const DisplayCandidatesChinese: React.FC<DisplayCansProp> = ({ cans, noChinese, onChoose }) => {
  const list = !noChinese ? cans.split('') : [];
  const [showAll, setShowAll] = useState<boolean>(false);

  return (
    <div className={`cans-cn ${showAll ? 'all' : ''}`}>
      <div>
        {
          !noChinese ? (
            <div>
              {
                list.map((c, i) => {
                  return (
                    <span className='cn-option' onClick={() => {
                      onChoose?.(c);
                    }} key={i}>{c}</span>
                  )
                })
              }
            </div>
          ) : <div>
            1.{cans}
          </div>
        }
      </div>
      {cans && <button onClick={() => {
        setShowAll(!showAll);
      }} style={{ background: 'lightblue', padding: '0 8px' }}>Toggle</button>}
    </div>

  )
}