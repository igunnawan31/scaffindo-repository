import { allowedOrigins } from './allowedOrigins';

export const corsOptions = {
  origin: (
    origin: string,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) {
      // Buat testing, jgn dihapus yh
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true, // needed if using cookies / Authorization headers
  optionsSuccessStatus: 200,
};
