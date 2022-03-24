var express = require('express');

const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

var router = express.Router();

router.get('/', (req, res, next) => {
    Message.find()
    .then((messages) => {
        res.status(200).json(messages)
    })
    .catch(err => {
        res.status(500).json({
            message: 'An error occurred',
            error: err
        })
    })
});

 router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");
  
    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
    });
  
    message.save()
      .then(createdMessage => {
        res.status(201).json({
          message: 'Message added successfully',
          contact: createdMessage
        });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
});

router.put('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
      .then(message => {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        contact.sender = req.body.sender;

        Message.updateOne({ id: req.params.id }, message)
          .then(result => {
            res.status(204).json({
              message: 'Message updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Message not found.',
          error: { contact: 'Message not found'}
        });
      });
  });

  router.delete("/:id", (req, res, next) => {
    Message.findOne({ id: req.params.id })
      .then(contact => {
        Message.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              message: "Message deleted successfully"
            });
          })
          .catch(error => {
             res.status(500).json({
             message: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Message not found.',
          error: { contact: 'Message not found'}
        });
      });
  });


module.exports = router; 