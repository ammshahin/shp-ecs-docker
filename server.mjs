import path from 'path';
import compression from 'compression';
import morgan from 'morgan';
import {createRequestHandler} from '@remix-run/express';
import express from 'express';
import cors from 'cors';
import {installGlobals} from '@remix-run/node';
import cookieParser from 'cookie-parser';
installGlobals();

const BUILD_DIR = path.join(process.cwd(), 'build');
const app = express();
const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: {middlewareMode: true},
        }),
      );

app.use(compression());
// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

app.use(cookieParser());
app.use(cors());
// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    '/assets',
    express.static('build/client/assets', {
      immutable: true,
      maxAge: '1y',
    }),
  );
}
app.use(express.static('build/client', {maxAge: '1h'}));

app.use(morgan('tiny'));

// handle SSR requests
app.all(
  '*',
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
      : await import('./build/server/index.js'),
  }),
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
