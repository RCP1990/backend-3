import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => {
      return response
    }).catch(error => {
      console.log('fail')
    })
  }
  
  const create = personObject => {
    return axios.post(baseUrl, personObject)
}

  const update = (id, personObject) => {
    console.log(`update ${id} ${personObject.name}`)

    return axios.put(`${baseUrl}/${id}`, personObject)
}

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
}
  
  export default { 
    getAll, 
    create, 
    update, 
    remove
  }