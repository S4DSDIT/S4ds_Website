import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        events: resolve(__dirname, 'events.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        sponsors: resolve(__dirname, 'sponsors.html'),
        team: resolve(__dirname, 'team.html'),
        admin: resolve(__dirname, 'admin.html'),
      }
    }
  }
});
