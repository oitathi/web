import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config';

const compiler = webpack(webpackConfig);

const PORT = process.env.PORT || 3000;
const server = express();


server.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));

server.use(require('webpack-hot-middleware')(compiler));
server.use(express.static('dist'));


server.get('/resource-status', function (req, res) {
  res.json(
    {
      createdBy: "FAZEMU-TI ",
      nodeVersion: "v8.12.0",
      applicationName: "FAZEMU-WEB V1 ",
    }
  );
});

server.get('/health', function (req, res) {
  res.json(
    {
      status: "OK",
    }
  );
});

server.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../public/index.html'))

);

// app.get('/*', (req, res) => {
//   const context = {};
//   const app = ReactDOMServer.renderToString(
//     <Router location={req.url} context={context}>
//       <App />
//     </Router>
//   );

//   const indexFile = path.resolve('./dist/index.html');
//   fs.readFile(indexFile, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Something went wrong:', err);
//       return res.status(500).send('Oops, better luck next time!');
//     }

//     return res.send(
//       data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
//     );
//   });
// });

server.listen(PORT, () => {
  console.info('FAZEMU-WEB');
  console.info("==> ✅  Servidor Funcionando!!!");
  //console.info(`==> 🌎  Você está no modo ${NODE_ENV}`)
  //console.info(`==> 🌎  Você está no ambiente ${ENVIRONMENT}`)
  //console.info(`==> 🌎  Utilizando a marca ${BRAND}`)
  //console.info(`==> 🌎  Utilizando build ${build.version}`)
  console.info(`==> 🌎  Servidor rodando em: http://localhost:${PORT}/`);
  console.info('');
  console.log('Press Ctrl+C to quit.')
});