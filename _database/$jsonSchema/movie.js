const setSchema = require('../setSchema');

const movie = {
    bsonType: "object",
    required: ["_id", "title", "poster", "cast", "director", "genre", "language", "synopsis", "rating", "runtime", "debutDateTime", "isBlockBuster"],
    properties: {
        _id: { bsonType: "string" },
        title: { bsonType: "string" },
        poster: { bsonType: "string" },
        cast: { bsonType: "array", items: { bsonType: "string" } },
        director: { bsonType: "array", items: { bsonType: "string" } },
        trailer: { bsonType: "string" },
        genre: { bsonType: "array", items: { bsonType: "string" } },
        language: { bsonType: "string" },
        synopsis: { bsonType: "string" },
        rating: { bsonType: "string" },
        runtime: { bsonType: "int" },
        debutDateTime: { bsonType: "date" },
        isBlockBuster: { bsonType: "bool" },
    }
};

setSchema("movies", movie);

//validation
//mongo "mongodb+srv://cluster0-yti2p.mongodb.net/cinemaDB" --username qwen --password qwen-pass 
//db.movies.validate({full:true})