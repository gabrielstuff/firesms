const xml2js = require('xml2js')
const uuid = require('uuid')
const parser = new xml2js.Parser()

exports.push =  (req, res) => {
  let post_data = ''

  req.on('data', (chunk) => {post_data += chunk})

  req.on('end', () => {
    try {
      parser.parseString(post_data, function (err, sms) {
        let message = {
          type: 'text',
          faultid: uuid.v4(),
          title: sms.InboundMessage.From[0],
          profile: {
            name: sms.InboundMessage.From[0],
            pic: 'default',
            link: null
          },
          url: 'http://tobereplaced.com',
          caption: sms.InboundMessage.MessageText[0],
          source: 'SMS',
          validated: true,
          moderated: false,
          trashed: false
        }
        console.log(data)
        //souldSaveData
      })
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end('OK : processed.')
    } catch (err) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end("NOK : can't processing.")
      console.log("Can't save !")
    }
  })
}
