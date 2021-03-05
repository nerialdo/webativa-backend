'use strict'
const User = use('App/Models/User');
const AWS = require('aws-sdk');
const Env = use('Env')
class UtilController {
  async tipoUsuario ({ request, response, view, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    const resultRoles = roles[0]
    return resultRoles;
  }

  async veryAuth ({ request, response, view, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    const resultRoles = roles[0]
    return {
      'role': resultRoles
    };
  }

  async sms ({ request, response, view, auth }) {

    const credentials = {
      accessKeyId: Env.get('AWS_ACCESS_KEY'),
      secretAccessKey: Env.get('AWS_SECRET_KEY'),
      region: Env.get('AWS_REGION')
    }

    // // Set region
    AWS.config.update({
        region: 'us-east-1',
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey

    });
    // Create publish parameters

    let params = {
        Message: 'Ol� Ultra Coders', /* required */
        PhoneNumber: '5598987757873',
        // PhoneNumber: '5598985943784',
        // PhoneNumber: '5598986024973',
    };

    // Create promise and SNS service object


    function sendSMS(params) {
        // new AWS.SNS().setSMSAttributes({
        //   attributes: {
        //     DefaultSMSType: 'Promotional'
        //   }
        // }).promise();
        var publishTextPromise = new AWS.SNS().publish(params).promise();
        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(function (data) {
            console.log("MessageID is " + data.MessageId);
            // final()
        }).catch(function (err) {
            console.error(err, err.stack);
        });
    }

    sendSMS(params);


    // function final(){
    //   return "teste"
    // }


  }
}

module.exports = UtilController
