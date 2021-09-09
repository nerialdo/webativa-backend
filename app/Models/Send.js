'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const client = require('twilio')();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const view = use('View');

class Send extends Model {
    static cobrancaUnica(dados) {
        
    }
}

module.exports = Send
