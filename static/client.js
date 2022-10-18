'use strict'

const socket = new WebSocket('ws://localhost:8001/')

const scaffold = (url, structure) => {
  const api = {}
  const services = Object.keys(structure)
  const protocol = url.substring(0, url.indexOf(':'))
  for (const serviceName of services) {
    api[serviceName] = {}
    const service = structure[serviceName]
    const methods = Object.keys(service)
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve, reject) => {
          switch (protocol) {
            case 'http':
              console.log('HttpSocket protocol', protocol)
              fetch(`${url}/api/${serviceName}/${methodName}/${args}`, {
                method: 'POST',
                headers: { 'Content-Type': 'aplication/json' },
              }).then((data) => {
                const { status } = data
                if (status != 200) {
                  reject(new Error(`Status Code: ${status}`))
                }
                resolve(data.json())
              })
              break
            case 'ws':
              console.log('WebSocket protocol', protocol)
              console.log('state', socket.readyState)
              socket.send(
                JSON.stringify({ name: serviceName, method: methodName, args })
              )
              socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                resolve(data)
              }
              break
            default:
              reject(new Error('protocol not selected'))
          }
        })
    }
  }
  return api
}

const client = {
  url: {
    ws: 'ws://localhost',
    http: 'http://localhost',
  },
  port: 8001,
}
const structura = {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
}
const api = scaffold(`${client.url.ws}:${client.port}`, structura)
