const xml2js = require('xml2js')
const uuid = require('uuid')
const parser = new xml2js.Parser()

exports.push =  (req, res, cb) => {
  let post_data = ''

  req.on('data', (chunk) => {post_data += chunk})

  req.on('end', () => {
    try {
      parser.parseString(post_data, function (err, sms) {
        let message = {
          type: 'text',
          uid: uuid.v4(),
          author: sms.InboundMessage.From[0],
          body: sms.InboundMessage.MessageText[0],
        }
        console.log(message)
        //souldSaveData
        typeof cb === 'function' && cb(null, message)
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
      console.log("Can't save !", err)
      typeof cb === 'function' && cb(err, null)
    }
  })
}
