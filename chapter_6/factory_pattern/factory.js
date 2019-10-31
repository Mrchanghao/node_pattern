function createPerson(name) {
  const privateProperties = {};

  const person = {
    setName: (name) => {
      if(!name) {
        throw new Error('a person has to be a name')
      }
      privateProperties.name = name;
    },
    getName: () => {
      return privateProperties.name;
    }
  };

  person.setName(name);
  return person;
}