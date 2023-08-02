var restify = require('restify')
var errs = require('restify-errors')

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
})

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'db'
    }
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/', function (req, res, next) {
    knex('rest').then((dados) => {
            res.send(dados)
    }, next)
    return next()
})

server.get('/show/:id', function (req, res, next) {
    const { id } = req.params
    knex('rest')
        .where('id', id)
        .first()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('Registo não encontrado'))
            res.send(dados)
        }, next)
    return next()
})

server.post('/create', function (req, res, next) {
    knex('rest')
        .insert(req.body)
        .then((dados) => {
        res.send(dados);
    }, next)

})

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url)
})