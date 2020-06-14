require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Admin = require('../models/users/admin');
const Parent = require('../models/users/parent');
const Staff = require('../models/users/staff');
const Student = require('../models/users/student');
//const User = require('../models/users/user');
const School = require('../models/school/school');
const Question = require('../models/questions/question');

mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => console.log(`Connected to ${con.connections[0].name} database.`))
    .catch(err => console.log(err.name, err.message));

const schools = JSON.parse(fs.readFileSync(`${__dirname}/schools.json`, 'utf-8'));
const admins = JSON.parse(fs.readFileSync(`${__dirname}/admins.js`, 'utf-8'));
const parents = JSON.parse(fs.readFileSync(`${__dirname}/parents.json`, 'utf-8'));
const staffs = JSON.parse(fs.readFileSync(`${__dirname}/staffs.json`, 'utf-8'));
const staffsTwo = JSON.parse(fs.readFileSync(`${__dirname}/staffsTwo.json`, 'utf-8'));
const students = JSON.parse(fs.readFileSync(`${__dirname}/students.json`, 'utf-8'));
const studentsTwo = JSON.parse(fs.readFileSync(`${__dirname}/studentsTwo.json`, 'utf-8'));
const questions = JSON.parse(fs.readFileSync(`${__dirname}/questions.json`, 'utf-8'));


const exportData = async () => {
    try {
        await School.create(schools);
        await Admin.create(admins);
        await Parent.create(parents);
        await Question.create(questions);
        await Staff.create(staffs);
        await Staff.create(staffsTwo);
        await Student.create(students);
        await Student.create(studentsTwo)
        console.log('All exported.');
    } catch (error) {
        console.log(error);
    }
    process.exit(1);
}

const removeData = async () => {
    try {
        await Admin.deleteMany({});
        await Parent.deleteMany({});
        await School.deleteMany({});
        await Staff.deleteMany({});
        await Student.deleteMany({});
        //await User.deleteMany({});
        await Question.deleteMany({});
        console.log('All Deleted!');
    } catch (error) {
        console.log(error);
    }
    process.exit(1);
}

async function writeData() {
    try {
        let parents = await Parent.find().select({ '__v': 0 }).lean();
        let school = await School.find().select({ '__v': 0 }).lean();
        school = JSON.stringify(school, null, 2);
        parents = JSON.stringify(parents, null, 2);
        fs.writeFileSync(`${__dirname}/school.json`, school, 'utf8', (err) => {
            if (err)
                console.log(err);
        });
        fs.writeFileSync(`${__dirname}/parents.json`, parents, 'utf8', (err) => {
            if (err)
                console.log(err);
        });


    } catch (error) {
        console.log(error);
    }
    process.exit(1);
}

if (process.argv[2] === '--remove') {
    removeData();
}

if (process.argv[2] === '--export') {
    exportData();
}
if (process.argv[2] === '--write') {
    writeData();
}

//To remove everything in the currently in the database, run this command: node dev-data/export_dev-data.js --remove

//To fill up the database, run this command: node dev-data/export_dev-data.js --export

