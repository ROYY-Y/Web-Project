
const level = localStorage.getItem('level')
const serverAddr = "http://localhost:3000";


// variable
const vocabGrid = document.getElementById('vocab-grid')

const vocabTitleContainer = document.getElementById('vocab-title-container')
const vocabTitleText = document.getElementById('vocab-text')
const vocabTitleImg = document.getElementById('title-img')

vocabTitleText.innerText = level
vocabTitleImg.style.backgroundImage = `url(${`../Img/Select/${level}.png`})`

// Decoration

const colorTitle = {"N5":'#cde8ff',"N4":'#9ef2c8',"N3":'#ffe999',"N2":'#fa9aa0',"N1":'#c6baff'}
const colorBG = {"N5":'#e4f2fd',"N4":'#e6fff4',"N3":'#fffbea',"N2":'#ffe1e3',"N1":'#f0e8ff'}

vocabTitleContainer.style.backgroundColor = colorTitle[level]
vocabGrid.style.backgroundColor = colorBG[level]

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = 'Login.html'
        return
    }

    const result = await fetch(`${serverAddr}/prepare?level=${level}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })

    if(!result.ok){
        console.log("Result not ok!")
        return
    }
    const data = await result.json()

    data.result.forEach(vocab => { // insert card into container!
        const card = createBackCard(vocab)
        vocabGrid.appendChild(card)
    });
})


// function ในการสร้าง card
function createBackCard(vocab) {
    const card = document.createElement('div');
    card.className = 'cards';

    const cardBackground = document.createElement("div");
    cardBackground.className = 'cards-background';

    const speakerBox = document.createElement("section");
    const speaker = document.createElement("div");

    speakerBox.className = 'speaker-box';
    speaker.className = 'speaker';

    speaker.addEventListener('click', () => {
        const audio = new Audio(vocab.vocab_audio);
        audio.play();
    });

    speakerBox.appendChild(speaker);

    const cardImg = document.createElement("section");
    cardImg.className = 'card-img';
    cardImg.style.backgroundImage = `url(${vocab.vocab_image})`;

    const kanji = document.createElement("p");
    const hiragana = document.createElement("p");
    const meaning = document.createElement("p");

    kanji.innerText = `${vocab.vocab_kanji}`;
    hiragana.innerText = `${vocab.vocab_hiragana} - ${vocab.vocab_romanji}`;
    meaning.innerText = `${vocab.vocab_meaning}`;

    cardBackground.appendChild(speakerBox);
    cardBackground.appendChild(cardImg);
    cardBackground.appendChild(kanji);
    cardBackground.appendChild(hiragana);
    cardBackground.appendChild(meaning);

    card.appendChild(cardBackground);

    return card;
}