import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://aravind:aravind123@cluster0.x2c1o.mongodb.net/todo")
    .then(() => {
        console.log("Connected to MongoDB!")
    })
    .catch((err) => {
        console.log(err);

    })

const todoschema = new mongoose.Schema(
    {
        title: {
            required: true,
            type: "string",
        },
        description: {
            required: true,
            type: "string",
        }
    }
)


const todomodel = mongoose.model('todoitems', todoschema)

app.get('/', (req, res) => {
    res.send("hello world")
})

let todo = []

//post request
app.post('/todo', async (req, res) => {
    const { title, description } = req.body
    try {
        const newtodo = new todomodel({ title, description })
        await newtodo.save()
        res.status(201).send(newtodo)
        console.log(todo)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

//get request
app.get('/todo', async (req, res) => {
    try {
        const todos = await todomodel.find()
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


app.put('/todo/:id', async (req, res) => {
    try {
        const { title, description } = req.body
        const id = req.params.id;
        const updatedtodo = await todomodel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updatedtodo) {
            return res.status(404).send({ message: 'Todo item is not found' });
        }
        res.json(updatedtodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


app.delete('/todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todomodel.findByIdAndDelete(id)
        res.status(204).end();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

const port = 1000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});