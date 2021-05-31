//Main file that will handle the page.

if (sessionStorage.getItem('loginData')) {
    document.body.innerHTML += '<br><br>You seem to already be logged in. You can login again here if your previous session expired, or <a href="/serverselect">click here</a> to skip login.'
}

document.addEventListener('DOMContentLoaded', () => {
    har.addEventListener('change', (fileList) => {
        let reader = new FileReader()
        reader.addEventListener('load', (contents) => {
            document.body.innerHTML = 'Logging in...'
            harLogin(contents.target.result).then(() => {
                document.location = '/selectserver'
            }).catch(err => {
                document.body.innerHTML = 'An error occured while logging in.<br><br>'+err
            })
        })
        reader.readAsText(fileList.target.files[0])
    })
}, false);