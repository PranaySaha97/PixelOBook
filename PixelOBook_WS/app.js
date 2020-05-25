let express= require('express')
let routing= require('./routes/routing')
let bodyparser= require('body-parser')
let cors= require('cors')
let requestLogger= require('./public/javascripts/utilities/requestLogger')
let errorLogger= require('./public/javascripts/utilities/errorLogger')

let app= express()

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use(requestLogger)
app.use(routing)
app.use(errorLogger)

app.listen(3000)
console.log('Server started at port 3000.')