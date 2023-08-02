
window.onload = () => {
    const lista = document.querySelector('#lista')
    const botao = document.querySelector('#botao')
    const texto = document.querySelector('#texto')

    botao.addEventListener('click', create)
    lista.addEventListener('click', del)
    lista.addEventListener('click', edit)

    read()
}

function templateLi(id, name, element = true){
    return `${element ?  `<li class="list-group-item">` : '' }
            ${name}
            <i class="btn btn-danger  delete fa fa-trash"  data-id="${id}"> </i>
            <i class="btn btn-primary update fa fa-wrench" data-id="${id}"> </i>
            `
}
function read(){
    lista.innerHTML = ''

    axios.get('/show')
        .then((response) => {
            console.log(response)
            response.data.forEach(element => {
                // lista.innerHTML += `<li class="list-group-item">${element.name}</li>`
                lista.innerHTML += templateLi(element.id, element.name)
            });
        })
        .catch((error) => {
            console.log(error)
        })
}
function create(){
    const name = texto.value
    axios.post('/create', {name})
        .then(function (response) {
            lista.innerHTML += templateLi(response.data[0], name)
        })
        .catch(function(error){
            console.log(error)
        })
}
function edit(element){
    if(element.target.classList.contains('update')){
        const input = document.createElement('input')
        input.type = 'text'
        input.classList = 'form-control'
        input.setAttribute('value', '')
        const pai = element.target.parentElement
        const id = element.target.dataset.id

        pai.innerHTML = ''
        pai.appendChild(input)
        input.addEventListener('keydown', update.bind(pai, id, input))
        input.focus()
    }
}
function update(id, input){
    const x = event.key

    if(x == null || x != 'Enter') return;
    
    axios.put(`/update/${id}`, {name: input.value})
    .then((response) => {
        if(response.status == 200) {
            this.innerHTML = templateLi(id, input.value, false)
        }
    })
    .catch(function(error){
        console.log(error)
    })
}
function del(element){
    // console.log(element)
    if(element.target.classList.contains('delete')){
        const id = element.target.dataset.id
        // console.log(id)

        axios.delete(`/delete/${id}`)
        .then(function(response) {
            if(response.status == 200) {
                lista.removeChild(element.path[1])
            }
        })
        .catch(function(error){
            console.log(error)
        })
    }
}