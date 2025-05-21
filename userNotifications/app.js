require('dotenv').config();
const { connectRabbitMQ, consumeQueue, sendToQueueSaveName } = require('./rabbitmq');

async function start() {
  await connectRabbitMQ();

  

  consumeQueue((message) => {
    console.log('Received message:', message);
    // اینجا می‌توانید منطق نوتیفیکیشن اضافه کنید
    sendToQueueSaveName({ message });
  });


  

}

start().catch(console.error);



