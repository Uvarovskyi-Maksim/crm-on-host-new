const mongoose = require('mongoose');
const { Types } = mongoose;

mongoose.connect('mongodb+srv://maksym:Maksimal2003@cluster0.bkqgq0v.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', async () => {
  //// console.log('Успешное подключение к MongoDB');

  const Client = require('./clients'); // Замените на ваш путь до модели

  const originalDocumentId = '65e05b6c9f3981c9d44fc104'; // Замените на реальный _id вашей записи
  const numberOfCopies = 1000;

  try {
    const originalDocument = await Client.findById(originalDocumentId);

    if (!originalDocument) {
      console.error('Документ с указанным _id не найден.');
      return;
    }

    const pageSize = 100; // Количество документов на одной странице
    const pageCount = Math.ceil(numberOfCopies / pageSize);

    for (let page = 1; page <= pageCount; page++) {
      const originalDocuments = await Client.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      for (const originalDocument of originalDocuments) {
        // Генерация новых ObjectId и уникальных email
        const newObjectId = new Types.ObjectId();
        const newEmail = `new_email_${newObjectId.toString()}@example.com`;

        // Создание нового документа с новыми ObjectId и email
        const newDocument = new Client({
          ...originalDocument.toObject(),
          _id: newObjectId,
          email: newEmail,
        });

        await newDocument.save();
      }
    }

    //// console.log(`${numberOfCopies} копий успешно созданы.`);
  } catch (error) {
    console.error('Ошибка при создании копий:', error);
  } finally {
    // Закрытие соединения с базой данных после выполнения операции
    mongoose.connection.close();
  }
});
