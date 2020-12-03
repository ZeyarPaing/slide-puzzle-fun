const board = document.querySelector('.board')

function generateList(start, end){
	let list = []	
	for(let i = start; i<end; ++i) {
		list.push(i)	
	}
	return list
}

var [listOfNumbers, setListOfNumbers] = [generateList(1,16), (val) => {listOfNumbers = val}]


function selectRandom(list) {
	if (typeof list == 'object')
	{
		let tempRan = Math.round(Math.random() * (list.length - 1))
		let tempItem = list[tempRan]
		setListOfNumbers(list.filter((e, i, list) => e !== tempItem))
		return tempItem 
	}
}

function placeNumbers() {
	let gameBoardState = [[]]
	for(var j = 0; j < 4; ++j)
	{
		var rowBlock = document.createElement("div")
		rowBlock.className = "row"
		rowBlock.id = ""+j
		for(var i = 0; i < 4; ++i)
		{
			let tempComponent = document.createElement("div")
			let randomElement = selectRandom(listOfNumbers)
			gameBoardState[j] = gameBoardState[j] || []
			gameBoardState[j].push(randomElement)
			tempComponent.textContent = randomElement
			tempComponent.className = "col"
			tempComponent.id = ""+j+i
			rowBlock.appendChild(tempComponent)
		}
		board.appendChild(rowBlock)
	}
	let freeBlock = document.getElementById(`${j-1}${i-1}`)
	freeBlock.classList.add('free-block')
	return gameBoardState
}

function detectMoves() 
{
	window.addEventListener('keydown', (e) => {
		makeMoves(e.key)
	})
	let blocks = document.querySelectorAll('.col')
//	blocks.forEach(e => {bbiasdf
	board.addEventListener('click', evt => {
			let aimedBlock = evt.path[0]
			let aimedBlockId = [+aimedBlock.id[0], +aimedBlock.id[1]]
			let freeBlock = document.querySelector('.free-block')
			let fBlockId = [+freeBlock.id[0], +freeBlock.id[1]]
			let indicator = (aimedBlockId[0]-fBlockId[0]) + "" + (aimedBlockId[1]-fBlockId[1])

			//console.log('aimedBlick - freeblock [0]', indicator)

			switch(indicator) {
				case "-10": makeMoves('ArrowDown');break;
				case "0-1": makeMoves('ArrowRight');break;
				case "01": makeMoves('ArrowLeft'); break;
				case "10": makeMoves('ArrowUp');break;
			}
		})
//	})
}
function makeMoves(action) 
{
	let freeBlock = document.querySelector('.free-block')
	let fBlockId = [+freeBlock.id[0], +freeBlock.id[1]]

	let aimedID = []
	switch(action) {
		case 'ArrowRight': 
		case 'd' 				 : aimedID = [fBlockId[0], fBlockId[1]-1]; break;
		case 'ArrowLeft' : 
		case 'a'				 : aimedID = [fBlockId[0], fBlockId[1]+1]; break;
		case 'ArrowUp' 	 : 
		case 'w'			 	 : aimedID = [fBlockId[0]+1, fBlockId[1]]; break;
		case 'ArrowDown' : 
		case 's'				 : aimedID = [fBlockId[0]-1, fBlockId[1]]; break;
		default: return;
	}
	if(aimedID[0] > 3 ||  aimedID[0] < 0 || aimedID[1] > 3 ||  aimedID[1] < 0) return;
	let aimedBlockVal = globalGameState[aimedID[0]][aimedID[1]]
	
	this.prevStateCache = this.prevStateCache || [3,3]
	globalGameState[this.prevStateCache[0]][this.prevStateCache[1]] = aimedBlockVal
	globalGameState[aimedID[0]][aimedID[1]] = undefined
	this.prevStateCache = [aimedID[0], aimedID[1]]


	let aimedBlock = document.getElementById(aimedID.join(''))
	freeBlock.textContent = aimedBlock.innerHTML
	aimedBlock.innerHTML = ''

	aimedBlock.classList.add('free-block')
	freeBlock.classList.remove('free-block')
	moves ++;
	if ( moves > 30 && checkGame()) {
		if(confirm("Congradulations! You won the game. Do you want to play again?")){
			history.go('/')
		}
	}
}
function checkGame() {
	let winCount = 0
	for( let i in globalGameState ) {
		for (let j in globalGameState[i]){
			if (globalGameState[i][j] - i * 4 == +j+1 ) {
				winCount++;
			} 
		}
	}
	return winCount === 15 ? true : false;
}
var globalGameState = placeNumbers()
var moves = 0
detectMoves()