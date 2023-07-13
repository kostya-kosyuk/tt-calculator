const regex = /^[\d,.]*$/;

const numberCheck = (value: string) => {
    const num = value.replaceAll(',', '.');
    const dotCount = (num.match(/\./g) || []).length;

    return regex.test(value) && dotCount <= 1;
};

export default numberCheck;