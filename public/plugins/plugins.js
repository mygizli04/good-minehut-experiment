function search() {
    let searchValue = document.getElementById("search").value
    let resultsDiv = document.getElementById("results")
    getPlugins().then(plugins => {
        let results = []
        plugins.forEach(plugin => {
            if (plugin.name.toLowerCase().startsWith(searchValue.toLowerCase())) {
                results.push(plugin)
            }
        })
        if (results.length === 0) {
            resultsDiv.innerText = "No result could be found for your search query."
        }
        else if (results.length === 1) {
            showPluginInfo(results[0].name)
        }
        else {
            let body = ""
            results.forEach(plugin => {
                body += '<a href="javascript:;" onclick="showPluginInfo(\'' + plugin.name + '\')">' + plugin.name + '</a><br>'
            })
            resultsDiv.innerHTML = body
        }
    })
}

document.getElementById("search").addEventListener('keyup', event => {
    if (event.code === "Enter") {
        document.getElementById("submit").click()
    }
})

function showPluginInfo(plugin) {
    getPlugins().then(plugins => {
        let chosen
        plugins.forEach(_plugin => {
            if (_plugin.name === plugin) {
                chosen = _plugin
            }
        })
        let body = "Installed: "
        chosen.isInstalled(sessionStorage.getItem("serverId")).then(res => {
            body += res.toString() + "<br>"
            body += "Name: " + chosen.name + "<br>"
            body += "Id: " + chosen.id + "<br>"
            body += "File name: " + chosen.fileName + "<br>"
            body += "Description: " + chosen.description + chosen.htmlExtendedDescription + "<br>"
            body += "Created: " + new Date(chosen.created).toString() + "<br>"
            body += "Last Updated: " + new Date(chosen.lastUpdated).toString() + "<br>"
            body += "Version: " + chosen.version + "<br>"

            document.getElementById("results").innerHTML = body
        })
    })
}