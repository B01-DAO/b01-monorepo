import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import react from '@vitejs/plugin-react-refresh';

export default defineConfig({
	plugins: [react(), EnvironmentPlugin({ APP_CONFIG: 'web' })]
});
