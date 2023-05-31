async function setAnimalID(next) {
    try {
      if (!this.animalID) {
        const count = await this.constructor.countDocuments();
        this.animalID = count + 1;
      }
      next();
    } catch (err) {
      next(err);
    }
  }
  
  module.exports = { setAnimalID };