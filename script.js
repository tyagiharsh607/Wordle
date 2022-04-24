// 0. create a random word
// 1. take cursor to another textfield
// 2. take cursor back after pressing backspace
// 3. if all boxes are not filled and enter is pressed=>'not enough letters'
// 4. if all boxes are filled and enter is pressed,take cursor to next line and 
//   show yellow and green boxes
// 5. if all letters are in right position, game has been won
//  6. if all 6 attempts have been done=>"Game over" and show answer


// Global variables
let randomWord;
let randomWordObj = {};
let wordList;
let newGameBtn=document.querySelector('.new-game');

// Selections
const rows = document.querySelectorAll('.row');
const boxes = document.querySelectorAll('.box');
const box1 = boxes[0];





// events
newGameBtn.addEventListener('click',newGame);

// checking for the character to be an alphabet
boxes.forEach(box => {
    box.addEventListener('keyup', (e) => {
        if (!((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122))) {
            if (e.keyCode != 13) {
                // do not make text field empty if enter is pressed
                e.target.value = '';
            }
        }

    });
});

rows.forEach(row => {
    for (let box of row.children) {
        let dataRow = parseInt(row.getAttribute('data-row'));
        let currentRow = document.querySelector(`[data-row="${dataRow}"]`);
        let dataKey = parseInt(box.getAttribute('data-key'));
        let currentBox = row.querySelector(`[data-key="${dataKey}"]`);
        
        box.addEventListener('keydown', (e) => {

            // shifting cursor to succeding textfield after typig the letter
            if (box.value != '' && e.keyCode != 8) {
                let nextBox = row.querySelector(`[data-key="${dataKey + 1}"]`);
                
                if (nextBox != null) {
                    nextBox.disabled=false;
                    nextBox.focus();
                }
            }



            // preceding the cursor when pressing backspace
            if (e.keyCode == 8) {
                let lastBox = row.querySelector(`[data-key="${dataKey - 1}"]`);
                if (currentBox.value == '' && currentBox.getAttribute(`data-key`) != 1) {
                    lastBox.disabled=false;
                    currentBox.disabled=true;
                    lastBox.focus();
                }


            }
            // what to do when enter is pressed
            if (e.keyCode == 13) {
                if (currentBox.getAttribute('data-key') == 5 && currentBox.value != '') {
                    let nextRow = document.querySelector(`[data-row="${dataRow + 1}"]`);
                    if(wordInList(currentRow)){
                        if (nextRow != null) {
                            currentBox.disabled=true;
                            nextRow.children[0].disabled=false;
                            nextRow.children[0].focus();
                        }
                        checkLetters(currentRow);

                    }

                } else {
                    showMessage('Not enough letters');
                }
                checkWinner(currentRow);
            }



        });

    }
});





// functions





function createWord(words) {
    let randomNo = Math.floor(Math.random() * 2315);
    randomWord = 'sheep';
    randomWordObj={};
    for (let letter of randomWord) {
        if (randomWordObj.hasOwnProperty(letter)) {
            randomWordObj[letter] += 1;
        } else {
            randomWordObj[letter] = 1;
        }

    }
    console.log(randomWord);
}

function listOfWords(words) {
    wordList= words;
}

function wordInList(row){
    let word='';
    for(let box of row.children){
        word+=box.value;
    }
    let thisBox=row.querySelector(`[data-key="${word.length}"]`);
    if(!wordList.includes(word)){
        showMessage('word is not in list');
        thisBox.disabled=false;
        thisBox.focus();
        return false;
    }else{
        return true;
    }
}

function checkLetters(row) {
    let localRandomWordObj={
        ...randomWordObj
    };
console.log(localRandomWordObj);
    let i=0;
    for (let box of row.children) {
     
        if (box.value == randomWord[i]) {
                box.classList.add('right-position');
                localRandomWordObj[box.value]-=1;
                
        }
        i++;
    }
    for (let box of row.children){
        if(!box.classList.contains('right-position')){
            if(localRandomWordObj.hasOwnProperty(box.value) && localRandomWordObj[box.value]>0){
                box.classList.add('wrong-position');
                localRandomWordObj[box.value]-=1;
            }
            else{
                box.classList.add('wrong-letter');
    
            }
        }
    }
    // console.log(localRandomWordObj);
}

function checkWinner(row){
    let boxList=[...row.children];
    const winnerBox=document.querySelector('.winner');
    const wordleBox=document.querySelector('.wordle');  
    const theWordIs=winnerBox.querySelector('span');
    let won=boxList.every((el)=>{
        return el.classList.contains('right-position');
    });
    if(won==true){
        theWordIs.innerText=randomWord;
        winnerBox.classList.add('show-up');
        wordleBox.classList.add('show-up');
        
    }
    else if(row.getAttribute('data-row')==6){
        theWordIs.innerText=randomWord;
        winnerBox.classList.add('show-up');
        wordleBox.classList.add('show-up');
        const h2=winnerBox.children[0];
        h2.innerText='You Lost'
    }
}
    
function showMessage(message){
    let messageBox=document.querySelector('.messages');
    messageBox.innerText=message;
    messageBox.classList.add('show-up');
    messageBox.addEventListener('transitionend',()=>{
        messageBox.classList.remove('show-up');
    });
}

function newGame(){
    box1.disabled=false;
    box1.focus();
    createWordFunction();
    const winnerBox=document.querySelector('.winner');
    const wordleBox=document.querySelector('.wordle'); 
    winnerBox.classList.remove('show-up');
    wordleBox.classList.remove('show-up');
    for(let box of boxes){
        box.value='';  
        box.classList.remove('wrong-position');    
        box.classList.remove('right-position');    
        box.classList.remove('wrong-letter');    
    }

}


    // data of target words
    function createWordFunction(){

        fetch("./target.json")
        .then(response => {
            return response.json();
        })
        .then(data => createWord(data));
    }



    // data of dictionary
    fetch("./dictionary.json")
        .then(response => {
            return response.json();
        })
        .then(data => listOfWords(data));

    // putting focus on box1
    box1.focus();

createWordFunction();



// to remove clickability of mouse
if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN)
}
document.onmousedown = captureMousedown

function captureMousedown(evt) {
    if (evt) {
        mouseClick = evt.which
    }
    else {
        mouseClick = window.event.button
    }
    
    if (mouseClick==1 || mouseClick==2 || mouseClick==3) {
        return false
    }
}