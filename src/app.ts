// Supports ES6
import { create, Whatsapp } from 'venom-bot';

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['pt'], forceNER: true });
// treino de saudações
manager.addDocument('pt', 'bom dia', 'saudacao');
manager.addDocument('pt', 'boa tarde', 'saudacao');
manager.addDocument('pt', 'boa noite', 'saudacao');
manager.addDocument('pt', 'boa madrugada', 'saudacao');
manager.addDocument('pt', 'oi tudo', 'saudacao');
manager.addDocument('pt', 'olá', 'saudacao');

manager.addDocument('pt', 'qual o seu telefone', 'informacao.fone');
manager.addDocument('pt', 'me passa o telefone', 'informacao.fone');
manager.addDocument('pt', 'telefone de voces', 'informacao.fone');

manager.addDocument('pt', 'onde vocês ficam', 'localizacao');
manager.addDocument('pt', 'quero a localizacao de vocês', 'localizacao');
manager.addDocument('pt', 'qual o ponto de referencia', 'localizacao');
manager.addDocument('pt', 'endereco de vocês', 'localizacao');
manager.addDocument('pt', 'sua localização', 'localizacao');
manager.addDocument('pt', 'qual o endereco', 'localizacao');
manager.addDocument('pt', 'me passa o endereco', 'localizacao');

// Train also the NLG
manager.addAnswer('pt', 'saudacao', 'Olá, sou um atendente virtual, estou aqui para ajudá-lo, qual a sua dúvida?');
manager.addAnswer('pt', 'saudacao', 'Olá, sou um atendente virtual, em que posso ajudá-lo?');
manager.addAnswer('pt', 'saudacao', 'Oi, tudo bem, sou um atendentende virtual, estou aqui para ajudá-lo.');
manager.addAnswer('pt', 'informacao.fone', 'Nosso telefone é 61 3224-0806');
manager.addAnswer('pt', 'informacao.fone', 'Você pode entrar em contato conosco através do 61 3224-0806');
manager.addAnswer('pt', 'localizacao', 'Nosso endereço fica em Brasilia-DF');
manager.addAnswer('pt', 'localizacao', 'Ficamos em Brasilia-DF');

// Train and save the model.
(async() => {
    await manager.train();
    manager.save();

    create('BOT')
    .then((client) => {
      client.onMessage(async (message) => {
        if (message.isGroupMsg === false) {

          
          const response = await manager.process('pt', message.body.toLowerCase());

          if(response.intent === 'None'){
            console.log(response);
            client.sendText(message.from, 'Desculpe não entendi o que você falou :(, por favor repita...');
          }else{
            console.log(response);
            console.log(response.intent);
            client.sendText(message.from, response.answer);
          }
          
          // switch(message.body.toLowerCase()){
          //   case 'bom dia':
          //     client.sendText(message.from, 'Olá Bom Dia!, Nós da Olhachei estamos feliz em falar com você.');
          //     break;
    
          //   case 'boa tarde':
          //     client.sendText(message.from, 'Olá Boa Tarde!, Nós da Olhachei estamos feliz em falar com você.');
          //     break;
            
          //   default:
          //     break;
    
          // }
          
          // client
          //   .sendText(message.from, 'Seja bem vindo à Olhachei!')
          //   .then((result) => {
          //     console.log('Result: ', result); //return object success
          //   })
          //   .catch((erro) => {
          //     console.error('Error when sending: ', erro); //return object error
          //   });
        }
      })
    })
    .catch((erro) => {
      console.log(erro);
    });    
})();


