const clientImage = document.querySelector('.userPicture')
clientImage.style.height = window.getComputedStyle(clientImage).width
let currentActive = 0
let clientImageActive = true
clientImage.addEventListener('click', () => {
    if(clientImageActive){
        clientImageActive = false
        clientImage.style.transform = `rotateZ(360deg)`
    }
    setTimeout(() => {
        clientImage.style.transform = ''
    }, 2000)
    setTimeout(() => {
        clientImageActive = true
    }, 4000)
})


const chatRoom = document.querySelector('.chatRoom')
let newMessage = ''
const messageArea = document.querySelector('.typeMessage input')
messageArea.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        addNewUserEntry(currentActive)
    }
})

// Adding a new user message to DOM

async function addNewUserEntry(currentActive){
    newMessage = messageArea.value
    if(newMessage !== ''){
        const newUserEntry = document.createElement('div')
        newUserEntry.classList.add('userEntry')

        const newUserMessage = document.createElement('div')
        newUserMessage.classList.add('userMessage')

        const translatedMessage = await translateToJapanese(newMessage)
        newUserMessage.innerText = translatedMessage

        const userIcon = document.createElement('div')
        userIcon.classList.add('userIcon')
        userIcon.style.backgroundImage = `url('../public/img/client${currentActive+1}.png')`

        newUserEntry.append(newUserMessage, userIcon)
        chatRoom.append(newUserEntry)
        //AI
        messageArea.value = ''
        localStorage.setItem(currentActive, chatRoom.innerHTML)
    }
}

// Adding a new entry that AI returns to DOM

async function addNewAIEntry(AIResponse){
    const newAIEntry = document.createElement('div')
    newAIEntry.classList.add('AIEntry')

    const newAIIcon = document.createElement('div')
    newAIIcon.classList.add('AIIcon')

    const newAIMessage = document.createElement('div')
    newAIMessage.classList.add('AIMessage')
    const translatedMessage = await translateToJapanese(AIResponse)
    newAIMessage.innerText = translatedMessage

    newAIEntry.append(newAIIcon, newAIMessage)
    chatRoom.append(newAIEntry)
}
const sendButton = document.querySelector('.sendMessage')
sendButton.addEventListener('click', addNewUserEntry(currentActive))

// Using Memory Translate API to translte from english -> japanese

async function translateToJapanese(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

// Using Memory Translate API to translte from japanese -> english

async function translateToEnglish(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en&key='eecdeb1c177ba5531d04'&de='mohamedtahahalim@gmail.com'`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}
const userPicture = document.querySelector('.userPicture')
const currentActiveConversations = document.querySelectorAll('.newConvo')
currentActiveConversations.forEach((elem, idx) => {
    elem.addEventListener('click', () => {
        elem.classList.add('active')
        resetClassList()
        userPicture.classList.add(returnImage(idx))
        currentActiveConversations[currentActive].classList.remove('active')
        currentActive = idx
        chatRoom.innerHTML = localStorage.getItem(currentActive)
    })
})
window.addEventListener('load', () => {
    if(localStorage.getItem(currentActive)){
        currentActive = parseInt(localStorage.getItem('currentActive'))
    }
    else{
        currentActive = 0
    }
    chatRoom.innerHTML = localStorage.getItem(currentActive)
    currentActiveConversations[currentActive].classList.add('active')
    resetClassList()
    userPicture.classList.add(returnImage(currentActive))
})
function returnImage(num){
    if(num === 0) return 'userOne' 
    if(num === 1) return 'userTwo' 
    if(num === 2) return 'userThree' 
    if(num === 3) return 'userFour' 
    if(num === 4) return 'userFive' 
}
function resetClassList(){
    userPicture.classList.remove('userOne')
    userPicture.classList.remove('userTwo')
    userPicture.classList.remove('userThree')
    userPicture.classList.remove('userFour')
    userPicture.classList.remove('userFive')
}
window.addEventListener('beforeunload', () => {
    localStorage.setItem('currentActive', currentActive)
})
async function AI_response(message, emotion){
    const API_KEY = '';
    const sentData = {
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: `keep in mind that user is ${emotion}, so say something appropriate to his or her emotions` },
        { role: 'user', content: `${message}` }
    ],
    max_tokens: 200
    };
    const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify(sentData)
                    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const AI_Message = await response.json()
    console.log(AI_Message)
}
/*
function getEmotion(text_Message){

}
*/
//AI_response('My name is Taha, very pleased to meet you', 'Happy')
