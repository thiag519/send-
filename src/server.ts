import express, {Request, Response} from "express";
import nodemailer from 'nodemailer'; 
import cors from 'cors';  
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
  port: 465,
  secure: true, // usa SSL
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false, // adiciona isso para evitar travar no Render
  },
});

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});


app.post("/send", async (req: Request, res: Response) => {
  const {nome, email, mensagem} = req.body;

  if(!nome || !email || !mensagem) {
    return res.status(400).json({
      success: false, error: 'Campos obrigatorios não preenchidos'
    })
  }
  try {
    await transporter.sendMail({
      from: `"${nome}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Mensagem do portfólio - ${nome}`,
      text: mensagem,    
    });

    res.json({success: true, message: 'Email enviado com sucesso!'});

  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({success: false, error: 'Erro ao enviar email'});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta:${PORT}`))
