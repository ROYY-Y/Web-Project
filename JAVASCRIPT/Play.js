// set up variable

const vocab = JSON.parse(localStorage.getItem('vocab'))

console.log(vocab)

const level = localStorage.getItem('level')

if(!vocab || !level){
    window.location.href = 'SelectLevel.html'
}

let cnt = 0 // ตัวนับ vocab
let score = 0

// function random nums 

function randomArr() {
    // สร้าง array 0-19
    const nums = Array.from({ length: 20 }, (_, i) => i)

    // ทำการ Fisher–Yates shuffle
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[nums[i], nums[j]] = [nums[j], nums[i]]
    }

    // เอา 10 ตัวแรก
    return nums.slice(0, 10)
}

const random = randomArr()




// Cards variable

const cardContainer = document.getElementById('card-container1')

console.log(cardContainer)

const imgs = document.querySelectorAll('.card-img')
const kanji_hide = document.getElementById('kanji-hide')

const kanji_result = document.getElementById('kanji-result')
const hiragana_romanji_result = document.getElementById('hiragana-romanji-result')
const meaning_result = document.getElementById('meaning-result')


const next = document.getElementById('next-btn')
const answerNo = document.getElementById('answer-no')
const answerYes = document.getElementById('answer-yes')

const currLevel = document.getElementById('curr-level')
const currCnt = document.getElementById('curr-cnt')
const currScore = document.getElementById('score')

const speakers = document.querySelectorAll('.speaker')


let audio_scr = ''
speakers.forEach(e => {
    e.addEventListener('click', () => {
        const audio = new Audio(audio_scr);
        audio.play();
    })
})

console.log(vocab)

answerNo.addEventListener('click', () => {
    next.style.display = 'block'
    cardContainer.classList.add('flip')
    answerNo.style.display = 'none'
    answerYes.style.display = 'none'
})
answerYes.addEventListener('click', () => {
    next.style.display = 'block'
    score++;
    currScore.innerText = `Score : ${score}`
    cardContainer.classList.add('flip')
    answerNo.style.display = 'none'
    answerYes.style.display = 'none'

})


// function รอกด next

function waitForClick(button) {
    return new Promise(resolve => {
        button.addEventListener("click", () => {
            cardContainer.classList.remove('flip')
            setTimeout(()=>{
                console.log("test")
            }, 1000)
            resolve()
        }, { once: true })
    })
}

// function main (play)

async function play() {
    //ใส่ของให้ card
    while (cnt < 10) {
        // ตั้งแต่คำที่ 1 ถึง 10
        const currVocab = vocab[random[cnt]]
        currLevel.innerText = `Level : ${level}`
        currCnt.innerText = `${cnt + 1}/10`
        imgs.forEach(e=>{
            e.style.backgroundImage = `url(${currVocab.vocab_image})`
        })
        audio_scr = currVocab.vocab_audio

        kanji_hide.innerText = currVocab.vocab_kanji
        kanji_result.innerText = currVocab.vocab_kanji
        
        hiragana_romanji_result.innerText = `${currVocab.vocab_hiragana} - ${currVocab.vocab_romanji}`
        meaning_result.innerText = currVocab.vocab_meaning


        cnt++;
        if (cnt == 10) next.innerText = 'FINISH'
        await waitForClick(next)
        if (cnt == 10) window.location.href = 'Home.html'
        
        next.style.display = 'none'
        answerNo.style.display = 'flex'
        answerYes.style.display = 'flex'
    }

}

play()






