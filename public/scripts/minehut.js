//JS API that implements Minehut's api.

const apiURL = "https://api.minehut.com"

let loginData = JSON.parse(sessionStorage.getItem('loginData'))

if (!loginData) {
    window.location = '/'
}

class File {
    constructor (file) {
        this.blocked = file.blocked
        this.directory = file.directory
        this.name = file.name
    }
}

class Folder {
    constructor (folder) {
        this.blocked = false
        this.directory = folder.directory
        this.name = folder.name
    }
}

async function editFile(id, path, content) {
    callApi('/file/' + id + '/edit/' + path, 'POST', {}, JSON.stringify({content: content}))
}

async function activateServer(id) {
    return new Promise((resolve, reject) => {
        fetchServer(id).then(server => {
            if (server.serviceOnline) {
                startServer(id).then(resolve)
            }
            else {
                startService(id).then(resolve)
            }
        })
    })
}

async function startService(id) {
    return new Promise((resolve, reject) => {
        callApi('/server/' + id + '/start_service', 'POST').then(resolve)
    })
}

async function startServer(id) {
    return new Promise((resolve, reject) => {
        callApi('/server/' + id + '/start', 'POST').then(resolve)
    })
}

async function fetchServer(id) {
    return new Promise((resolve, reject) => {
        allData().then(servers => {
            let result
            servers.forEach(server => {
                if (server.id === id) {
                    result = server
                }
            })
            if (result) {
                resolve(result)
            }
            else {
                reject("Specified server could not be found.")
            }
        })
    })
}

async function readFile(id, path) {
    return new Promise((resolve, reject) => {
        callApi('/file/' + id + '/read/' + path).then(res => resolve(res.content))
    })
}

async function listDir(id, path) {
    return new Promise((resolve, reject) => {
        callApi('/file/' + id + '/list/' + path).then(res => {
            if (res.error) {
                reject(res.error)
            }
            else {
                let files = []
                res.files.forEach(file => {
                    if (file.directory) {
                        files.push(new Folder(file))
                    }
                    else {
                        files.push(new File(file))
                    }
                })
                resolve(files)
            }
        })
    })
}

async function allData() {
    return new Promise((resolve, reject) => {
        callApi('/servers/' + loginData.userId + '/all_data').then(res => {
            if (res.expired) {
                debugger
                sessionStorage.removeItem('loginData')
                window.location = '/'
            }
            else {
                let servers = []
                res.forEach(server => {
                    servers.push(new Server(server))
                })
                resolve(servers)
            }
        })
    })
}

class Server {
    constructor (server) {
        this.id = server._id
        this.activePlugins = server.active_plugins
        this.activeServerPlan = server.active_server_plan
        this.activeServerPlanDetails = server.active_server_plan_detials
        this.backupSlots = server.backup_slots
        this.categories = server.categories
        this.creation = server.creation
        this.creditsPerDay = server.credits_per_day
        this.exited = server.exited
        this.hibernationPrepStartTime = server.hibernation_prep_start_time
        this.installedContentPacks = server.installed_content_packs
        this.lastOnline = server.last_online
        this.maxPlayers = server.max_players
        this.maxRam = server.max_ram
        this.metrics = server.metrics
        this.motd = server.motd
        this.name = server.name
        this.lowerName = server.name_lower
        this.online = server.online
        this.owner = server.owner
        this.platform = server.platform
        this.playerCount = server.player_count
        this.players = server.players
        this.port = server.port
        this.purchasedIcons = server.purchased_icons
        this.purchasedPlugins = server.purchased_plugins
        this.serverIp = server.server_ip
        this.serverPlan = server.server_plan
        this.serverPlanDetails = server.server_plan_details
        this.serverPort = server.server_port
        this.serverProperites = server.server_properties
        this.serviceOnline = server.service_online
        this.shutdownReason = server.shutdown_reason
        this.shutdownScheduled = server.shutdown_scheduled
        this.startedAt = server.started_at
        this.starting = server.starting
        this.status = server.status
        this.stoppedAt = server.stopped_at
        this.stopping = server.stopping
        this.storageNode = server.storage_node
        this.suspended = server.suspended
        this.timeNoPlayers = server.time_no_players
        this.visiblity = server.visibility
    }
}

async function callApi(endpoint, method, headers, body) {
    return new Promise((resolve, reject) => {
        let options = {}

        if (!endpoint) {
            reject("No endpoint specified.")
            return
        }

        if (method) {
            options.method = method
        }
        else {
            options.method = 'GET'
        }

        if (headers) {
            options.headers = headers
        }
        else {
            options.headers = {}
        }

        options.headers.authorization = loginData.authorization,
        options.headers["x-session-id"] =  loginData.currentSession,
        options.headers["Content-Type"] = "application/json"


        if (body) {
            options.body = body
        }

        fetch(apiURL + endpoint, options).then(res => res.json().then(res => {
            resolve(res)
        }))
    })
}