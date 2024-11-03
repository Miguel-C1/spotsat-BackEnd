import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'Usuário registrado com sucesso', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Função para login de usuário e geração de token JWT
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Busca o usuário pelo nome de usuário
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Compara a senha criptografada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
