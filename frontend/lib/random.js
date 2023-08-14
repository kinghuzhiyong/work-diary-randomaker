// 生成随机索引列表 - 可以重复，但是小组内不可重复
function getRandomNumbers(arrayLength) {
    const result = [];

    for (let i = 0; i < 15; i += 3) {
        const group = [];
        // let piece = Math.floor(Math.random() * 2) + 3;
        let piece = 3;
        for (let j = 0; j < piece; j++) {
            let randomNumber = Math.floor(Math.random() * arrayLength);
            // 令每一个小组都没有重复的数据
            while (group.indexOf(randomNumber) != -1 && arrayLength >= 3) {
                randomNumber = Math.floor(Math.random() * arrayLength);
            }
            group.push(randomNumber);
        }
        result.push(group);
    }
    return result;
}

// 生成随机索引列表 - 互斥
function getIndependentRandomNumbers(arrayLength) {
    const numbers = Array.from({ length: arrayLength }, (_, i) => i); // 生成包含1到20的数字数组
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5); // 随机打乱数字数组的顺序
    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(shuffledNumbers.splice(0, 3));
        // console.log(shuffledNumbers)
    }
    return result;
}

export function generateIndependentList(arr) {
    console.log("生成互斥的日志列表")
    let randomArr = getIndependentRandomNumbers(arr.length);
    let newRandomArr = randomArr.map((item, index) => {
        return {
            date: index + 1,
            diary: item.map(one => arr[one].detail)
        };
    })
    return newRandomArr;
}

export function generateNotIndependentList(arr) {
    console.log("生成可以重复的日志列表")
    let randomArr = getRandomNumbers(arr.length);
    let newRandomArr = randomArr.map((item, index) => {
        return {
            date: index + 1,
            diary: item.map(one => arr[one].detail)
        };
    })
    return newRandomArr;
}