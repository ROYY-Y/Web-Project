// set up variable
const serverAddr = "http://localhost:3000"
const vocab = JSON.parse(localStorage.getItem('vocab'))

const level = localStorage.getItem('level')

if (!vocab || !level) {
    window.location.href = 'SelectLevel.html'
}

let cnt = 0 // ตัวนับ vocab
let score = 0
let missing = 0

const rememberVocab = []

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


// function เช็ค collection ว่าตอนนี้มีคำอะไรบ้าง

async function getCollection(token) {
    const res = await fetch(`${serverAddr}/collection`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("Error fetching collection:", data.message);
        return null;
    }

    return data.collection;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token')
    const collection = await getCollection(token)
    localStorage.setItem('level', level);   

    // Cards variable

    const cardContainer = document.getElementById('card-container1')

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
    answerNo.addEventListener('click', () => {
        next.style.display = 'block'
        cardContainer.classList.add('flip')
        answerNo.style.display = 'none'
        answerYes.style.display = 'none'
        missing++;
    })


    answerYes.addEventListener('click', () => {
        next.style.display = 'block'
        score++;
        currScore.innerText = `Score : ${score}`
        cardContainer.classList.add('flip')
        answerNo.style.display = 'none'
        answerYes.style.display = 'none'

        let found = false
        for (const item of collection) {
             if(item.vocab_no == vocab[random[cnt]].vocab_no){
                found = true
                break;
             }
        }

        if(!found) rememberVocab.push(vocab[random[cnt]])

    })


    // function รอกด next

    function waitForClick(button) {
        return new Promise(resolve => {
            button.addEventListener("click", () => {
                cardContainer.classList.remove('flip')
                setTimeout(() => {

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
            imgs.forEach(e => {
                e.style.backgroundImage = `url(${currVocab.vocab_image})`
            })
            audio_scr = currVocab.vocab_audio

            kanji_hide.innerText = currVocab.vocab_kanji
            kanji_result.innerText = currVocab.vocab_kanji

            hiragana_romanji_result.innerText = `${currVocab.vocab_hiragana} - ${currVocab.vocab_romanji}`
            meaning_result.innerText = currVocab.vocab_meaning


            if (cnt == 9) next.innerText = 'FINISH'
            await waitForClick(next)
            cnt++;
            if (cnt == 10) {
                localStorage.setItem('rememberVocab',JSON.stringify(rememberVocab)) 
                localStorage.setItem('score',`${score}`)
                localStorage.setItem('missing',`${missing}`)

                window.location.href = 'Result.html'
            }

            next.style.display = 'none'
            answerNo.style.display = 'flex'
            answerYes.style.display = 'flex'
        }

    }

    play()
})









