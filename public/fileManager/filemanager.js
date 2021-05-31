require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs"
    }
})
require(["vs/editor/editor.main"], () => {})

let targetServer = sessionStorage.getItem("serverId")

function activateButton() {
    activateServer(targetServer).then(() => {
        location.reload()
    })
}

function getPreviousFolder(folder) {
    if (folder === "/") {
        return "/"
    }
    else {
        let folderArray = folder.split("/")
        folderArray = folderArray.filter(element => {return !!element})
        let path = ""
        folderArray.forEach((folder, index, array) => {
            if (index < (array.length - 1)) {
                path += "/" + folder
            }
        })
        return path + '/'
    }
}

async function openFolder(folder) {
    return new Promise((resolve, reject) => {
        listDir(targetServer, folder).then(res => {
            let body = ""
            { //Sorting
                let dirs = []
                let files = []
                res.forEach(dir => {
                    if (dir.directory) {
                        dirs.push(dir)
                    }
                    else {
                        files.push(dir)
                    }
                })
                res = []
                dirs.sort()
                files.sort()
                dirs.forEach(dir => res.push(dir))
                files.forEach(dir => res.push(dir))
            }
            res.forEach(file => {
                if (file.directory) {
                    body += '<a href="javascript:;" onclick="openFolder(\'' + folder + file.name + '/\')">[FOLDER] ' + file.name + '</a><br>'
                }
                else {
                    body += '<a href="javascript:;" onclick="openFile(\'' + folder + file.name + '\')">[FILE] ' + file.name + '</a><br>'
                }
            })

            if (folder !== "/") {
                body += '<br><a href="javascript:;" onclick="openFolder(\'' + getPreviousFolder(folder) + '\')">BACK</a><br>'
            }

            document.body.innerHTML = body
        })
    })
}

function fileName(file) {
    return file.split("/")[file.split("/").length - 1]
}

function fileExtension(file) {
    return file.split(".")[file.split(".").length - 1]
}

let fileEditor

async function openFile(filepath) {
    let options = {}
    switch (fileExtension(fileName(filepath))) {
        case 'json':
            options.language = 'json'
        break
        case 'yml':
            options.language = 'yaml'
        break
    }
    readFile(targetServer, filepath).then(file => {
        options.value = file
        options.automaticLayout = true
        document.body.innerHTML = '<div id="editor" style="height:87%;"><br><a href="javascript:;" onclick="openFolder(\'' + getPreviousFolder(filepath) + '\')">BACK</a><br><br><button onclick="saveFile(\'' + filepath + '\')">SAVE</button>'
        fileEditor = monaco.editor.create(document.getElementById("editor"),options)
    })

}

function saveFile(path) {
    let file = fileEditor.getValue()
    editFile(targetServer, path, file)
}

fetchServer(targetServer).then(server => {
    if (server.serviceOnline) { 
        openFolder("/")
    }
    else {
        document.body.innerHTML = 'Can\'t open file manager, because the server is offline! Would you like to turn it on?<br><button onclick="activateButton()">Yes</button>'
    }
}).catch(res => {
    sessionStorage.removeItem("serverId")
    window.location = '/serverselect'
})