export const sleep = () => {
    return new Promise(resolve => setTimeout(resolve, 500));
}