// Bring in our scrape script and makeDate scripts
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongose models
var Headline = require("../models/Headline");

module.exports = {
    get: function(data,cb){
        Note.find({
            _headlineID:  data._id
        }, cb);
    },
    save: function(data, cb) {
        var newNote = {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };

        Note.create(newNote, function(err,doc){
            if(err){
                console.log(err);
            }
            else{
                console.log(doc);
                cb(doc);
            }
        });
    }, 
    delete: function(data,cb){
        Note.remove({
            _id: data.id
        }, cb);
    }  
};
