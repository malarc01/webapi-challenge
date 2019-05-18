const express = require('express');
const db = require('../data/helpers/projectModel');
const router = express.Router();
//  GET request for /projects
router.get('', (req, res) => {
  db.get()
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});
// POST req for /projects.
router.post('', (req, res) => {
  const projectInfo = req.body;

  db.insert(projectInfo)
    .then(project => {
      res.status(201).json({ success: true, project, });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

// PUT req. for /projects/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
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
// DEL request for /projects/:id
router.delete('/:id', (req, res) => {
  const {id } = req.params;

  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
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
        message,
      });
    });
});

//GET request for /projects/:id
//extra method => getProjectActions()
router.get('/:id', (req, res) => {
  const {id } = req.params;

  db.getProjectActions(id)
    .then(asdf => {
      if (asdf) {
        // res.status(200).end();
        res.status(200).json({ success: true, asdf });
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
        message,
      });
    });
});

module.exports = router;
