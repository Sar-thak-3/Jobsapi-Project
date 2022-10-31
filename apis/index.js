const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors')
const model = require('./models/schema')

require('dotenv').config();

const port = process.env.PORT

const app = express();
app.use(cors());
app.use(express.json());

const MONGOURI = process.env.MONGOURL
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port, async () => {
            console.log("Server is running at http://localhost:5000/jobsapi/everything")
        });
        console.log("connected to mongodb");
    }).catch((err) => {
        console.log(err.message)
    })

app.get('/jobsapi/everything', async (req, res) => {
    console.log(req.query);
    model.find().sort({ datetime: -1 }).then((result) => {

        try {
        // handling job name
            if (req.query.job) {
                let jobFilter = result.filter(function (obj) {
                    if (obj.job_name.toLowerCase().includes(req.query.job.toLowerCase())) {
                        return obj
                    }
                });
                result = jobFilter;
            }

        // handling experience required
            if (req.query.experience) {
                let jobFilter = result.filter(function (obj) {
                    if (obj.experience_required != null && obj.experience_required != "" && !isNaN(obj.experience_required[0] * 1) && !isNaN(obj.experience_required[4] * 1)) {
                        if (req.query.experience >= obj.experience_required[0] * 1 && req.query.experience <= obj.experience_required[4] * 1) {
                            return obj
                        }
                    }
                })
                result = jobFilter;
            }

        // Handling job location
            if (req.query.location) {
                let jobFilter = result.filter(function (obj) {
                    if (obj.job_location != null && obj.job_location != "" && obj.job_location.toLowerCase().includes(req.query.location.toLowerCase())) {
                        return obj;
                    }
                })
                result = jobFilter;
            }

        // handling job salary
            if (req.query.salary) {
                let jobFilter = result.filter(function (obj) {
                    if (obj.job_salary != null && obj.job_salary != "" && !isNaN(obj.job_salary.slice(3, 8) * 1)) {
                        if (((obj.job_salary.slice(3, 8) * 1) <= req.query.salary && (obj.job_salary.slice(10, 14) * 1) >= req.query.salary)) {
                            return obj;
                        }
                    }
                })
                result = jobFilter;
            }

        // handling job skills
            if (req.query.skills) {
                if (Array.isArray(req.query.skills)) {
                    req.query.skills.forEach(function (skill) {
                        let jobFilter = result.filter(function (obj) {
                            if (obj.job_skills != null && obj.job_skills != []) {
                                for (let i = 0; i < obj.job_skills.length; i++) {
                                    if (obj.job_skills[i].toLowerCase().includes(skill.toLowerCase())) {
                                        return obj;
                                    }
                                }
                            }
                        })
                        result = jobFilter;
                    })
                }
                else {
                    let jobFilter = result.filter(function (obj) {
                        if (obj.job_skills != null && obj.job_skills != []) {
                            for (let i = 0; i < obj.job_skills.length; i++) {
                                if (obj.job_skills[i].toLowerCase().includes(req.query.skills.toLowerCase())) {
                                    return obj;
                                }
                            }
                        }
                    })
                    result = jobFilter;
                }
            }


        // handling page number
            if (req.query.page) {
                result = result.slice(20 * (req.query.page - 1), 20 * (req.query.page))
            }
            else {
                result = result.slice(0, 20);
            }


        // handling empty request
            if (result.length === 0) {
                res.status(200).json({ e: "Sorry no matching results" })
            }
            else {
        // handling sending request 
                res.status(200).json({totalResults: result.length ,result});
            }
        }
        catch (err) {
            console.log(err.message);
            res.status(404).json({ error: "Invalid request", api: "http://localhost:5000/jobsapi/everything" })
        }

    });
})

app.use((req, res) => {
    res.status(404).json({ error: "Invalid request", api: "http://localhost:5000/jobsapi/everything" })
})