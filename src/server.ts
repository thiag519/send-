import express, {Request, Response} from "express";
/*import nodemailer from 'nodemailer'; */
import cors from 'cors';  
import dotenv from "dotenv";
import { Resend } from "resend";


dotenv.config();
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

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
    await resend.emails.send({
      from: `"Portfolio <onboarding@resend.dev>`,
      to: process.env.EMAIL_USER as string, 
      replyTo: email,
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
