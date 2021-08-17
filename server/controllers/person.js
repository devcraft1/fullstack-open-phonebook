const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const content = `
      Phonebook has info for ${persons.length} people
      <br/><br/>
      ${new Date()}
    `;
    response.send(content);
  });
});

personRouter.get("/", (request, response) => {
  Person.find().then((persons) => {
    response.json(persons.map((p) => p.toJSON()));
  });
});

personRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

personRouter.post("/", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson.toJSON());
    })
    .catch((error) => next(error));
});

personRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

personRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = personRouter;
