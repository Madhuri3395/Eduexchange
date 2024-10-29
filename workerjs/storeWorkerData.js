const sellermodel = require('../model/workermodel');
const { v4: uuidv4 } = require('uuid');

const storeWorkerData = async (req, res) => {
  try {
    const books = req.body.book_title.map((title, index) => {
      const image = req.files[index]; // Assign the correct image to the corresponding book
      return {
        title: title,
        author: req.body.book_author[index],
        price: req.body.book_price[index],
        category: req.body.category[index],
        condition: req.body.condition,
        book_image: { // Store single image object
          filename: image.filename,
          contentType: image.mimetype,
          uploadDate: new Date(),
          metadata: {}
        }
      };
    });

    const newWorker = new sellermodel({
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
