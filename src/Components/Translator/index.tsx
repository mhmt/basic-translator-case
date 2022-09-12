import React from 'react';
import "./style.scss";
import MicrophoneIcon from '../../Assets/microphone.svg';
import useSpeechToText from '../../Hooks/useSpeechToText';
import TranslationService from '../../Services/TranslationService';
import HistoryItem from './HistoryItem';
import IHistoryItem from './entities/IHistoryItem';
import debounce from 'lodash/debounce';

const Translator = () => {
    const [isRecording, setRecording] = React.useState(false);
    const [englishText, setEnglishText] = React.useState<string>();
    const [turkishText, setTurkishText] = React.useState<string>();
    const [history, setHistory] = React.useState<Array<IHistoryItem>>([]);

    const onResult = React.useCallback((text: string | null) => {
        if (text) {
            setEnglishText(text);
        }
        setRecording(false);
    }, []);

    const { startListening, stopListening } = useSpeechToText(onResult)

    const onClickMicrophone = React.useCallback(() => {
        if (!isRecording) {
            startListening();
            setRecording(true);
        } else {
            stopListening();
            setRecording(false);
        }
    }, [isRecording, startListening, stopListening]);

    const addToHistory = React.useCallback((item: IHistoryItem) => {
        setHistory(currentState => {
            let isItemExist = currentState.findIndex(state => state.en === item.en) > -1;
            if (!isItemExist) {
                return [item, ...currentState]
            }
            return currentState;
        });
    }, []);

    // eslint-disable-next-line
    const translateTextDebounced = React.useCallback(debounce((text: string | undefined) => {
        if (text) {
            TranslationService.translate(text).then((response: any) => {
                setTurkishText(response.translatedText);
                addToHistory({ en: text, tr: response.translatedText });
            });
        }
    }, 1000), []);

    React.useEffect(() => {
        translateTextDebounced(englishText);
    }, [englishText, translateTextDebounced]);

    const onClickHistoryItem = React.useCallback((item: IHistoryItem) => {
        setEnglishText(item.en);
        setTurkishText(item.tr);
    }, []);

    const onEnglishTextChange = React.useCallback((e: any) => {
        setEnglishText(e.target.value);
    }, []);

    const onTurkishTextChange = React.useCallback((e: any) => {
        // User cannot change turkish text
    }, []);

    const renderedHistoryList = React.useMemo(() => {
        if (history.length) {
            return (
                <div className='historyContainer'>
                    {history.map((item, index) => {
                        return (
                            <HistoryItem key={"historyItem-" + index} data={item} onClickItem={onClickHistoryItem} />
                        )
                    })}
                </div>
            )
        }
        return <></>
    }, [history, onClickHistoryItem]);

    return (
        <div className='translatorWrapper'>
            <div className="translatorContainer">
                <div className='translateCard'>
                    <span className='cardTop'>English</span>
                    <textarea className='cardContent' value={englishText} onChange={onEnglishTextChange} rows={10} cols={40} />
                </div>
                <div className='translateCard'>
                    <span className='cardTop'>Türkçe</span>
                    <textarea className='cardContent' value={turkishText} onChange={onTurkishTextChange} rows={10} cols={40} />
                </div>
                <div className={'button ' + (isRecording ? "recording" : "")} onClick={onClickMicrophone}>
                    <img alt='microphone-icon' src={MicrophoneIcon} height={24} width={24} />
                </div>
            </div >
            {renderedHistoryList}
        </div>
    )

}

export default React.memo(Translator);