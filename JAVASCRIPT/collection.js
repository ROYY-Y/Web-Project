const n5Grid = document.getElementById("N5-grid"); 
const n4Grid = document.getElementById("N4-grid"); 
const n3Grid = document.getElementById("N3-grid"); 
const n2Grid = document.getElementById("N2-grid"); 
const n1Grid = document.getElementById("N1-grid");

const n5Total = document.getElementById("total-bar-N5");
const n4Total = document.getElementById("total-bar-N4");
const n3Total = document.getElementById("total-bar-N3");
const n2Total = document.getElementById("total-bar-N2");
const n1Total = document.getElementById("total-bar-N1");

let t1 = 0;
let t2 = 0;
let t3 = 0;
let t4 = 0;
let t5 = 0;

const serverAddr = "http://localhost:3000";

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    fetchCollection(token).then(data => {
        if (!data) return;
        console.log(data);
        data.vocab.forEach(vocab => { // เข้าไปใน vocab แต่ละตัว
                //แบ่งระดับของการ์ด
            const card = createBackCard(vocab, data.collection);
            if(vocab.level === 'N5') {
                n5Grid.appendChild(card);
            }else if(vocab.level === 'N4') {
                n4Grid.appendChild(card);
            }else if(vocab.level === 'N3') {
                n3Grid.appendChild(card);
            }else if(vocab.level === 'N2') {
                n2Grid.appendChild(card);
            }else if(vocab.level === 'N1') {
                n1Grid.appendChild(card);
            }
        });
        n5Total.innerText = `${t5}/20`;
        n4Total.innerText = `${t4}/20`;
        n3Total.innerText = `${t3}/20`;
        n2Total.innerText = `${t2}/20`;
        n1Total.innerText = `${t1}/20`;   
    });

    
    // You can use the token to fetch user-specific collection data here
});

async function fetchCollection(token) {
    const res = await fetch(`${serverAddr}/collection`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    if(!res.ok) {
        console.error("Error fetching collection:", data.message);
        return null;
    }

    return data;
}

// Example function to create a card element
function createBackCard(vocab, collection) {
    const card = document.createElement('div');
    card.className = 'cards';

    if(collection.some(item => item.vocab_no === vocab.vocab_no)){

        if(vocab.level === 'N5') t5++;
        else if(vocab.level === 'N4') t4++;
        else if(vocab.level === 'N3') t3++;
        else if(vocab.level === 'N2') t2++;
        else if(vocab.level === 'N1') t1++;

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
    }
    return card;
}