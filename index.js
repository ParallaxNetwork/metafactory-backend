import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import fileupload from 'express-fileupload'
import swaggerUiExpress from 'swagger-ui-express'
import swaggerDocument from './swagger.json' assert { type: 'json' }

import userRouter from './routes/user.js'
import fileRouter from './routes/file.js'
import mailRouter from './routes/mail.js'
import projectRouter from './routes/project.js'

import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.port

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument))

app.use(bodyParser.json())
app.use(cors())
app.use(fileupload())

app.use('/user', userRouter)
app.use('/file', fileRouter)
app.use('/mail', mailRouter)
app.use('/project', projectRouter)

// Connect to MongoDB
mongoose.set('strictQuery', false)
mongoose.connect(process.env.db)

// Start the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`)
})
