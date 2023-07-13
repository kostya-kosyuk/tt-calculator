import numberCheck from "./numberCheck";

const changeNum = (num: string, stateChange: (value: string) => void) => {
    if (num === '') {
        stateChange('');
        return;
    }
    if (numberCheck(num)) {
        stateChange(num);
        return;
    }
};

export default changeNum;