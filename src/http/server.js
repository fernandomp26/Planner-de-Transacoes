import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())


app.get('/transactions', async (req, res) => {
    const transactions = await prisma.transaction.findMany()

    res.status(200).json(transactions)
})

app.post('/transactions', async (req, res) => {
    await prisma.transaction.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            value: parseFloat(req.body.value)
        }
    })
    console.log(req)

    res.status(201);
})

app.delete('/transactions/:id', async (req, res) => {
    await prisma.transaction.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: `Transação ${req.params.id} deletada com sucesso!`})
})


app.listen(3001, () => {
    console.log('🎯 HTTP running on port http://localhost:3001')
})
