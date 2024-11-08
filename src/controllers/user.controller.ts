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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Cria o access token (curta duração) e o refresh token (longa duração)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    // Envia o refresh token como um cookie HTTP-only e o access token no corpo da resposta
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ message: 'Login bem-sucedido', token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.jwt;
  
  if (!refreshToken) {
    return res.status(403).json({ message: 'Token de renovação ausente' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
    const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Token de renovação inválido' });
  }
};