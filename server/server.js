let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

let express= require('express');
let app = express();

let port = 8000;
let url = "mongodb://localhost:27017/neologism";
let wordsSchema = new mongoose.Schema({
    name : { type: String, required: true, unique: true },
    meaning : String,
    searchCount : Number,
    id : mongoose.Schema.Types.ObjectId
});

let words = mongoose.model('words', wordsSchema);

function setup(){
    mongoose.connect(url, {useNewUrlParser: true});
    
    // let agree = new words({ name : "동의보감", meaning : "동의한다", searchCount : 1 });
    
    app.listen(port, function(){
        console.log('Neologism dictionary app listening on port ' + port);
    });

    route();
}

function route(){
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
      });

    app.get('/find', function(req, res){
        let searchWord = req.query.searchWord;

        console.log('searchWord : ' + searchWord);

        words.find({name : searchWord}, function(err, result){

            if(err)
                return res.send(err);
            
            if(result.length === 0)
                return res.send({
                    word : searchWord,
                    meaning : 'No found word'
                });

            return res.send({ 
                word : searchWord,
                meaning : result[0].meaning
            });
        });
    });
}

setup();