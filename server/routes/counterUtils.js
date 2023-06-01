const Counter = require("../models/Counter"); // Import the Counter model

async function getNextCounterValue(modelName, fieldName) {
    let counter = await Counter.findOne({ model: modelName });

    if (!counter) {
        counter = new Counter({ model: modelName, field: fieldName });
    }

    const fieldValue = counter[fieldName] + 1;
    counter[fieldName] = fieldValue;
    await counter.save();

    return fieldValue;
}

module.exports = getNextCounterValue;
