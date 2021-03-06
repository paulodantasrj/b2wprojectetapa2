import connectDB from '../../../utils/connectDB';
import Users from '../../../models/userModel';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../../../utils/tokenGenerator';

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'POST':
      await signin(req, res);
      break;
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (email === '') return res.status(400).json({ err: 'Preencha o email' });
    if (password === '')
      return res.status(400).json({ err: 'Preencha a senha' });

    if (!user) return res.status(400).json({ err: 'Esse usuário não existi.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ err: 'Senha invalida.' });

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createAccessToken({ id: user._id });

    res.json({
      msg: 'Logado com sucesso',
      refresh_token,
      access_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
