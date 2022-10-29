const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    job_name: {
        type: String
    },
    job_provider: {
        type: String
    },
    experience_required: {
        type: String,
    },
    job_location: {
        type: String
    },
    job_salary: {
        type: String
    },
    job_link: {
        type: String
    },
    job_skills: {
        type: Array
    },
    datetime: {
        type: Date
    }
});

const model = mongoose.model('alljobs' , jobSchema);
module.exports = model;