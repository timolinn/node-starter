import mongoose from 'mongoose';
import config from './config';
import app from './app';

// stop ensureIndex deprecation warning
mongoose.set('useCreateIndex', true);

// Connect to our Database and handle any bad connections
mongoose.Promise = global.Promise;
mongoose.connect(config.database.uri|| config.database.mongoUri, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Database connection created.');
}).catch(err => {
  console.log(`Something went wrong while i tried connecting to the database→ ${err.message}`);
});

app.set('port', config.server.port || 7777);
const server = app.listen(app.get('port') || 7777, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
