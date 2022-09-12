import IHistoryItem from "./IHistoryItem";

interface IHistoryItemProps {
    data: IHistoryItem;
    onClickItem: (item: IHistoryItem) => void;
}
export default IHistoryItemProps;