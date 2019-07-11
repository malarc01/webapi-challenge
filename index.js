const express = require('express');
const knex = require('knex');

const server = express();
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
server.use(express.json());

server.get('/api/dishes', async (req, res) => {
  const payload = await db('dishes');
  res.status(200).json(payload)
});

server.get('/api/dishes/:id', async (req, res) => {
  const { id } = req.params;
  const payload = await db('dishes').where('id', id)
  res.status(200).json(payload[0])
});

server.get('/api/recipes', async (req, res) => {
  const payload = await db('recipes')
    .leftJoin('dishes', 'recipes.dishId', '=', 'dishes.id')
    .select(db.ref('recipes.name').as('Recipe'), db.ref('dishes.name').as('Dish'))
  res.status(200).json(payload)
})

server.get('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const recipePromise = db('recipes')
    .where('recipes.id', '=', id)
    .leftJoin('dishes', 'recipes.dishId', '=', 'dishes.id')
    .select(db.ref('recipes.name').as('recipeName'), db.ref('dishes.name').as('dishName'));
  const ingredientsPromise = db('ingredients').where('recipeId', '=', id);
  const stepsPromise = db('steps')
    .where('recipeId', '=', id)
    .orderBy('stepNumber')
    .select('description');
  const data = await Promise.all([recipePromise, ingredientsPromise, stepsPromise]);
  const [[recipe], ingredients, steps] = data;
  const payload = {
    ...recipe,
    ingredients,
    steps,
  }
  res.status(200).json(payload)
})

server.post('/api/recipes/', async (req, res) => {
  const {
    dishId, dishName, ingredients, steps, recipeName
  } = req.body;
  let recipeId;

  const recipe = { name: recipeName, dishId };
  try {
    await db.transaction(async (trx) => {
      recipeId = await trx('recipes').insert(recipe);
      const stepsPackage = steps.map((step, index) => ({
        recipeId,
        description: step,
        stepNumber: index + 1,
      }));
      const steps = trx('steps').insert(stepsPackage);

      const ingredientsPackage = ingredients.map(ingredient => ({
        ...ingredient,
        recipeId,
      }));
      const ingredientsPromise = trx('ingredients').insert(ingredientsPackage)
      return Promise.all([steps, ingredientsPromise])
    })
  } catch (err) {
    res.status(501).json('Recipe was not successfully created on database');
    return;
  }

  const ingredientsDone = await db('ingredients')
    .where('recipeId', '=', recipeId)
    .select('id', 'unit', 'quantity', 'name')

  const payload = {
    recipeId,
    dishName,
    ...recipe,
    ingredientsDone,
    steps,
  };
  res.status(201).json(payload)
})

server.use((err, req, res, next) => {
  res.status(500).json(err);
  next();
})

server.get('/', (req, res) => {
  // name is not important (could be request, response), position is.
  res.send('!!!!!!!');
  // .send() is a helper method that is part of the response object
});

server.get('/now', (req, res) => {
  const now = new Date().toISOString();
  res.send(now);
});
const port = process.env.PORT || 7000;
server.listen(port, () => {
  console.log('\n*** Server Running on http://localhost:7000 ***\n');
});
