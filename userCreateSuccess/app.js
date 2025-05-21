require('dotenv').config();
const { connectRabbitMQ, consumeQueue } = require('./rabbitmq');

async function start() {
  await connectRabbitMQ();
  
  consumeQueue((message) => {
    console.log(`Api success create User : ${message.name}`);
  });


}

start().catch(console.error);



