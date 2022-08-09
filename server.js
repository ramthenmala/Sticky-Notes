const express = require('express');
const path = require('path');
const app = express();
const { logger } = require('./middleware/logger');
const PORT = process.env.PORT || 3500;

app.use(logger);
// MIDDLEWARE
// parse json request
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.send({
      message: 'No page found',
    });
  } else {
    res.type('tsx').send('404 Not Found');
  }
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} `);
});
