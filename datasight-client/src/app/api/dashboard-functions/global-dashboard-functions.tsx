function formatCustom(number: number): string {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


export {
    formatCustom
}