const colors = require('colors');

function Win() {

    this.indexes = [];
    this.isComplete = false;

    this.addPosition = function(index) {
        this.indexes.push(index);
    }

    this.checkComplete = function(bingo) {
        let result = true;
        if (this.indexes.length > 0) {
            this.indexes.forEach((index) => {
                if (!bingo.pickedState[index]) {
                    result = false;
                }
            })
            
        } else {
            throw new Error("Unfilled win");
        }
        return result;
    }

    this.print = function(bingo) {
        let str = 'Win detected'.green + ': [ '
        this.indexes.forEach((index) => {
            let pos = bingo.indexToPosition(index);
            str += `[${pos[0]},${pos[1]}], `
        });
        str = str.substring(0, str.length - 2);
        str += ' ]';
        console.log(str);
    }

}

function Bingo() {

    this.size = 3;
    this.numbers = [];
    this.pickedState = [];

    this.wins = [];

    this.start = function() {
        console.log('start');
        let numbers = this.generateNumbers();
        this.fillField(numbers);
        this.fillWins();
        this.print();

        this.turn();

        console.log("Unpicked : " + this.getUnpickedCount());
    }

    this.fillWins = function() {
        let x, y;
        for (x = 0; x < this.size; x++) { // vertical
            let win = new Win();
            for (y = 0; y < this.size; y++) {
                win.indexes.push(this.positionToIndex(x, y));
            }
            this.wins.push(win);
        }

        for (y = 0; y < this.size; y++) { // horizontal
            let win = new Win();
            for (x = 0; x < this.size; x++) {
                win.indexes.push(this.positionToIndex(x, y));
            }
            this.wins.push(win);
        }

        let win1 = new Win();
        let win2 = new Win();
        for (x = 0; x < this.size; x++) { // diagonal
            win1.indexes.push(this.positionToIndex(x, x));
            win2.indexes.push(this.positionToIndex(x, this.size - 1 - x));
        }

        this.wins.push(win1);
        this.wins.push(win2);
    }

    this.turn = function() {
        let pickedIndex = this.getPickedIndex();
        let pos = this.indexToPosition(pickedIndex);
        this.pickedState[pickedIndex] = true;

        console.log(`Picked position ${pickedIndex} : [${pos[0]}, ${pos[1]}]`.bgGreen);
        this.print();
        
        let newWins = this.checkNewWins();
        if (newWins.length > 0) {
            newWins.forEach(win => {
                win.print(this);
            });
        }

        let winsLeft = this.getWinsLeft();
        if (winsLeft > 0) {
            this.turn();
        }  else {
            console.log('Game Compelte'.green);
        }
    }

    this.getWinsLeft = function() {
        let result = 0;
        this.wins.forEach((win) => {
            if (!win.isComplete) {
                result++;
            }
        })
        return result;
    }

    this.checkNewWins = function() {
        let newWins = [];
        this.wins.forEach((win) => {
            if (!win.isComplete) {
                let isComplete = win.checkComplete(this);
                if (isComplete) {
                    win.isComplete = true;
                    newWins.push(win);
                }
            }
        })
        return newWins;
    }

    this.getUnpickedCount = function() {
        return this.pickedState.reduce((result, value) => value ? result : (result + 1), 0);
    }

    this.getPickedIndex = function() {
        let unpickedCount = this.getUnpickedCount();
        let unpickedIndex = Math.floor(Math.random() * unpickedCount);
        for (let index = 0; index < this.pickedState.length; index++) {
            if (!this.pickedState[index]) {
                if (unpickedIndex <=0) {
                    return index;
                }
                unpickedIndex--;
            }
        }
        throw new Error('Out of state bounds');
    }

    this.generateNumbers = function() {
        let result = []
        let maxNumber = Math.pow(3, 2);
        for (let index = 1; index <= maxNumber; index++) {
            result.push(index);
        }
        return result;
    }

    this.fillField = function(numbers) {
        this.numbers = [];
        this.pickedState = [];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let index = Math.floor(Math.random() * numbers.length);
                let number = numbers.splice(index, 1)[0];
                this.numbers.push(number);
                this.pickedState.push(false);
            }
        }
    }

    this.indexToPosition = function (index) {
        return [index % this.size, Math.floor(index / this.size)];
    }

    this.positionToIndex = function (x, y) {
        return y * this.size + x;
    }

    this.print = function() {
        let logArr = [];
        logArr[0] = '';
        for (let y = 0; y < this.size; y++) {
            rowStr = 'row ' + y.toString().cyan + ': [ ';
            for (let x = 0; x < this.size; x++) {
                let index = this.positionToIndex(x, y);
                if (this.pickedState[index]) {
                    rowStr += this.numbers[index].toString().green + ', ';
                } else {
                    rowStr += this.numbers[index] + ', ';    
                }
                
            }
            rowStr = rowStr.substring(0, rowStr.length - 2) + ' ]';
            console.log(rowStr);
        }
    }
}

const bingo = new Bingo();
bingo.start();