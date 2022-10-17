'use strict'

const socket = new WebSocket('ws://localhost:8001/')

const scaffold = (structure, url = null, transport) => {
  const api = {}
  const services = Object.keys(structure)
  console.log('start', transport)
  for (const serviceName of services) {
    api[serviceName] = {}
    const service = structure[serviceName]
    console.log('service', service)
    const methods = Object.keys(service)
    console.log('method', methods)
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve, reject) => {
          console.log('in Promise')

          console.log('serviceName', serviceName)
          console.log('methodName', methodName)
          switch (transport) {
            case 'http':
              console.log('in http client')
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
              console.log('in ws')
              socket.send(
                JSON.stringify({ name: serviceName, method: methodName, args })
              )
              socket.onmessage = (event) => {
                const data = JSON.parse(event.data)
                resolve(data)
              }
              break
            default:
              console.log('in default')
              reject(new Error('transport not selected'))
          }
        })
    }
  }
  return api
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
const api = scaffold(structura, 'http://localhost:8001', 'http')
