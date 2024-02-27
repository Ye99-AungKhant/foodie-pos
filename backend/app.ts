import express, { Request, Response } from "express";
import fs from "fs";
import bycrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const port = 5000
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let users: { email: string, password: string }[] = []

try {
    const userData = fs.readFileSync("./data/userData.json", "utf-8")
    users = JSON.parse(userData)
} catch (error) {
    users = []
}

app.post("/register", (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send("Email and password is required")
    }

    const salt = bycrypt.genSaltSync(10)
    const hash = bycrypt.hashSync(password, salt)

    const newUser = { email, password: hash }
    users.push(newUser)

    fs.writeFileSync("./data/userData.json", JSON.stringify(users))
    return res.status(200).send({ email })
})

app.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send("Email and password is required")
    }

    const user = users.find((user) => user.email === email)
    if (!user) {
        return res.send("User Not found")
    }

    const passwordMatch = bycrypt.compareSync(password, user.password)

    if (!passwordMatch) {
        return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ email }, "EyCXSUHhVL5Xykn0QVix", {
        expiresIn: "1h",
    })
    res.status(200).send({ token });

})

app.listen(port, () => console.log("servver is running"))