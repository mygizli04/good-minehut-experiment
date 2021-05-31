//Login file that will handle logging into minehut.

const minehutLoginURL = 'https://authentication-service-prod.superleague.com/v1/user/login/ghost' //URL that *would* be used for ghost login. Used for finding the correct value in minehut.har
const loginURL = '/login' //The URL to be used to ghost login.

let loginData = {
    loggedIn: false,
    servers: [],
    authorization: "",
    currentSession: "",
    userId: ""
}


async function ghostLogin(response) {//I was SO CLOSE to sending NO data to our servers, but shittyleague doesn't have a CORS header for their login page!
    return new Promise((resolve, reject) => {
        fetch(loginURL, {
            headers: {
                "x-slg-user": response.slgSessionData.slgUserId,
                "x-slg-session": response.slgSessionData.slgSessionId,
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
                minehutSessionId: response.minehutSessionData.sessionId,
                slgSessionId: response.slgSessionData.slgSessionId
            })
        }).then(res => res.json().then(res => {
            loginData = {
                loggedIn: true,
                servers: res.minehutSessionData.servers,
                authorization: res.minehutSessionData.token,
                currentSession: res.minehutSessionData.sessionId,
                userId: res.minehutSessionData._id
            }
            sessionStorage.setItem('loginData', JSON.stringify(loginData))
            resolve()
        }).catch(err => {
            reject(err)
        }))
    })
}

async function harLogin(harContents) {
    return new Promise((resolve, reject) => {
        let parsed = JSON.parse(harContents)
        let response;
        parsed.log.entries.forEach(value => {
            if (value.request.url == minehutLoginURL && value.request.method == "POST") {
                try {
                    response = JSON.parse(value.response.content.text)
                }
                catch (err) {
                    document.body.innerHTML = "The specified file is corrupted."
                    return
                }
            }
        })

        if (!response) {
            document.body.innerHTML = "No minehut data found."
        }
        else {
          ghostLogin(response).then(() => {
              resolve()
          }).catch(reject)
        }
    })
}