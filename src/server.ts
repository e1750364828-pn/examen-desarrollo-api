import 'dotenv/config';
import { createApp, createMemberRepository } from './app';

const PORT = Number(process.env.PORT ?? 3000);

createApp(createMemberRepository()).listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
