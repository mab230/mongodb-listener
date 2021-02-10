const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var jsonParser = bodyParser.json()
app.use(jsonParser);
const webServerConfig = require('./config/server.config.js');


//start mongo db connection
const mongoClient = require('mongodb').MongoClient(webServerConfig.mongoUrl, {
  poolSize: 10,
  autoReconnect: true,
  reconnectTries: 5,
  useNewUrlParser: true,
});
mongoClient.connect(function (err, db) {
  clientsStateCollection = db.db("clients").collection('clients_status');
  if (err) throw err;
});


var data = [
  {
    "id": 1,
    "name": "ali",
    "age": 40,
    "gender": "Male",
    "username": "ali2020",
    "password": "ali1234"
  },
  {
    "id": 2,
    "name": "janna",
    "age": 90,
    "gender": "Female",
    "username": "janna2020",
    "password": "janna1234"
  },
  {
    "id": 3,
    "name": "hana",
    "age": 39,
    "gender": "Female",
    "username": "hana2020",
    "password": "hana1234"
  },
  {
    "id": 4,
    "name": "mikasa",
    "age": 55,
    "gender": "Female",
    "username": "mikasa2020",
    "password": "mikasa1234"
  },
  {
    "id": 5,
    "name": "dora",
    "age": 9,
    "gender": "Female",
    "username": "dora2020",
    "password": "dora1234"
  }
]
app.get('/all', (req, res) => {
  return res.send(data);
});


app.get('/getActiveAgents', function (req, res) {
  clientsStateCollection.count({ "clientType": "A", "status": "O" }, function (err, result) {
    if (err) {
      let error = { error: err }
      res.send(error);
    }
    else {
      let resJSON = { result: result };
      res.json(resJSON);
    }

  })
})


app.get('/getActiveComandas', function (req, res) {
  clientsStateCollection.count({ "clientType": "C" }, function (err, result) {
    if (err) {
      let error = { error: err }
      res.send(error);
    }
    else {
      let resJSON = { result: result };
      // let obj=JSON.parse(resJSON);
      // console.log(obj);
      res.json(resJSON);
    }

  })
});

app.get('/getIds', function (req, res) {
  clientsStateCollection.find({"conversationId":{$ne:null},"currentAgent":{$ne:null}}).project({conversationId:1,_id:0}).toArray(function (err, result) {
    if (err) {
      let error = { error: err }
      res.send(error);
    }else {
      let arr=[];
      let resultsss;
      for (var i = 0; i<= result.length -1; i++) {
        let obj = result[i].conversationId;
        // console.log(obj);
        arr.push(obj);
        // console.log(arr);
        var energy = arr.join(",");

      }
      resultsss={result:energy};
      console.log(resultsss);
      res.json(resultsss);
    }
});
})

app.post('/auth', (req, res) => {
  var response = {};
  var user = req.body.username;
  var password = req.body.password;
  var filteredArray = data.filter(function (itm) {
    return itm.username == user;
  });
  console.log(filteredArray);
  if (filteredArray.length == 0) {
    response.status = "false";
    response.message = "not found";
  }
  else {
    if (filteredArray[0].password != password) {
      response.status = "false";
      response.message = "incorect password";
    }
    else {
      response.status = "true";
      response.message = filteredArray[0];
    }
  }
  res.setHeader('Content-Type', 'application/json');
  res.json(response)
});

app.listen(2020, () =>
  console.log(`Example app listening on port2020`),
);