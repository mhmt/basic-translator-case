import React from 'react';
import IHistoryItemProps from './entities/IHistoryItemProps';

const HistoryItem = (props: IHistoryItemProps) => {

    const onClick = React.useCallback(() => {
        props.onClickItem(props.data);
    }, [props.data]);

    return (
        <div className='historyItem' onClick={onClick}>
            <span className='historyItemLabel'>English</span>
            <span className='historyItemText'>{props.data.en}</span>
            <span className='historyItemLabel'>Türkçe</span>
            <span className='historyItemText'>{props.data.tr}</span>
        </div>
    )
}

export default React.memo(HistoryItem);