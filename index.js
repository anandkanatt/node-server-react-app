const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User')
require('./models/Survey')
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
      maxAge: 30*24*60*60*1.000,
      keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authroutes')(app);
require('./routes/billingroutes')(app);
require('./routes/surveyroutes')(app);

if(process.env.NODE_ENV === 'production'){

    //serving static content
    app.use(express.static('client/build'));

    //serve index.html if no other route exist
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT);