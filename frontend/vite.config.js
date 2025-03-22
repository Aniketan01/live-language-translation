import { defineConfig } from 'vite';
import dotenv from "dotenv";
dotenv.config();

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures correct path resolution
});
