require('dotenv').config();
const { connectRabbitMQ, consumeQueue } = require('./rabbitmq');

async function start() {
  await connectRabbitMQ();

  consumeQueue((message) => {
    console.log('Received message:', message);
    // اینجا می‌توانید منطق نوتیفیکیشن اضافه کنید
  });
}

start().catch(console.error);
