const workermodel = require('../model/workermodel');
const { v4: uuidv4 } = require('uuid');

const storeWorkerData = async (req, res) => {
  try {
    const books = req.body.book_title.map((title, index) => {
      const images = req.files.filter(file => file.fieldname === 'book_image[]');
      return {
        title: title,
        author: req.body.book_author[index],
        price: req.body.book_price[index],
        category: req.body.category[index], // Ensure category is included here
        condition: req.body.condition,
        book_images: images.map(file => ({
          filename: file.filename,
          contentType: file.mimetype,
          uploadDate: new Date(),
          metadata: {}
        }))
      };
    });

    const newWorker = new workermodel({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
      uniqueId: uuidv4(),
      books: books,
      role: 'worker'
    });

    req.session.user = newWorker;
    const savedWorker = await newWorker.save();
    console.log(savedWorker);
    return { success: true };
  } catch (error) {
    console.error('Error saving worker data:', error);
    return { success: false };
  }
};

module.exports = { storeWorkerData };
