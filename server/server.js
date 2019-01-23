let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

let express = require('express');
let app = express();
let bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = 8000;
let url = "mongodb://localhost:27017/neologism";
let wordsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    meaning: String,
    searchCount: Number,
    id: mongoose.Schema.Types.ObjectId
});

let words = mongoose.model('words', wordsSchema);

function setup() {
    mongoose.connect(url, { useNewUrlParser: true });

    // let agree = new words({ name : "동의보감", meaning : "동의한다", searchCount : 1 });

    app.listen(port, function () {
        console.log('Neologism dictionary app listening on port ' + port);
    });

    route();
}

function route() {
    app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    app.get('/find', function (req, res) {
        let searchWord = req.query.searchWord;

        console.log('searchWord : ' + searchWord);

        words.find({ name: searchWord }, function (err, result) {

            let response = {
                isFound: true,
                word: searchWord,
                meaning: ''
            };

            if (err)
                return res.send(err);

            if (result.length === 0){
                response.isFound = false;
                response.meaning = '신조어 사전에 아직 등록되지 않은 단어입니다.';
                return res.send(response);
            }
            else{
                words.updateOne({ name: searchWord }, { searchCount: result[0].searchCount + 1 }, function(){
                    console.log(result);
                    response.isFound = true;
                    response.meaning = result[0].meaning;
                    return res.send(response);
                });
            }
        });
    });

    app.post('/insert', function (req, res) {
        console.log('insert body : ' + JSON.stringify(req.body, 4, null));
        let newName = req.body.name;
        let newMeaning = req.body.meaning;

        words.create({
            name : newName,
            meaning : newMeaning
        }, () => {
            res.send({
                name : newName,
                meaning : newMeaning
            });
        });

    });
}

setup();