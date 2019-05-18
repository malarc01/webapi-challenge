const express = require('express');
const db2=require('../data/helpers/actionModel')
const router = express.Router();
//actions GET request
router.get('', (req, res) => {
  db2.get()
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

//actions post
router.post('', (req, res) => {
  const actionInfo = req.body;

  db2.insert(actionInfo)
    .then(action => {
      res.status(201).json({ success: true, action, });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

// action PUT request
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db2.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the project you are looking for',
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

//actions DEL request
router.delete('/:id', (req, res) => {
  const {id } = req.params;

  db2.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the action you are looking for',
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message,
      });
    });
});

module.exports = router;
