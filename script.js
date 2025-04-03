import { WORDS, wordsLoaded, loadWords } from './words.js';

class WordleGame {
    constructor() {
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameOver = false;
        this.letterStates = {}; // Store the state of each letter
        this.initializeGame();
        this.setupEventListeners();
        
        // Wait for words to load
        loadWords.then(() => {
            this.word = this.getRandomWord();
            console.log('Game initialized, target word:', this.word);
        }).catch(error => {
            console.error('Game initialization failed:', error);
        });
    }

    getRandomWord() {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    initializeGame() {
        const gameBoard = document.getElementById('game-board');
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                row.appendChild(tile);
            }
            gameBoard.appendChild(row);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.querySelectorAll('.keyboard button').forEach(button => {
            button.addEventListener('click', () => {
                const key = button.textContent;
                if (key === 'Enter' || key === 'New Game') {
                    if (this.gameOver) {
                        this.resetGame();
                    } else {
                        this.submitGuess();
                    }
                } else if (key === 'Backspace') {
                    this.deleteLetter();
                } else {
                    this.addLetter(key);
                }
            });
        });
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            if (this.gameOver) {
                this.resetGame();
            } else {
                this.submitGuess();
            }
        } else if (!this.gameOver && event.key === 'Backspace') {
            this.deleteLetter();
        } else if (!this.gameOver && event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
            this.addLetter(event.key.toUpperCase());
        }
    }

    addLetter(letter) {
        if (this.currentTile < 5) {
            const row = document.querySelectorAll('.row')[this.currentRow];
            const tile = row.children[this.currentTile];
            tile.textContent = letter;
            this.currentTile++;
        }
    }

    deleteLetter() {
        if (this.currentTile > 0) {
            this.currentTile--;
            const row = document.querySelectorAll('.row')[this.currentRow];
            const tile = row.children[this.currentTile];
            tile.textContent = '';
        }
    }

    submitGuess() {
        if (this.currentTile !== 5) return;

        const row = document.querySelectorAll('.row')[this.currentRow];
        const guess = Array.from(row.children)
            .map(tile => tile.textContent)
            .join('')
            .toUpperCase();

        if (!wordsLoaded) {
            alert('Word list is loading, please wait...');
            return;
        }

        console.log('Current guess:', guess);
        console.log('Word exists in dictionary:', WORDS.includes(guess));
        console.log('Current dictionary size:', WORDS.length);
        console.log('First 10 words:', WORDS.slice(0, 10));

        if (!WORDS.includes(guess)) {
            alert('Not a valid word!');
            return;
        }

        this.checkGuess(guess);
        this.currentRow++;
        this.currentTile = 0;

        if (guess === this.word) {
            this.gameOver = true;
            setTimeout(() => alert('Congratulations! You won! press Enter to start a new game'), 500);
        } else if (this.currentRow === 6) {
            this.gameOver = true;
            setTimeout(() => alert(`Game Over! The word was: ${this.word} press Enter to start a new game`), 500);
        }
    }

    checkGuess(guess) {
        const row = document.querySelectorAll('.row')[this.currentRow];
        const tiles = row.children;
        const wordArray = this.word.split('');
        const guessArray = guess.split('');

        // 先标记正确的位置
        guessArray.forEach((letter, index) => {
            if (letter === wordArray[index]) {
                tiles[index].classList.add('correct');
                this.updateLetterState(letter, 'correct');
                wordArray[index] = null;
            }
        });

        // 再标记存在但位置错误的字母
        guessArray.forEach((letter, index) => {
            if (tiles[index].classList.contains('correct')) return;

            const letterIndex = wordArray.indexOf(letter);
            if (letterIndex !== -1) {
                tiles[index].classList.add('present');
                this.updateLetterState(letter, 'present');
                wordArray[letterIndex] = null;
            } else {
                tiles[index].classList.add('absent');
                this.updateLetterState(letter, 'absent');
            }
        });

        // 更新键盘颜色
        this.updateKeyboardColors();
    }

    updateLetterState(letter, state) {
        // Don't downgrade if letter state is already 'correct'
        if (this.letterStates[letter] === 'correct') return;
        
        // Only upgrade to 'correct' if current state is 'present'
        if (this.letterStates[letter] === 'present' && state !== 'correct') return;
        
        this.letterStates[letter] = state;
    }

    updateKeyboardColors() {
        document.querySelectorAll('.keyboard button').forEach(button => {
            const letter = button.textContent;
            if (letter === 'Enter' || letter === 'Backspace') return;
            
            // 移除所有颜色类
            button.classList.remove('correct', 'present', 'absent');
            
            // 添加新的颜色类
            if (this.letterStates[letter]) {
                button.classList.add(this.letterStates[letter]);
            }
        });
    }

    resetGame() {
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameOver = false;
        this.letterStates = {};
        this.word = this.getRandomWord();
        
        // Clear game board
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        this.initializeGame();
        
        // Reset keyboard colors
        document.querySelectorAll('.keyboard button').forEach(button => {
            button.classList.remove('correct', 'present', 'absent');
        });
    }
}

// 初始化游戏
const game = new WordleGame(); 