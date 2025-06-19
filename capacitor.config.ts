
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.af95f82ca0cc43cdad9556f682e7f980',
  appName: 'SafeEat - Food Scanner',
  webDir: 'dist',
  server: {
    url: 'https://af95f82c-a0cc-43cd-ad95-56f682e7f980.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    },
    Preferences: {}
  }
};

export default config;
