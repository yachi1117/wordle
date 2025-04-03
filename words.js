let WORDS = [];
let wordsLoaded = false;

// 创建一个Promise来加载单词
const loadWords = new Promise((resolve, reject) => {
    fetch('words.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            console.log('原始文本内容:', text.substring(0, 100) + '...');
            const rawWords = text.split('\n');
            console.log('分割后的原始单词数量:', rawWords.length);
            
            WORDS = rawWords
                .map(word => word.trim().toUpperCase())
                .filter(word => {
                    if (word.length !== 5) {
                        console.log('过滤掉的单词:', word, '长度:', word.length);
                        return false;
                    }
                    return true;
                });
            
            console.log('处理后的单词数量:', WORDS.length);
            console.log('前10个单词:', WORDS.slice(0, 10));
            wordsLoaded = true;
            resolve(WORDS);
        })
        .catch(error => {
            console.error('加载单词库时出错:', error);
            reject(error);
        });
});

export { WORDS, wordsLoaded, loadWords }; 