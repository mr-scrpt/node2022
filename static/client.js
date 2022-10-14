'use strict'

const socket = new WebSocket('ws://localhost:8001/')

const scaffold = (structure) => {
  console.log('start')
  console.log('structure', structure)
  const api = {}
  const services = Object.keys(structure)
  for (const serviceName of services) {
    api[serviceName] = {}
    const service = structure[serviceName]
    const methods = Object.keys(service)
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve) => {
          const packet = { name: serviceName, method: methodName, args }
          socket.send(JSON.stringify(packet))
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            resolve(data)
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
const api = scaffold(structura)
