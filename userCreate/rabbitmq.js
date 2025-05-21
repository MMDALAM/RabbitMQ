const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue('userNotification');
    await channel.assertQueue('userCreateSuccess', {durable: false, autoDelete: true });
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error:', error.message);
  }
}

function sendToQueueNotification(message) {
  if (!channel) 
    return console.error('RabbitMQ channel is not initialized');
    
  
  channel.sendToQueue('userNotification', Buffer.from(JSON.stringify(message)));
}


function sendToQueueCreateSuccess(message) {
  if (!channel) 
    return console.error('RabbitMQ channel is not initialized');
    
  
  channel.sendToQueue('userCreateSuccess', Buffer.from(JSON.stringify(message)));
}

module.exports = { connectRabbitMQ, sendToQueueNotification,sendToQueueCreateSuccess };
