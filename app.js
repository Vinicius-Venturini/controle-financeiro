const express = require('express');
require("express-async-errors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const { AppError } = require('./errors/AppError');
const { errorHandler } = require('./middlewares/errorHandler');

const userRouter = require('./routes/user');
app.use('/user', userRouter);

app.use(function(req, res){
  throw new AppError('Not Found: Rota não encontrada', 404);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('servidor ouvindo na porta ' + PORT);
});
