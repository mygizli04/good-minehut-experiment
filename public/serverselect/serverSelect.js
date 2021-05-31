allData().then(servers => {
    let body = ""
    servers.forEach(server => {
        body += "<button onclick=\"selectServer('" + server.id + "')\">" + server.name + "</button><br><br>"
    })
    document.body.innerHTML = body
})

function selectServer(id) {
    sessionStorage.setItem('serverId', id)
    document.location = '/serviceSelection'
}